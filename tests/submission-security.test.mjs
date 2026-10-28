import test from 'node:test'
import assert from 'node:assert/strict'
import { validateFormAnswers } from '../netlify/lib/submission-validation.mjs'
import { handler, getClientIp, config } from '../netlify/functions/submit-response.mjs'

const form = { questions: [{ id: 1, type: 'short', label: '성함', required: true }, { id: 2, type: 'phone', label: '연락처', required: true }] }
test('valid form fields work; empty, foreign fields, test payloads and invalid phones fail', () => {
  assert.equal(validateFormAnswers({ 성함: '별칭', 연락처: '010-5551-2345' }, form), '')
  for (const answers of [{}, { t: 'f' }, { bulk: '1' }, { 성함: '별칭' }, { 성함: '별칭', 연락처: '01000000000' }, { 성함: {}, 연락처: '01055512345' }, { 성함: '별칭', 연락처: '01055512345', id: 'forged' }]) {
    assert.ok(validateFormAnswers(answers, form))
  }
})
test('required legal agreement and choice membership are enforced', () => {
  const f = { questions: [{ type: 'single', label: '선택', required: true, options: ['A', 'B'] }, { type: 'legal', required: true }] }
  assert.equal(validateFormAnswers({ 선택: 'A', 동의: '동의' }, f), '')
  assert.ok(validateFormAnswers({ 선택: 'C', 동의: '동의' }, f))
  assert.ok(validateFormAnswers({ 선택: 'A', 동의: '미동의' }, f))
})
test('renderer metadata is accepted but arbitrary fields remain rejected', () => {
  const answers = { 성함: '별칭', 연락처: '01055512345', _ts: '2026. 10. 28.', _formTitle: '검증 폼' }
  assert.equal(validateFormAnswers(answers, form), '')
  assert.ok(validateFormAnswers({ ...answers, _ts: {} }, form))
  assert.ok(validateFormAnswers({ ...answers, unexpected: 'x' }, form))
})
test('conditional branches do not require skipped fields', () => {
  const f = { questions: [{ type: 'single', label: '선택', options: ['끝', '계속'], required: true, branches: [{ optionIdx: 0, targetIdx: 'done' }] }, { type: 'short', label: '뒤', required: true }] }
  assert.equal(validateFormAnswers({ 선택: '끝' }, f), '')
  assert.ok(validateFormAnswers({ 선택: '계속' }, f))
})
test('client IP headers cannot spoof the observed connection', () => {
  assert.equal(getClientIp({ 'x-forwarded-for': '127.0.0.1', 'x-real-ip': '127.0.0.1', 'client-ip': '127.0.0.1' }), null)
  assert.equal(config.rateLimit.windowLimit, 10)
  assert.ok(config.rateLimit.aggregateBy.includes('ip'))
})
test('invalid HTTP envelopes are rejected without writes', async () => {
  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 405)
  assert.equal((await handler({ httpMethod: 'POST', headers: {}, body: '{}' })).statusCode, 415)
  assert.equal((await handler({ httpMethod: 'POST', headers: { 'content-type': 'application/json' }, body: 'null' })).statusCode, 400)
  assert.equal((await handler({ httpMethod: 'POST', headers: { 'content-type': 'application/json' }, body: 'a'.repeat(65537) })).statusCode, 413)
})
