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
| `select` | `competitions` | *(şu an statik seed veri kullanılıyor, DB'ye henüz bağlı değil — bkz. `lib/data/competitions.ts`)* |
| `update` | `profiles` | İsim düzenleme (`components/shared/name-onboarding.tsx`, `edit-name-dialog.tsx`) |
| `select`/`insert` | `teams`, `team_members` | Takım oluşturma/katılma (`/team` sayfası) — **RLS policy'leri `db-schema.md`'deki ek SQL uygulanmadan çalışmaz** |
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

- `competitions` tablosu Supabase'e taşınmadı, hâlâ statik dizi (`lib/data/competitions.ts`).
- `/match` sayfasındaki uyum skoru basit küme benzerliğiyle (Jaccard) hesaplanıyor, ML tabanlı değil — `elif` branch'indeki ML servis endpoint'i hazır olduğunda buraya bağlanmalı.
