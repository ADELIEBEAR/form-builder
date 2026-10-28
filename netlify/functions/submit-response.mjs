import { isIP } from 'node:net'
import { responseIssue } from '../../src/lib/responseIntegrity.js'
import { validateFormAnswers } from '../lib/submission-validation.mjs'

function env(key) { return globalThis.Netlify?.env?.get(key) ?? process.env[key] }

export const config = {
  path: '/api/submit-response',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 10 },
}

export default async function submitResponse(request, context) {
  const headers = Object.fromEntries(request.headers)
  delete headers['x-forwarded-for']
  delete headers['x-real-ip']
  delete headers['client-ip']
  headers['x-nf-client-connection-ip'] = context.ip || ''
  const result = await handler({ httpMethod: request.method, headers, body: await request.text() })
  return new Response(result.body, { status: result.statusCode, headers: result.headers })
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function getClientIp(headers = {}) {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [String(key).toLowerCase(), value])
  )

  const candidates = [
    normalized['x-nf-client-connection-ip'],
  ]

  for (const candidate of candidates) {
    const value = String(candidate || '').trim().replace(/^::ffff:/, '')
    if (isIP(value)) return value
  }
  return null
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST만 지원합니다.' })
  if (Buffer.byteLength(event.body || '', 'utf8') > 65536) return json(413, { error: '응답이 너무 큽니다.' })
  if (!String(event.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) return json(415, { error: 'JSON만 지원합니다.' })

  let payload
  try { payload = JSON.parse(event.body || '{}') }
  catch { return json(400, { error: '요청 본문이 올바른 JSON이 아닙니다.' }) }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json(400, { error: '요청 형식이 올바르지 않습니다.' })
  const formId = String(payload.formId || '')
  const answers = payload.answers
  if (!UUID_PATTERN.test(formId) || !answers || Array.isArray(answers) || typeof answers !== 'object') {
    return json(400, { error: '폼 응답 형식이 올바르지 않습니다.' })
  }
  if (responseIssue(answers)) return json(400, { error: '정상 신청 내용만 제출할 수 있습니다.' })

  const supabaseUrl = env('SUPABASE_URL') || env('VITE_SUPABASE_URL')
  const supabaseAnonKey = env('SUPABASE_ANON_KEY') || env('VITE_SUPABASE_ANON_KEY')
  const submitToken = env('FORM_SUBMIT_TOKEN')
  if (!supabaseUrl || !supabaseAnonKey || !submitToken) {
    return json(500, { error: '응답 저장 환경이 설정되지 않았습니다.' })
  }

  const formResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/forms?id=eq.${formId}&is_published=eq.true&select=id,questions`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
  })
  if (!formResponse.ok) return json(503, { error: '폼을 확인하지 못했습니다.' })
  const forms = await formResponse.json()
  if (!forms[0]) return json(404, { error: '공개된 폼이 아닙니다.' })
  const invalid = validateFormAnswers(answers, forms[0])
  if (invalid) return json(400, { error: invalid })

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/responses`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-form-submit-token': submitToken,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      form_id: formId,
      answers,
      ip_address: getClientIp(event.headers),
    }),
  })

  if (!response.ok) {
    console.error('Supabase response insert failed:', response.status)
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
