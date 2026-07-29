import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
          error:
            "GitHub hesabınız bağlı değil. Lütfen önce GitHub hesabınızı bağlayın.",
          needs_github: true,
        },
        { status: 400 }
      );
    }

    // 3. GitHub token'ı al: önce session'dan, yoksa user_metadata'dan
    let providerToken = session.provider_token;

    if (providerToken) {
      // Session'da token varsa user_metadata'ya kaydet (gelecek kullanımlar için)
      try {
        await supabase.auth.updateUser({
          data: { github_access_token: providerToken },
        });
      } catch (e) {
        console.error("Token kaydetme hatası:", e);
      }
    } else {
      // Session'da token yoksa user_metadata'dan al
      providerToken = user.user_metadata?.github_access_token;
    }

    if (!providerToken) {
      return NextResponse.json(
        {
          error:
            "GitHub yetkilendirme token'ı bulunamadı. Lütfen GitHub hesabınızı yeniden bağlayın.",
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

      // GitHub token geçersiz veya süresi dolmuş olabilir
      const errorDetail = String(errorData?.detail || "");
      if (
        mlResponse.status === 401 ||
        mlResponse.status === 403 ||
        errorDetail.toLowerCase().includes("401") ||
        errorDetail.toLowerCase().includes("unauthorized") ||
        errorDetail.toLowerCase().includes("bad credentials")
      ) {
        // Geçersiz token'ı user_metadata'dan temizle
        await supabase.auth.updateUser({
          data: { github_access_token: null },
        });

        return NextResponse.json(
          {
            error:
              "GitHub token'ınızın süresi dolmuş. Lütfen GitHub hesabınızı yeniden bağlayın.",
            needs_github_reauth: true,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error:
            errorData?.detail || "Analiz sırasında bir hata oluştu",
        },
        { status: mlResponse.status }
      );
    }

    const analysisResult = await mlResponse.json();

    // 5. Sonucu profiles tablosuna kaydet
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          github_username: githubUsername,
          role: analysisResult.primary_role,
          skills: analysisResult.skills,
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
