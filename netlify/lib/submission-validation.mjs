import { isAnswerObject, responseIssue } from '../../src/lib/responseIntegrity.js'
import { getSinglePagePath } from '../../src/lib/singlePage.js'

const FALLBACK = { phone: '전화번호', email: '이메일', legal: '동의' }
const BAD_PHONE = /^(?:010(?:0{8}|1{8}|2{8}|3{8}|4{8}|5{8}|6{8}|7{8}|8{8}|9{8})|01012345678|01012341234|01012121212|01010101010|01098765432)$/
export function answerKey(q, index) { return q.type === 'quiz' ? `Q${index + 1}_답` : q.label || FALLBACK[q.type] || `q${index}` }

export function validateFormAnswers(answers, form) {
  if (!isAnswerObject(answers) || responseIssue(answers) || !Object.keys(answers).length) return '응답 형식이 올바르지 않습니다.'
  const questions = form.questions || []
  const known = new Set(questions.map(answerKey))
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
    const value = answers[answerKey(q, i)] || ''
    selected[i] = q.type === 'quiz'
      ? q.options?.findIndex(option => value.endsWith(`(선택:${option})`))
      : q.options?.indexOf(value)
  })
  for (const i of getSinglePagePath(questions.length, branches, selected)) {
    const q = questions[i], value = answers[answerKey(q, i)] || ''
    if (q.required && !value.trim()) return '필수 항목을 입력해주세요.'
    if (!value) continue
    if (q.type === 'phone' || /전화|연락처|휴대폰|핸드폰|phone|mobile/i.test(q.label || '')) {
      const phone = value.replace(/[-\s()]/g, '')
      if (!/^010\d{8}$/.test(phone) || BAD_PHONE.test(phone)) return '올바른 전화번호를 입력해주세요.'
    }
    if (q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일을 입력해주세요.'
    if (q.type === 'legal' && q.required && value !== '동의') return '필수 동의가 필요합니다.'
    if (q.type === 'single' && !q.other && !q.options?.includes(value)) return '올바른 보기를 선택해주세요.'
    if (q.type === 'quiz') {
      if (!q.options?.some(option => value.endsWith(`(선택:${option})`))) return '올바른 보기를 선택해주세요.'
      if (q.required && q.correctAnswer != null && selected[i] !== Number(q.correctAnswer)) return '정답을 선택해주세요.'
    }
  }
  return ''
}
