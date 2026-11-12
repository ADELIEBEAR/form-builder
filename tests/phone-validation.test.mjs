import test from 'node:test'
import assert from 'node:assert/strict'
import { isPhoneQuestion, isValidPhone } from '../src/lib/phoneValidation.js'
import { validateFormAnswers } from '../netlify/lib/submission-validation.mjs'

test('domestic and international phone formats have the same server validation', () => {
  const form = { questions: [{ type: 'phone', label: 'Phone', required: true }] }
  for (const value of ['01048267395', '010-4826-7395', '(010) 4826 7395', '+82 10-4826-7395', '821048267395']) {
    assert.equal(isValidPhone(value), true, value)
    assert.equal(validateFormAnswers({ Phone: value }, form), '', value)
  }
  for (const value of ['', '01000000000', '+82 10-0000-0000', '01012345678', '01023456789', '010-4826', '010letters48267395', '+1 01048267395']) {
    assert.equal(isValidPhone(value), false, value)
    assert.ok(validateFormAnswers({ Phone: value }, form), value)
  }
})

test('a choice title mentioning phone does not turn choice values into phone fields', () => {
  const question = { type: 'single', label: '전화 안내를 원하시나요?', options: ['예', '아니요'], required: true }
  assert.equal(isPhoneQuestion(question), false)
  assert.equal(validateFormAnswers({ [question.label]: '예' }, { questions: [question] }), '')
})
