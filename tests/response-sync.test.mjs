import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchAllResponsePages, orderResponsePage, responseSyncStart, mergeResponseUpdates } from '../src/lib/responseSync.js'

test('equal timestamps across a page boundary do not drop responses', async () => {
  const rows = Array.from({ length: 2501 }, (_, index) => ({
    id: String(2501 - index).padStart(8, '0'), submitted_at: '2026-09-07T00:00:00+00:00',
  }))
  const cursors = []
  const result = await fetchAllResponsePages(before => ({ async limit(size) {
    cursors.push(before)
    return { data: rows.filter(row => !before || row.id < before.id).slice(0, size) }
  } }))
  assert.deepEqual(result, rows)
  assert.equal(cursors.length, 3)
  assert.equal(cursors[1].id, rows[999].id)
  assert.equal(cursors[2].id, rows[1999].id)
})

test('page order and boundary use timestamp and id together', () => {
  const calls = []
  const query = {
    or(value) { calls.push(['or', value]); return this },
    order(field, options) { calls.push(['order', field, options]); return this },
  }
  orderResponsePage(query, { id: 'abc', submitted_at: '2026-09-07T00:00:00+00:00' })
  assert.deepEqual(calls, [
    ['or', 'submitted_at.lt.2026-09-07T00:00:00+00:00,and(submitted_at.eq.2026-09-07T00:00:00+00:00,id.lt.abc)'],
    ['order', 'submitted_at', { ascending: false }],
    ['order', 'id', { ascending: false }],
  ])
})

test('pagination errors and non-advancing cursors fail instead of returning incomplete data', async () => {
  await assert.rejects(fetchAllResponsePages(() => ({ async limit() { return { error: new Error('offline') } } })), /offline/)
  await assert.rejects(fetchAllResponsePages(() => ({ async limit() { return { data: [{ id: '1', submitted_at: '2026-09-07' }] } } }), 1), /did not advance/)
})

test('sync requests only the recent overlap and catches the first response on an empty form', () => {
  assert.equal(responseSyncStart([]), null)
  assert.equal(responseSyncStart([
    { submitted_at: '2026-08-01T00:00:00Z' },
    { submitted_at: '2026-09-07T10:00:30.123Z' },
  ]), '2026-09-07T09:59:30.123Z')
})

test('overlapping batches do not duplicate responses or notifications', () => {
  const first = { id: '1', submitted_at: '2026-09-07T10:00:00+00:00', answers: { name: 'first' } }
  const second = { id: '2', submitted_at: '2026-09-07T10:00:00+00:00', answers: { name: 'second' } }
  const changed = { ...first, answers: { name: 'updated' } }
  const merged = mergeResponseUpdates([first], [changed, second, second])
  assert.equal(merged.added, 1)
  assert.deepEqual(merged.responses, [second, changed])
  const repeated = mergeResponseUpdates(merged.responses, [changed, second])
  assert.equal(repeated.added, 0)
  assert.deepEqual(repeated.responses, merged.responses)
})
