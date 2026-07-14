# Kivona — Supabase & GitHub Auth Kurulum Kılavuzu

Projenin gerçek kullanıcılarla (Auth) ve gerçek veritabanıyla (DB) çalışabilmesi için Supabase üzerinde bir proje açıp aşağıdaki adımları uygulamanız gerekmektedir. Bu işlemleri AI asistanınız sizin adınıza yapamayacağı için **manuel** olarak gerçekleştirmeniz gerekiyor.

## Adım 1: Supabase Projesi Oluşturma
1. [Supabase](https://supabase.com) adresine gidin ve giriş yapın.
2. Dashboard üzerinden **"New Project"** butonuna tıklayın.
3. Proje adını `Kivona` yapın, güvenli bir veritabanı şifresi belirleyin (bu şifreyi not edin).
4. Projenin kurulmasını (yaklaşık 1-2 dakika) bekleyin.

## Adım 2: Çevre Değişkenlerini (Env Variables) Ekleme
Next.js projenizin Supabase'e bağlanabilmesi için URL ve Key bilgilerine ihtiyacı var.
1. Supabase Dashboard'unda, sol alt köşedeki **Project Settings** (dişli ikonu) → **API** bölümüne gidin.
2. Burada **Project URL** ve **anon / public key** değerlerini göreceksiniz.
3. Proje klasöründeki `apps/web/` dizininde yeni bir dosya oluşturun: `.env.local`
4. İçeriğine az önce kopyaladığınız değerleri yapıştırın:
```env
NEXT_PUBLIC_SUPABASE_URL=buraya_project_url_gelecek
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_anon_key_gelecek
```

## Adım 3: Veritabanı Şemasını Kurma
1. Supabase Dashboard'da sol menüden **SQL Editor**'a tıklayın.
2. "New query" (Yeni sorgu) butonuna basın.
3. Projenizdeki `docs/db-schema.sql` dosyasının tüm içeriğini kopyalayıp bu editöre yapıştırın.
4. Sağ alttaki **Run** (Çalıştır) butonuna basın. İşlem başarıyla tamamlandığında tablolarınız (profiles, competitions, teams vb.) oluşmuş olacak.

## Adım 4: GitHub ile Giriş (OAuth) Ayarları
Kullanıcıların GitHub hesaplarıyla uygulamaya üye olabilmesi için bunu Supabase'de aktif etmeliyiz.
1. Supabase Dashboard'da sol menüden **Authentication** → **Providers** sekmesine gidin.
2. **GitHub**'ı bulup tıklayın ve açılan menüden **"Enable GitHub"** switch'ini aktif edin.
3. Sizden `Client ID` ve `Client Secret` isteyecek. Bunları almak için:
   - Yeni bir sekmede [GitHub Developer Settings](https://github.com/settings/developers) sayfasına gidin.
   - **OAuth Apps** → **New OAuth App** butonuna tıklayın.
   - Application Name: `Kivona (Dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `https://<SUPABASE_PROJE_ID_NİZ>.supabase.co/auth/v1/callback` (Supabase GitHub ayarları penceresinde "Callback URL (for OAuth)" olarak yazar, oradan kopyalayın).
   - "Register application" butonuna basın.
   - Karşınıza çıkan sayfadan `Client ID`'yi kopyalayıp Supabase'e yapıştırın.
   - "Generate a new client secret" butonuna basıp yeni oluşturulan Secret kodunu kopyalayıp Supabase'e yapıştırın.
4. Supabase'deki GitHub penceresinde **Save** butonuna basarak kaydedin.

🎉 **Tebrikler!** Artık `npm run dev` yaparak projenizi başlattığınızda "GitHub ile Giriş Yap" butonu gerçek anlamda çalışacak ve sizi `/discover` sayfasına yönlendirecektir.
