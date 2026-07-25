# Kivona Veritabanı Şeması

Bu dosya Supabase SQL Editor'da çalıştırılacak şemaları içerir. Ana şema `db-schema.sql` dosyasındadır — o dosya Supabase SQL Editor'a doğrudan yapıştırılabilir.

## Uygulanması gereken ek SQL

`db-schema.sql`'deki mevcut şemada `teams`, `team_members`, `ideas`, `icebreaker_responses` tabolarında RLS (Row Level Security) **etkinleştirilmiş ama hiç policy tanımlanmamış**. Postgres'te RLS açıkken policy yoksa varsayılan davranış **her şeyi reddetmektir** — yani şu an bu tablolara hiçbir kullanıcı (anon key üzerinden) okuma/yazma yapamıyor (`permission denied for table teams` hatası buradan geliyor).

`/team` sayfasının (takım oluşturma, katılma, fikir panosu/Kanban, buz kırıcı) çalışabilmesi için aşağıdaki SQL'in Supabase SQL Editor'da **ek olarak** çalıştırılması gerekiyor:

```sql
-- ideas tablosuna Kanban durumu için kolon
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo';
-- status: 'todo' | 'doing' | 'done'

-- Takımlar herkes görebilir, sadece kurucu günceller
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creator can update team" ON public.teams FOR UPDATE USING (auth.uid() = created_by);

-- Takım üyelikleri: herkes görebilir, kullanıcı kendi üyeliğini ekleyip/çıkarabilir
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users can join a team" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave a team" ON public.team_members FOR DELETE USING (auth.uid() = user_id);

-- Fikir havuzu / Kanban: sadece takım üyeleri okuyup yazabilir
CREATE POLICY "Team members can view ideas" ON public.ideas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can create ideas" ON public.ideas FOR INSERT WITH CHECK (
  auth.uid() = author_id AND EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can update ideas" ON public.ideas FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = ideas.team_id AND team_members.user_id = auth.uid())
);

-- Buz kırıcı cevapları: sadece takım üyeleri okuyup yazabilir
CREATE POLICY "Team members can view icebreaker responses" ON public.icebreaker_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = icebreaker_responses.team_id AND team_members.user_id = auth.uid())
);
CREATE POLICY "Team members can answer icebreakers" ON public.icebreaker_responses FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.team_members WHERE team_members.team_id = icebreaker_responses.team_id AND team_members.user_id = auth.uid())
);
```

> Bu SQL, Supabase projesine **manuel olarak** SQL Editor'dan uygulanmalıdır — repo içinde otomatik migration çalıştıran bir araç (örn. Supabase CLI migrations) henüz kurulu değil.
