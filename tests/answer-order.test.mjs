import test from 'node:test'
import assert from 'node:assert/strict'
import { orderAnswerKeys } from '../src/lib/answerOrder.js'

test('site response order survives JSONB key reordering', () => {
  const row = { answers: { 'IP 주소': '203.0.113.1', '번호': '01000000000', '동의 문구': '동의', '닉네임': '검증', '테스트 결과': '추격매수형', _field_order: ['닉네임', '번호', '테스트 결과', '동의 문구', 'IP 주소'] } }
  assert.deepEqual(orderAnswerKeys(Object.keys(row.answers), [row]), ['닉네임', '번호', '테스트 결과', '동의 문구', 'IP 주소'])
})

test('legacy records preserve their existing order without relying on form questions', () => {
  const keys = ['성명', '번호', '예전 답변']
  assert.deepEqual(orderAnswerKeys(keys, [{ answers: {} }]), keys)
  assert.deepEqual(orderAnswerKeys(keys, [{ answers: { _field_order: 'bad' } }]), keys)
})

test('mixed records put site contact fields first and retain old fields', () => {
  const keys = ['성명', '번호', 'IP 주소', '닉네임', '테스트 결과', '_field_order']
  const rows = [{ answers: {} }, { answers: { _field_order: ['닉네임', '번호', '테스트 결과', 'missing', null, '닉네임', '_field_order'] } }]
  assert.deepEqual(orderAnswerKeys(keys, rows), ['닉네임', '번호', '테스트 결과', '성명', 'IP 주소'])
})

