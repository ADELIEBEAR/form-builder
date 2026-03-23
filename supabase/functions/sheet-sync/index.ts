import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 액세스 토큰 갱신
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
  if (!clientId || !clientSecret) return null

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token || null
}

// 시트에 쓰기 (토큰 자동 갱신 포함)
async function writeToSheet(
  sheetId: string,
  accessToken: string,
  refreshToken: string,
  rows: string[][],
  supabase: any,
  userId: string,
): Promise<{ ok: boolean; error?: string }> {

  // 1. 헤더 확인
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )

  // 401이면 토큰 만료 → 갱신
  if (checkRes.status === 401) {
    const newToken = await refreshAccessToken(refreshToken)
    if (!newToken) return { ok: false, error: 'token_refresh_failed' }

    // 갱신된 토큰 저장
    await supabase.from('google_tokens').update({
      access_token: newToken,
      updated_at: new Date().toISOString()
    }).eq('user_id', userId)

    accessToken = newToken
  }

  const checkData = await checkRes.json().catch(() => ({}))
  const hasHeader = checkData.values && checkData.values.length > 0
  const finalRows = hasHeader ? rows.slice(1) : rows // 헤더 이미 있으면 데이터만

  if (finalRows.length === 0) return { ok: true }

  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: finalRows }),
    }
  )

  if (!writeRes.ok) {
    // 다시 401이면 재시도
    if (writeRes.status === 401 && refreshToken) {
      const newToken = await refreshAccessToken(refreshToken)
      if (newToken) {
        await supabase.from('google_tokens').update({
          access_token: newToken,
          updated_at: new Date().toISOString()
        }).eq('user_id', userId)

        const retryRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${newToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: finalRows }),
          }
        )
        if (!retryRes.ok) return { ok: false, error: await retryRes.text() }
        return { ok: true }
      }
    }
    return { ok: false, error: await writeRes.text() }
  }

  return { ok: true }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { form_id, answers } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // 폼 정보
    const { data: form } = await supabase
      .from('forms')
      .select('user_id, sheet_id, questions')
      .eq('id', form_id)
      .single()

    if (!form?.sheet_id) {
      return new Response(JSON.stringify({ ok: true, msg: 'no sheet linked' }), { headers: cors })
    }

    // 구글 토큰
    const { data: tokenData } = await supabase
      .from('google_tokens')
      .select('access_token, refresh_token')
      .eq('user_id', form.user_id)
      .single()

    if (!tokenData?.access_token) {
      return new Response(JSON.stringify({ ok: false, msg: 'no google token - please reconnect sheet' }), { headers: cors })
    }

    // 행 구성
    const questions = form.questions || []
    const headers = ['제출 시간', ...questions.map((q: any) => q.label || '질문')]
    const values = [
      new Date().toLocaleString('ko-KR'),
      ...questions.map((q: any) => {
        const val = answers[q.label] || answers[q.id] || ''
        return String(val)
      })
    ]

    const result = await writeToSheet(
      form.sheet_id,
      tokenData.access_token,
      tokenData.refresh_token,
      [headers, values],
      supabase,
      form.user_id,
    )

    return new Response(JSON.stringify(result), { headers: cors })

  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: cors })
  }
})
