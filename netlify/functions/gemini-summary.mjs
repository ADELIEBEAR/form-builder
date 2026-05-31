const DEFAULT_MODEL = 'gemini-3.5-flash'
const FALLBACK_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash']

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST만 지원합니다.' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return json(400, { error: 'Netlify 환경변수 GEMINI_API_KEY가 설정되지 않았습니다.' })

  let payload
  try { payload = JSON.parse(event.body || '{}') }
  catch { return json(400, { error: '요청 본문이 올바른 JSON이 아닙니다.' }) }

  const periodLabel = payload.periodLabel || '전체 기간'
  const totalForms = Number(payload.totalForms || 0)
  const totalResponses = Number(payload.totalResponses || 0)
  const duplicateSummary = payload.duplicateSummary || null
  const duplicateGroups = Array.isArray(payload.duplicateGroups) ? payload.duplicateGroups : []

  if (!duplicateSummary) {
    return json(200, {
      text: [
        `기간: ${periodLabel}`,
        '',
        '현재 AI에는 폼별 응답 수만 전달되고 있어서, 중복 제외 DB 갯수는 계산할 수 없습니다.',
        '중복 제외 DB 계산에는 각 응답의 번호 기준 중복 집계값이 같이 전달돼야 합니다.',
        '',
        `- 전체 폼 수: ${totalForms}개`,
        `- 전체 응답 수: ${totalResponses}개`,
        '',
        '수정 필요: AI 버튼에서 폼별 응답 수가 아니라 중복 집계 데이터를 보내야 합니다.'
      ].join('\n')
    })
  }

  const safeGroups = duplicateGroups.slice(0, 50).map(group => ({
    key: group.formattedPhone || group.phone || group.key || '',
    kind: group.kind || '중복',
    count: Number(group.count || group.totalCount || 0),
    duplicateOnlyCount: Number(group.duplicateOnlyCount || 0),
    formCount: Number(group.formCount || 0),
    forms: Array.isArray(group.forms) ? group.forms.slice(0, 8).map(f => ({ title: String(f.title || '제목 없음').slice(0, 80), count: Number(f.count || 0) })) : []
  }))

  const prompt = `
너는 폼 신청 DB 중복을 계산하는 운영 관리자야.
폼 인기 순위, 마케팅 평가, 응답 많은 폼 요약은 하지 마.
목표는 중복 제외 DB 갯수와 중복으로 빠지는 건수를 확인하는 것이다.
같은 번호는 전체 DB에서 1개로 계산한다.
같은 폼 안에서는 첫 신청은 정상이고, 2번째 신청부터 중복 후보로 본다.

기간: ${periodLabel}
전체 폼 수: ${totalForms}
전체 응답 수: ${totalResponses}
중복 집계:
${JSON.stringify(duplicateSummary, null, 2)}

중복 그룹 TOP:
${JSON.stringify(safeGroups, null, 2)}

아래 형식으로만 답해.
1) 중복 제외 DB 갯수
- 전체 응답:
- 중복 제외 DB:
- 중복으로 빠지는 건수:
2) 같은 폼 같은 번호 중복
3) 다른 폼까지 걸친 중복
4) 먼저 확인할 중복 TOP 10
5) 처리 기준
`;

  const requestedModel = normalizeModelName(process.env.GEMINI_MODEL || DEFAULT_MODEL)
  const modelCandidates = [...new Set([requestedModel, DEFAULT_MODEL, ...FALLBACK_MODELS].filter(Boolean))]
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.05, topP: 0.75, maxOutputTokens: 1200 },
  }

  let lastError = ''
  for (const model of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        lastError = data?.error?.message || `${model} 요청 실패`
        continue
      }
      const text = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
      return json(200, { model, text: text || 'AI 중복 분석 결과가 비어 있습니다.' })
    } catch (error) {
      lastError = error?.message || String(error)
    }
  }

  return json(500, { error: lastError || 'AI 호출 중 오류가 발생했습니다.' })
}

function normalizeModelName(value) {
  const model = String(value || '').trim()
  if (!model) return DEFAULT_MODEL
  if (['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(model)) return DEFAULT_MODEL
  if (model.startsWith('models/')) return model.replace(/^models\//, '')
  return model
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) }
}
