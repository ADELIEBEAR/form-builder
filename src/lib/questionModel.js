const usableId = id => (typeof id === 'string' || Number.isSafeInteger(id)) && /^[a-zA-Z0-9_-]+$/.test(String(id))

export function newQuestionId(questions) {
  const used = new Set(questions.map(q => String(q.id)))
  let index = 1
  while (used.has(`q_${index}`)) index++
  return `q_${index}`
}

// Repair legacy identity collisions in memory, preserving content and image references.
export function normalizeQuestions(questions = [], images = {}) {
  const reserved = new Set(questions.filter(q => usableId(q.id)).map(q => String(q.id)))
  const seen = new Set()
  const qImgData = { ...images }
  const normalized = questions.map((q, index) => {
    const key = String(q.id)
    if (usableId(q.id) && !seen.has(key)) { seen.add(key); return q }
    let suffix = index + 1
    while (reserved.has(`q_${suffix}`) || seen.has(`q_${suffix}`)) suffix++
    const id = `q_${suffix}`
    seen.add(id)
    if (Object.hasOwn(images, key)) qImgData[id] = images[key]
    return { ...q, id }
  })
  return { questions: normalized, qImgData }
}

export function remapQuestionBranches(previous, next) {
  const indices = new Map(next.map((q, i) => [String(q.id), i]))
  return next.map(q => !q.branches ? q : {
    ...q,
    branches: q.branches.flatMap(branch => {
      if (branch.targetIdx === 'done') return [{ ...branch }]
      const target = previous[branch.targetIdx]
      const targetIdx = target && indices.get(String(target.id))
      return targetIdx == null ? [] : [{ ...branch, targetIdx }]
    }),
  })
}

export function removeQuestionOption(question, index) {
  if (!question.options || question.options.length <= 1 || index < 0 || index >= question.options.length) return question
  const next = { ...question, options: question.options.filter((_, i) => i !== index) }
  if (question.optionMeta) next.optionMeta = question.optionMeta.filter((_, i) => i !== index)
  if (question.correctAnswer != null) next.correctAnswer = question.correctAnswer === index ? 0 : question.correctAnswer - (question.correctAnswer > index ? 1 : 0)
  if (question.branches) next.branches = question.branches.filter(b => b.optionIdx !== index).map(b => ({ ...b, optionIdx: b.optionIdx - (b.optionIdx > index ? 1 : 0) }))
  return next
}
