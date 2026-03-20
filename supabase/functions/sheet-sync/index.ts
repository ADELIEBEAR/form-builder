import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { form_id, answers } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // 폼 + sheet_id + 질문 가져오기
    const { data: form } = await supabase
      .from('forms')
      .select('user_id, sheet_id, questions')
      .eq('id', form_id)
      .single()

    if (!form?.sheet_id) {
      return new Response(JSON.stringify({ ok: true, msg: 'no sheet' }), { headers: cors })
    }

    // 구글 토큰 가져오기
    const { data: tokenData } = await supabase
      .from('google_tokens')
      .select('access_token')
      .eq('user_id', form.user_id)
      .single()

    if (!tokenData?.access_token) {
      return new Response(JSON.stringify({ ok: false, msg: 'no token' }), { headers: cors })
    }

    // 질문 순서대로 값 추출
    const questions = form.questions || []
    const headers = ['제출 시간', ...questions.map((q: any) => q.label || '')]
    const values = [
      new Date().toLocaleString('ko-KR'),
      ...questions.map((q: any) => answers[q.label] || '')
    ]

    // 시트에 헤더 있는지 확인
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${form.sheet_id}/values/A1`,
      { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } }
    )
    const checkData = await checkRes.json()
    const hasHeader = checkData.values && checkData.values.length > 0

    // 헤더 없으면 첫 행에 추가
    const rows = hasHeader ? [values] : [headers, values]

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${form.sheet_id}/values/A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: rows })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ ok: false, error: err }), { headers: cors })
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: cors })
  }
})
