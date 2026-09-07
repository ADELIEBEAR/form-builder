// Integrations may supply an explicit order because JSONB reorders object keys.
// Legacy forms retain their existing order when no metadata is present.
export function orderAnswerKeys(keys, responses = []) {
  const visibleKeys = keys.filter(key => typeof key === 'string' && !key.startsWith('_'))
  const available = new Set(visibleKeys)
  const ranks = new Map()
  for (const response of responses) {
    const order = response?.answers?._field_order
    if (!Array.isArray(order)) continue
    for (const key of order.slice(0, 100)) {
      if (available.has(key) && !ranks.has(key)) ranks.set(key, ranks.size)
    }
  }
  return [...visibleKeys].sort((a, b) => (ranks.get(a) ?? Infinity) - (ranks.get(b) ?? Infinity))
}

