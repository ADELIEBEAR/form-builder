-- Supabase SQL Editor에서 실행하세요

create table public.forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default '제목 없음',
  theme_c1 text not null default '#7c6cfc',
  theme_c2 text not null default '#c084fc',
  questions jsonb not null default '[]',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forms enable row level security;

create policy "본인 폼만 조회" on public.forms for select using (auth.uid() = user_id);
create policy "본인 폼만 생성" on public.forms for insert with check (auth.uid() = user_id);
create policy "본인 폼만 수정" on public.forms for update using (auth.uid() = user_id);
create policy "본인 폼만 삭제" on public.forms for delete using (auth.uid() = user_id);

-- group_tag 컬럼 추가 (없으면 추가)
ALTER TABLE forms ADD COLUMN IF NOT EXISTS group_tag TEXT DEFAULT NULL;
