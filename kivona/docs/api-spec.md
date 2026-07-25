# Kivona API Spesifikasyonu

## Next.js (`apps/web`)

### `GET /auth/callback`
Supabase OAuth (GitHub) yetkilendirmesi tamamlandıktan sonra tarayıcının yönlendirildiği route handler.

| Query param | Zorunlu | Açıklama |
|---|---|---|
| `code` | Evet | Supabase'in verdiği OAuth authorization code |
| `next` | Hayır | Başarılı girişten sonra yönlendirilecek path (varsayılan: `/discover`) |

Başarılı: `302` → `next` path'ine yönlendirir, oturum çerezini set eder.
Başarısız: `302` → `/auth/auth-code-error`.

### Middleware (`middleware.ts`)
Her istekte Supabase oturumunu yeniler ve şu rotaları korur: `/discover`, `/profile`, `/match`, `/team`. Girişsiz kullanıcı bu rotalara erişirse `/login`'e yönlendirilir. Girişli kullanıcı `/login` veya `/register`'a giderse `/discover`'a yönlendirilir.

### Veri katmanı (doğrudan Supabase client üzerinden, ayrı bir REST endpoint yok)
Next.js tarafında özel bir `/app/api/*` route'u yoktur — sayfalar Supabase JS client'ı (`lib/supabase/client.ts` / `server.ts`) üzerinden doğrudan Postgres tablolarına (RLS ile korunan) erişir:

| İşlem | Tablo | Kullanıldığı yer |
|---|---|---|
| `select` | `competitions` | Keşfet sayfası — DB'de kayıt yoksa/erişilemezse statik diziye (`lib/data/competitions.ts`) düşer |
| `update` | `profiles` | İsim ve "aradığım roller" düzenleme (`name-onboarding.tsx`, `edit-name-dialog.tsx`, `edit-looking-for-dialog.tsx`) |
| `select` | `profiles` | GitHub kullanıcı adıyla üye arama (`/team` davet formu) |
| `select`/`insert` | `teams`, `team_members` | Takım oluşturma/katılma/davet etme (`/team` sayfası). `team_members.user_id` üzerinde UNIQUE kısıtı var — bir kullanıcı aynı anda yalnızca bir takımda olabilir |
| `select`/`insert`/`update` | `ideas` | Fikir Panosu / Kanban (`/team` sayfası) |
| `select`/`insert` | `icebreaker_responses` | Buz kırıcı kartlar (`/team` sayfası) |

## GitHub REST API (`lib/github/client.ts`)
Next.js sunucu tarafından doğrudan `api.github.com`'a çağrı yapılır (kullanıcı kimlik doğrulaması gerekmez, kullanıcının herkese açık verilerini çeker):

- `GET /users/{username}` — profil bilgisi
- `GET /users/{username}/repos?sort=updated&per_page=100` — repo listesi

Kimliksiz istekler saatte 60 ile sınırlıdır; `.env.local`'e `GITHUB_API_TOKEN` eklenirse bu limit artar (opsiyonel, personal access token, sadece `public_repo` okuma yetkisi yeterli).

## ML Microservice (`services/ml-api`)

FastAPI, `http://localhost:8000` (yerel geliştirme).

### `GET /health`
Servisin ayakta olup olmadığını kontrol eder.

```json
{ "status": "ok", "service": "kivona-ml-api" }
```

### Planlanan ama bu kapsamda eklenmemiş endpoint'ler
- `POST /api/match` — `{ user_skills, team_needs }` → embedding + cosine similarity ile `{ score, explanation }` döner. (`elif` branch'inde çalışması sürüyor.)
- AI Skill Analysis (OpenAI/Gemini ile GitHub verisinden yetenek raporu üretme) — `lib/ai/` klasörü hâlâ boş.

## Bilinen Eksikler

- `/match` sayfasındaki uyum skoru basit küme benzerliğiyle (Jaccard) hesaplanıyor, ML tabanlı değil — `elif` branch'indeki ML servis endpoint'i hazır olduğunda buraya bağlanmalı.
- `/match` sayfasındaki profiller demo/statik veridir (`lib/data/profiles.ts`), gerçek kayıtlı kullanıcılara bağlı değil — bu yüzden oradaki "Takıma Davet Et" butonu devre dışı. Gerçek davet `/team` sayfasındaki "GitHub kullanıcı adıyla üye ekle" formuyla yapılıyor.
- Takım daveti şu an "davet gönder → kabul et" akışı değil, doğrudan ekleme (davet eden kişi zaten üye olmalı). Kabul/red akışı istenirse `team_members`'a bir `status` kolonu (`pending`/`accepted`) eklenmesi gerekir.
