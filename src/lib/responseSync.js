export const RESPONSE_PAGE_SIZE = 1000
const SYNC_OVERLAP_MS = 60_000

export function orderResponsePage(query, before) {
  if (before) {
    query = query.or(`submitted_at.lt.${before.submitted_at},and(submitted_at.eq.${before.submitted_at},id.lt.${before.id})`)
  }
  return query.order('submitted_at', { ascending: false }).order('id', { ascending: false })
}

export async function fetchAllResponsePages(makeQuery, pageSize = RESPONSE_PAGE_SIZE) {
  const rows = []
  let before = null
  for (let page = 0; page <= 500; page++) {
    const { data, error } = await makeQuery(before).limit(pageSize)
    if (error) throw error
    const chunk = data || []
    rows.push(...chunk)
    if (chunk.length < pageSize) return rows
    const last = chunk[chunk.length - 1]
    if (!last?.id || !last.submitted_at || (last.id === before?.id && last.submitted_at === before?.submitted_at)) {
      throw new Error('Response pagination did not advance')
    }
    before = { id: last.id, submitted_at: last.submitted_at }
  }
  throw new Error('Too many response pages')
}

export function responseSyncStart(responses) {
  if (!responses.length) return null
  // Re-read a small window so a slightly delayed commit is not missed.
  const newest = responses.reduce((latest, row) => Math.max(latest, new Date(row.submitted_at).getTime()), 0)
  return new Date(newest - SYNC_OVERLAP_MS).toISOString()
}

export function mergeResponseUpdates(existing, incoming) {
  const byId = new Map(existing.map(row => [row.id, row]))
  let added = 0
  for (const row of incoming) {
    if (!byId.has(row.id)) added++
    byId.set(row.id, row)
  }
  const responses = [...byId.values()].sort((a, b) =>
    b.submitted_at.localeCompare(a.submitted_at) || b.id.localeCompare(a.id))
  return { responses, added }
}
