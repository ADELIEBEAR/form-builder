const fallback = { phone: '전화번호', email: '이메일', legal: '동의' }
const reserved = ['_ts', '_formTitle', '__proto__', 'constructor', 'prototype']

export function getAnswerKeys(questions) {
  const base = questions.map((q, i) => q.type === 'quiz' ? `Q${i + 1}_답` : q.label || fallback[q.type] || `q${i}`)
  const used = new Set(reserved)
  const existing = new Set([...base, ...reserved])
  return base.map((label, i) => {
    let key = label
    let suffix = i + 1
    if (used.has(key)) do { key = `${label} (Q${suffix++})` } while (used.has(key) || existing.has(key))
    used.add(key)
    return key
  })
}
