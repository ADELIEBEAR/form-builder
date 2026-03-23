-- 응답 저장 테이블
create table public.responses (
  id uuid default gen_random_uuid() primary key,
  form_id uuid references public.forms(id) on delete cascade not null,
  answers jsonb not null default '{}',
  submitted_at timestamptz not null default now()
);

-- RLS: 폼 주인만 응답 조회 가능, 누구나 제출 가능
alter table public.responses enable row level security;

create policy "누구나 응답 제출 가능" on public.responses
  for insert with check (true);

create policy "폼 주인만 응답 조회" on public.responses
  for select using (
    exists (
      select 1 from public.forms
      where forms.id = responses.form_id
      and forms.user_id = auth.uid()
    )
  );

-- 폼을 공개 URL로 접근할 수 있도록 forms 테이블에 slug 추가
alter table public.forms add column if not exists slug text unique;
alter table public.forms add column if not exists is_published boolean not null default false;

-- 폼 slug는 누구나 조회 가능 (공개 폼)
create policy "공개된 폼은 누구나 조회" on public.forms
  for select using (is_published = true);

-- 조회수 컬럼 추가
alter table public.forms add column if not exists view_count integer not null default 0;

-- 조회수 증가 함수 (RLS 우회용)
create or replace function public.increment_view_count(form_id uuid)
returns void language sql security definer as $$
  update public.forms set view_count = view_count + 1 where id = form_id and is_published = true;
$$;
