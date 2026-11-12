import { isAnswerObject, responseIssue } from '../../src/lib/responseIntegrity.js'
import { getSinglePagePath } from '../../src/lib/singlePage.js'
import { getAnswerKeys } from '../../src/lib/answerKeys.js'
import { isPhoneQuestion, isValidPhone } from '../../src/lib/phoneValidation.js'

const FALLBACK = { phone: '전화번호', email: '이메일', legal: '동의' }
export function answerKey(q, index) { return q.type === 'quiz' ? `Q${index + 1}_답` : q.label || FALLBACK[q.type] || `q${index}` }

export function validateFormAnswers(answers, form) {
  if (!isAnswerObject(answers) || responseIssue(answers) || !Object.keys(answers).length) return '응답 형식이 올바르지 않습니다.'
  const questions = form.questions || []
  const keys = getAnswerKeys(questions)
  const known = new Set(keys)
  for (const [key, value] of Object.entries(answers)) {
    if (['_ts', '_formTitle'].includes(key)) {
      if (typeof value !== 'string' || value.length > 500) return '응답 메타정보가 올바르지 않습니다.'
      continue
    }
    if (!known.has(key) || ['__proto__', 'constructor', 'prototype'].includes(key)) return '알 수 없는 응답 항목입니다.'
    if (typeof value !== 'string' || value.length > 10000) return '응답 값이 올바르지 않습니다.'
  }
  const branches = {}, selected = {}
  questions.forEach((q, i) => {
    if (q.branches?.length) branches[i] = Object.fromEntries(q.branches.map(b => [b.optionIdx, b.targetIdx]))
    const value = answers[keys[i]] || ''
    selected[i] = q.type === 'quiz'
      ? q.options?.findIndex(option => value.endsWith(`(선택:${option})`))
      : q.options?.indexOf(value)
  })
  for (const i of getSinglePagePath(questions.length, branches, selected)) {
    const q = questions[i], value = answers[keys[i]] || ''
    if (q.required && !value.trim()) return '필수 항목을 입력해주세요.'
    if (!value) continue
    if (isPhoneQuestion(q) && !isValidPhone(value)) return '올바른 전화번호를 입력해주세요.'
    if (q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일을 입력해주세요.'
    if (q.type === 'legal' && q.required && value !== '동의') return '필수 동의가 필요합니다.'
    if (q.type === 'single' && !q.other && !q.options?.includes(value)) return '올바른 보기를 선택해주세요.'
    if (q.type === 'quiz') {
      if (!q.options?.some(option => value.endsWith(`(선택:${option})`))) return '올바른 보기를 선택해주세요.'
    }
  }
  return ''
}
