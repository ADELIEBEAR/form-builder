-- IP 기록 기능 적용 전에 Supabase SQL Editor에서 한 번 실행합니다.
-- 기존 응답은 ip_address가 비어 있고, 적용 이후 새 응답부터 기록됩니다.
alter table public.responses
  add column if not exists ip_address inet;

comment on column public.responses.ip_address is
  'Netlify Function이 요청 헤더에서 확인한 신청자 IP 주소';
