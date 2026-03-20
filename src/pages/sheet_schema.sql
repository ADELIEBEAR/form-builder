-- forms 테이블에 시트 관련 컬럼 추가
alter table public.forms add column if not exists sheet_id text;
alter table public.forms add column if not exists sheet_url text;

-- 구글 토큰 저장 테이블
create table if not exists public.google_tokens (
  user_id uuid references auth.users(id) on delete cascade primary key,
  access_token text not null,
  refresh_token text,
  updated_at timestamptz not null default now()
);

alter table public.google_tokens enable row level security;

create policy "본인 토큰만 접근" on public.google_tokens
  for all using (auth.uid() = user_id);
