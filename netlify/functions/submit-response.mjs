import { isIP } from 'node:net'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function getClientIp(headers = {}) {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [String(key).toLowerCase(), value])
  )

  const candidates = [
    normalized['x-nf-client-connection-ip'],
    String(normalized['x-forwarded-for'] || '').split(',')[0],
    normalized['x-real-ip'],
    normalized['client-ip'],
  ]

  for (const candidate of candidates) {
    const value = String(candidate || '').trim().replace(/^::ffff:/, '')
    if (isIP(value)) return value
  }
  return null
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST만 지원합니다.' })

  let payload
  try { payload = JSON.parse(event.body || '{}') }
  catch { return json(400, { error: '요청 본문이 올바른 JSON이 아닙니다.' }) }

  const formId = String(payload.formId || '')
  const answers = payload.answers
  if (!UUID_PATTERN.test(formId) || !answers || Array.isArray(answers) || typeof answers !== 'object') {
    return json(400, { error: '폼 응답 형식이 올바르지 않습니다.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return json(500, { error: '응답 저장 환경이 설정되지 않았습니다.' })
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/responses`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      form_id: formId,
      answers,
      ip_address: getClientIp(event.headers),
    }),
  })

  if (!response.ok) {
    console.error('Supabase response insert failed:', response.status, await response.text())
    return json(502, { error: '응답을 저장하지 못했습니다.' })
  }

  return json(201, { ok: true })
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  }
}
