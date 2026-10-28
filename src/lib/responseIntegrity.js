// Read-only normalization: preserve database records while preventing character rows.
export function isAnswerObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const TEST_MARKER = /(?:\b(?:ALPHA|BRAVO)_[0-9a-f]{6}\b|UNIQUE_MARKER|\bpentest\b|\bstring_not_object\b|\bTEST_USER\b)/i

export function responseIssue(value) {
  if (!isAnswerObject(value)) return '응답 형식 오류 · 원본 확인 필요'
  if (TEST_MARKER.test(JSON.stringify(value))) return '테스트 의심 응답 · 확인 필요'
  return ''
}

export function normalizeResponse(row) {
  if (!Object.hasOwn(row, 'answers')) return row
  const issue = responseIssue(row.answers)
  if (!issue) return row
  let parsed = row.answers
  for (let i = 0; i < 2 && typeof parsed === 'string'; i++) {
    try { parsed = JSON.parse(parsed) } catch { break }
  }
  const answers = isAnswerObject(parsed)
    ? Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k,
      v !== null && typeof v === 'object' ? JSON.stringify(v) : v]))
    : { '원본 응답': typeof row.answers === 'string' ? row.answers : JSON.stringify(row.answers) }
  return { ...row, answers: { ...answers, _response_issue: issue } }
}
