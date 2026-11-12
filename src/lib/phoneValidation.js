export function normalizePhone(value) {
  return String(value || '').trim().replace(/[-\s()]/g, '').replace(/^\+?82(?=10\d{8}$)/, '0')
}

export function isPhoneQuestion(question) {
  return question.type === 'phone' || (['short', 'long'].includes(question.type) && /전화|연락처|휴대폰|핸드폰|번호|phone|mobile|tel/i.test(question.label || ''))
}

// Self-contained so the HTML export and server execute exactly the same validation.
export function isValidPhone(value) {
  const phone = String(value || '').trim().replace(/[-\s()]/g, '').replace(/^\+?82(?=10\d{8}$)/, '0')
  if (!/^010\d{8}$/.test(phone)) return false
  if (/^(\d)\1+$/.test(phone.slice(3))) return false
  if (['01012345678', '01012341234', '01012121212', '01010101010', '01098765432'].includes(phone)) return false
  return !['12345678', '23456789', '34567890', '87654321', '98765432'].some(sequence => phone.includes(sequence))
}
