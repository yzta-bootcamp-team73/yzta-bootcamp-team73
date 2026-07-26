import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export async function POST() {
  try {
    // 1. Kullanıcıyı ve Session'ı doğrula
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (sessionError || !user) {
      return NextResponse.json(
        { error: "Kimlik doğrulama başarısız" },
        { status: 401 }
      );
    }

    // 2. GitHub username'i al
    const githubUsername =
      user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username;

    if (!githubUsername) {
      return NextResponse.json(
        {
          error: "GitHub kullanıcı adı bulunamadı",
          needs_github: true,
        },
        { status: 400 }
      );
    }

    // 3. provider_token'ı doğrudan session'dan al (veritabanından değil)
    const providerToken = session.provider_token;

    if (!providerToken) {
      return NextResponse.json(
        {
          error: "GitHub yetkilendirme token'ı bulunamadı. Lütfen GitHub ile tekrar giriş yapın.",
          needs_github_reauth: true,
        },
        { status: 403 }
      );
    }

    // 4. ML API'ye analiz isteği gönder
    const mlResponse = await fetch(`${ML_API_URL}/api/v1/github/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        github_username: githubUsername,
        access_token: providerToken,
      }),
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      console.error("ML API hatası:", mlResponse.status, errorData);
      return NextResponse.json(
        {
          error:
            errorData?.detail || "Analiz sırasında bir hata oluştu",
        },
        { status: mlResponse.status }
      );
    }

    const analysisResult = await mlResponse.json();

    // 5. Sonucu profiles tablosuna kaydet (user_metadata yerine)
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          github_username: githubUsername,
          role: analysisResult.primary_role,
          skills: analysisResult.skills, // JSONB veya string[] formatında kaydedilir
          ai_analysis: analysisResult,
        })
        .eq('id', user.id);
        
      if (dbError) {
        console.error("Profiles tablosuna analiz sonucu kaydedilemedi:", dbError);
      }
    } catch (dbError) {
      console.error("Veritabanı hatası:", dbError);
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("GitHub analiz endpoint hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
