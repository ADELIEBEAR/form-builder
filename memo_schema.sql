-- 내부 메모 컬럼 추가 (나만 보는 제목)
alter table public.forms add column if not exists memo text;
