# Kivona — Veri Bilimi (ML) Ekibi Devir Teslim Kılavuzu

Hoş geldiniz! Frontend ve Backend (Auth/DB) altyapısı başarıyla kuruldu. Projenin görsel yüzü ve temel mimarisi hazır. Buradan itibaren işin en önemli kısmı olan "Yapay Zeka ve Veri Analizi" size geçiyor.

Aşağıda projeyi bilgisayarınızda nasıl çalıştıracağınız ve tam olarak nereden devam etmeniz gerektiği anlatılmaktadır.

---

## 1. Projenin Şu Anki Durumu

- **Frontend (UI):** Ana sayfa, Kayıt/Giriş ekranları ve Dashboard (Keşfet, Profil vb.) tasarlandı. _Luminous Enterprise_ tasarım sistemi ve Shadcn UI kullanıldı.
- **Veritabanı (Supabase):** PostgreSQL veritabanı kuruldu, tablolar (profiles, competitions, teams vb.) hazırlandı.
- **Kimlik Doğrulama (Auth):** Kullanıcıların GitHub hesaplarıyla uygulamaya giriş yapabildiği güvenli (SSR) bir sistem kuruldu.

---

## 2. Projeyi Kendi Bilgisayarınızda Çalıştırma

Projeyi çalıştırmak için bilgisayarınızda **Node.js** (v18+) yüklü olmalıdır.

### Adım 1: Bağımlılıkları Yükleyin

Terminali açıp projenin web klasörüne gidin ve gerekli paketleri indirin:

```bash
cd kivona/apps/web
npm install
```

### Adım 2: Çevre Değişkenlerini (Env) Ayarlayın

Web uygulamasının veritabanına bağlanabilmesi için ekip arkadaşınızdan (Burak) Supabase URL ve Anon Key bilgilerini isteyin. Ardından `apps/web` dizininde `.env.local` adında bir dosya oluşturup içine yapıştırın:

```env
NEXT_PUBLIC_SUPABASE_URL=buraya_gelecek
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_gelecek
```

### Adım 3: Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine giderek projeyi görebilirsiniz. Sağ üstten veya ana sayfadaki butonlardan "Giriş Yap" diyerek kendi GitHub hesabınızla sisteme kayıt olabilirsiniz.

---

## 3. Sıradaki Geliştirmeler

Önünüzde iki ana teknolojik hedef bulunuyor:

### Görev A: AI Profil Analizi (Next.js & LLM Entegrasyonu)

Kullanıcı giriş yaptığında profil sayfasında **"AI ile Analiz Et"** özelliği bulunuyor. Bu kısmın arka planı size ait:

1. **GitHub Verisi Çekme:** Kullanıcının GitHub adını (Supabase `profiles` tablosundan alarak) kullanarak açık kaynak kodlu projelerini, en çok kullandığı yazılım dillerini GitHub API üzerinden çekecek bir fonksiyon yazılmalı (`lib/github/api.ts`).
2. **AI'a Yorumlatma:** Çekilen bu veri, OpenAI veya Gemini API'sine (Vercel AI SDK kullanılarak) gönderilmeli ve _"Sen bir teknik yetenek analistisin. Bu kullanıcının en güçlü 3 yönünü belirle..."_ gibi bir prompt ile yorumlatılmalı (`app/api/analyze-profile/route.ts`).
3. **Sonucu Ekrana Yansıtma:** Dönen AI cevabının profil sayfasında akarak (streaming text) gösterilmesi.

### Görev B: Akıllı Eşleştirme Motoru (FastAPI Microservice)

Kullanıcıların birbirleriyle veya hackathon takımlarıyla ne kadar uyumlu olduğunu bulan algoritma:

1. `kivona/services/ml-api` klasörü altında Python tabanlı bir FastAPI sunucusu kurabilirsiniz.
2. Kullanıcının GitHub'dan elde edilen yeteneklerini (skills) ve takımın ihtiyaçlarını karşılaştıran bir model (örn. Sentence Transformers ile Embedding çıkarıp Cosine Similarity ölçme) geliştirebilirsiniz.
3. Next.js uygulaması, bu Python sunucusuna istek atarak "Bu iki kişi %87 uyumlu" gibi sonuçlar gösterecek.
