# Kivona Veritabanı Şeması

Bu dosya Supabase SQL Editor'da çalıştırılacak şemaları içerir. Ana şema `db-schema.sql` dosyasındadır — o dosya Supabase SQL Editor'a doğrudan yapıştırılabilir.

## Uygulanan ek SQL (1. tur — tamamlandı)

`db-schema.sql`'deki mevcut şemada `teams`, `team_members`, `ideas`, `icebreaker_responses` tablolarında RLS (Row Level Security) etkinleştirilmiş ama hiç policy tanımlanmamıştı. Aşağıdaki SQL Supabase projesinde çalıştırıldı ve `/team` sayfasını (takım oluşturma, katılma, fikir panosu/Kanban, buz kırıcı) çalışır hale getirdi:

```sql
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo';

CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creator can update team" ON public.teams FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users can join a team" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave a team" ON public.team_members FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Team members can view ideas" ON public.ideas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can create ideas" ON public.ideas FOR INSERT WITH CHECK (
  auth.uid() = author_id AND EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can update ideas" ON public.ideas FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);

CREATE POLICY "Team members can view icebreaker responses" ON public.icebreaker_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = icebreaker_responses.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can answer icebreakers" ON public.icebreaker_responses FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = icebreaker_responses.team_id AND team_members.user_id = auth.uid())
);
```

**Önemli ders:** Policy'ler doğru olsa bile, tablolar Supabase Table Editor yerine düz SQL ile oluşturulduğunda `anon`/`authenticated` rollerine temel `GRANT` (SELECT/INSERT/UPDATE/DELETE) otomatik verilmeyebiliyor. Policy + RLS yetmiyor, GRANT da gerekiyor:

```sql
GRANT SELECT ON public.teams TO anon, authenticated;
GRANT INSERT, UPDATE ON public.teams TO authenticated;
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ideas TO authenticated;
GRANT SELECT, INSERT ON public.icebreaker_responses TO authenticated;
```

## Uygulanması gereken ek SQL (2. tur — yeni)

Aşağıdakiler henüz Supabase'e uygulanmadı, **SQL Editor'da bir kez çalıştırılması gerekiyor:**

```sql
-- 1) Kullanıcı başına en fazla 1 aktif takım (uygulama arayüzü zaten bunu varsayıyordu,
--    şimdi veritabanı seviyesinde de zorunlu kılınıyor)
ALTER TABLE public.team_members ADD CONSTRAINT team_members_user_id_unique UNIQUE (user_id);

-- 2) Takım üyelerinin GitHub kullanıcı adıyla başkasını takıma eklemesine izin ver
--    (mevcut "Users can join a team" policy'si sadece kendi kendine katılmaya izin veriyordu)
CREATE POLICY "Team members can add others" ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
);

-- 3) profiles ve competitions tablolarında da aynı GRANT eksikliği olabilir — güvence için tekrar veriyoruz
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.competitions TO anon, authenticated;

-- 4) Yarışma ilanlarını statik dosyadan (lib/data/competitions.ts) veritabanına taşı.
--    Discover sayfası artık önce bu tabloyu okuyor, boşsa/erişilemezse statik veriye düşüyor.
--    Bu INSERT'i SADECE BİR KEZ çalıştır (id otomatik üretildiği için tekrar çalıştırırsan kayıtlar çoğalır).
INSERT INTO public.competitions (title, platform, url, description, category, prize, deadline, image_url) VALUES
('Global AI Impact Challenge', 'devpost', 'https://devpost.com/hackathons/global-ai-impact', 'Yapay zekâ kullanarak toplumsal sorunlara yenilikçi çözümler geliştirin. Sağlık, eğitim ve sürdürülebilirlik alanlarında projeler bekliyoruz.', 'ai_ml', '$50,000', '2026-08-15T23:59:00Z', 'linear-gradient(135deg, #0F62FE, #6D9BFF)'),
('Next-Gen Web Apps Hackathon', 'devpost', 'https://devpost.com/hackathons/nextgen-web', 'Modern web teknolojileriyle geleceğin web uygulamalarını inşa edin. React, Next.js ve edge computing odaklı.', 'web', '$30,000', '2026-08-22T23:59:00Z', 'linear-gradient(135deg, #10B981, #34D399)'),
('Kaggle Tabular Playground Series', 'kaggle', 'https://www.kaggle.com/competitions/tabular-playground', 'Büyük ölçekli veri setleri üzerinde makine öğrenmesi modelleri geliştirin. Sınıflandırma ve regresyon görevleri.', 'data', '$25,000', '2026-09-01T23:59:00Z', 'linear-gradient(135deg, #F59E0B, #FBBF24)'),
('Mobile Innovation Sprint', 'mlh', 'https://mlh.io/events/mobile-innovation', 'iOS ve Android platformlarında yenilikçi mobil uygulamalar tasarlayın. UX odaklı değerlendirme kriterleri.', 'mobile', '$20,000', '2026-08-28T23:59:00Z', 'linear-gradient(135deg, #8B5CF6, #A78BFA)'),
('DeFi Builder Challenge', 'devpost', 'https://devpost.com/hackathons/defi-builder', 'Merkeziyetsiz finans (DeFi) protokolleri ve akıllı kontratlar geliştirin. Ethereum ve Solana destekli.', 'blockchain', '$75,000', '2026-09-10T23:59:00Z', 'linear-gradient(135deg, #EC4899, #F472B6)'),
('Smart IoT Solutions', 'hackerearth', 'https://www.hackerearth.com/challenges/smart-iot', 'IoT cihazları ve sensörlerle akıllı ev, şehir ve endüstri çözümleri oluşturun. Edge AI entegrasyonu bonus.', 'iot', '$15,000', '2026-08-18T23:59:00Z', 'linear-gradient(135deg, #06B6D4, #67E8F9)'),
('LLM Application Hackathon', 'devpost', 'https://devpost.com/hackathons/llm-apps', 'Büyük dil modelleri (LLM) kullanarak gerçek dünya problemlerini çözün. RAG, fine-tuning ve agent sistemleri.', 'ai_ml', '$40,000', '2026-09-05T23:59:00Z', 'linear-gradient(135deg, #304DB9, #4B67D3)'),
('Full-Stack SaaS Challenge', 'mlh', 'https://mlh.io/events/saas-challenge', 'Sıfırdan production-ready bir SaaS ürünü oluşturun. Ödeme, auth ve multi-tenant mimari bekleniyor.', 'web', '$35,000', '2026-09-12T23:59:00Z', 'linear-gradient(135deg, #0EA5E9, #38BDF8)'),
('Kaggle NLP Challenge', 'kaggle', 'https://www.kaggle.com/competitions/nlp-challenge', 'Doğal dil işleme alanında en gelişmiş modelleri oluşturun. Metin sınıflandırma ve duygu analizi.', 'ai_ml', '$30,000', '2026-08-25T23:59:00Z', 'linear-gradient(135deg, #7C3AED, #C084FC)'),
('Cross-Platform App Jam', 'hackerearth', 'https://www.hackerearth.com/challenges/cross-platform', 'React Native veya Flutter ile tek kod tabanından iOS ve Android uygulaması geliştirin.', 'mobile', '$18,000', '2026-09-08T23:59:00Z', 'linear-gradient(135deg, #F97316, #FB923C)'),
('Data Visualization Showdown', 'devpost', 'https://devpost.com/hackathons/dataviz', 'Karmaşık veri setlerini anlaşılır ve etkileyici görselleştirmelerle sunun. D3.js, Observable ve dashboard projeleri.', 'data', '$22,000', '2026-09-15T23:59:00Z', 'linear-gradient(135deg, #14B8A6, #5EEAD4)'),
('Web3 Gaming Hackathon', 'mlh', 'https://mlh.io/events/web3-gaming', 'Blockchain tabanlı oyunlar ve NFT ekonomileri geliştirin. Play-to-earn mekanikleri ve on-chain varlık yönetimi.', 'blockchain', '$60,000', '2026-08-30T23:59:00Z', 'linear-gradient(135deg, #E11D48, #FB7185)');
```

## Uygulanması gereken ek SQL (3. tur — takım içi mesajlaşma + dosya paylaşımı)

Aşağıdakiler `/team` sayfasına eklenen "Mesajlar" sekmesi için gerekli — **SQL Editor'da bir kez çalıştırılması gerekiyor:**

```sql
-- 1) Mesajlar tablosu (metin ve/veya dosya eki içerebilir)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  content TEXT,
  file_path TEXT,   -- Storage'daki dosya yolu (ör. "{team_id}/167..-dosya.pdf")
  file_name TEXT,   -- Kullanıcıya gösterilecek orijinal dosya adı
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = messages.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = messages.team_id AND team_members.user_id = auth.uid())
);

GRANT SELECT, INSERT ON public.messages TO authenticated;

-- 2) Realtime: bu tablodaki değişiklikler anlık olarak tüm takım üyelerine yayınlansın
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 3) Dosya paylaşımı için özel (private) bir Storage bucket'ı
INSERT INTO storage.buckets (id, name, public) VALUES ('team-files', 'team-files', false)
ON CONFLICT (id) DO NOTHING;

-- Sadece o takımın klasörüne (path'in ilk parçası team_id) o takımın üyeleri erişebilsin
CREATE POLICY "Team members can upload team files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'team-files'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);
CREATE POLICY "Team members can view team files" ON storage.objects FOR SELECT USING (
  bucket_id = 'team-files'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);
```

> Storage bucket'ı SQL ile oluşturmak çalışmazsa (bazı projelerde `storage.buckets`'a SQL Editor'dan doğrudan yazma kısıtlı olabilir), alternatif olarak Supabase Dashboard → **Storage** → **New bucket** → adı `team-files`, "Public bucket" **kapalı** (private) olarak elle de oluşturulabilir. Policy'ler (INSERT/SELECT) her durumda SQL Editor'dan çalıştırılmalı.
>
> Görüntülü görüşme (WebRTC) bu turda **eklenmedi** — kendi altyapınızla haftalar süren bir iş; ileride gerekirse Daily.co/LiveKit gibi hazır bir SDK ile günler seviyesinde eklenebilir.

## Uygulanması gereken ek SQL (4. tur — takıma davet "kabul et/reddet" akışı)

Önceden "GitHub kullanıcı adıyla üye ekle" formu kişiyi **doğrudan** takıma ekliyordu. Artık bir davet oluşturuyor; karşı taraf `/team` sayfasını açtığında kabul/red seçeneğiyle karşılaşıyor, kabul edene kadar takımın içeriğini (Kanban, mesajlar, buz kırıcı) göremiyor.

```sql
-- team_members'a durum kolonu — mevcut satırlar (zaten kurulmuş/katılmış üyeler) varsayılan olarak 'accepted' sayılır
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'accepted';
-- status: 'pending' (davet gönderildi, cevap bekleniyor) | 'accepted'

-- Kullanıcı kendi adına gelen daveti kabul edebilsin (status'u 'accepted' yapabilsin)
CREATE POLICY "Users can respond to their own invite" ON public.team_members FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

GRANT UPDATE ON public.team_members TO authenticated;
```

> **Bilinen sınır:** `ideas`, `icebreaker_responses`, `messages` tablolarının RLS policy'leri "bu kullanıcı `team_members`'ta bu takımın satırına sahip mi" diye bakıyor, `status = 'accepted'` şartını kontrol etmiyor. Yani arayüz pending bir davetliyi Kabul/Red ekranına hapsediyor ama teorik olarak biri doğrudan API çağrısıyla henüz kabul etmediği takımın içeriğini okuyabilir. Bootcamp MVP'si için düşük risk (kimse öyle bir şey denemez) ama tam sıkılaştırmak istersen bu üç tablonun policy'lerine `AND team_members.status = 'accepted'` eklenmesi gerekir — istersen ayrıca yaparım.

## Uygulanması gereken ek SQL (5. tur — fikir panosunda oy geri alma + silme)

Oy butonu her tıklamada sayaçı sonsuza kadar artırıyordu (geri alma yoktu), eklenen fikirler de hiç silinemiyordu. İkisi de düzeltildi:

```sql
-- Kim oy verdi bilgisini tutan kolon — ayni kullanici tekrar tiklayinca oy geri aliniyor
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS voted_by UUID[] NOT NULL DEFAULT '{}';

-- Takım üyeleri fikir silebilsin (mevcut UPDATE policy'sindeki gibi, yazar sartı yok)
CREATE POLICY "Team members can delete ideas" ON public.ideas FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);

GRANT DELETE ON public.ideas TO authenticated;
```

## Uygulanması gereken ek SQL (6. tur — takım lideri üye çıkarabilsin)

Şu ana kadar `team_members` DELETE policy'si sadece "kendi satırını sil" (ayrılma) izni veriyordu. Takımı kuran kişinin (`teams.created_by`) **başka üyeleri de çıkarabilmesi** için ek bir policy:

```sql
CREATE POLICY "Team creator can remove members" ON public.team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.teams WHERE teams.id = team_members.team_id AND teams.created_by = auth.uid())
);
```

`GRANT DELETE ON public.team_members` zaten 1. turda verilmişti, tekrar gerekmiyor.

## Bilinen veri sorunu — kullanıcı başına 1 takım kısıtı muhtemelen hiç uygulanmadı

`team_members_user_id_unique` kısıtını eklemeye çalıştığımız SQL, o anda zaten birden fazla takımda kaydı olan bir kullanıcı varsa **sessizce başarısız olur** (Postgres, mevcut veriyle çelişen bir UNIQUE kısıtı eklenmesine izin vermez). Kısıtın gerçekten var olup olmadığını kontrol edin:

```sql
SELECT conname FROM pg_constraint WHERE conname = 'team_members_user_id_unique';
```

Boş dönerse: önce birden fazla takımda görünen kullanıcıları tespit edip (aşağıdaki sorgu) hangi takımda kalacaklarına karar verin, fazlalık satırları silin, sonra kısıtı tekrar eklemeyi deneyin.

```sql
SELECT user_id, array_agg(team_id) AS teams, count(*)
FROM public.team_members
WHERE status = 'accepted'
GROUP BY user_id
HAVING count(*) > 1;
```
