const DEFAULT_MODEL = 'gemini-2.5-flash'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'POST만 지원합니다.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return json(400, { error: 'Netlify 환경변수 GEMINI_API_KEY가 설정되지 않았습니다.' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: '요청 본문이 올바른 JSON이 아닙니다.' })
  }

  const rows = Array.isArray(payload.rows) ? payload.rows : []
  const periodLabel = payload.periodLabel || '전체 기간'
  const totalResponses = Number(payload.totalResponses || 0)
  const totalForms = Number(payload.totalForms || rows.length || 0)

  const safeRows = rows.slice(0, 300).map((row, index) => ({
    rank: index + 1,
    title: String(row.title || '제목 없음').slice(0, 80),
    group: String(row.group || '').slice(0, 50),
    count: Number(row.count || 0),
    firstSubmittedAt: row.firstSubmittedAt || null,
    lastSubmittedAt: row.lastSubmittedAt || null,
  }))

  const prompt = `
너는 폼 신청 데이터를 빠르게 요약하는 한국어 운영 관리자야.
개인정보, 전화번호, 이름은 절대 추측하거나 요구하지 마.
아래는 폼별 응답 개수 집계야.

기간: ${periodLabel}
전체 폼 수: ${totalForms}
전체 응답 수: ${totalResponses}
폼별 집계 JSON:
${JSON.stringify(safeRows, null, 2)}

출력 형식:
1) 한 줄 결론
2) 응답 많은 폼 TOP 5
3) 신청이 약한 폼 / 확인할 폼
4) 운영자가 바로 볼 체크포인트

짧고 실무적으로 말해.
`;

  const model = normalizeModelName(process.env.GEMINI_MODEL || DEFAULT_MODEL)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 900,
        },
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return json(res.status, { error: data?.error?.message || 'Gemini API 요청에 실패했습니다.' })
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
    return json(200, { text: text || 'Gemini 요약 결과가 비어 있습니다.' })
  } catch (error) {
    return json(500, { error: error?.message || 'Gemini 호출 중 오류가 발생했습니다.' })
  }
}

function normalizeModelName(value) {
  const model = String(value || '').trim()
  if (!model) return DEFAULT_MODEL
  if (model === 'gemini-1.5-flash') return DEFAULT_MODEL
  if (model.startsWith('models/')) return model.replace(/^models\//, '')
  return model
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
