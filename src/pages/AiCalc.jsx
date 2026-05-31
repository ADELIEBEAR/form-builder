import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForms, getResponsesForForms } from '../lib/supabase'
import s from './AiCalc.module.css'

function normalizePhone(v) { return String(v||'').replace(/[-\s()]/g,'').trim() }
function looksLikePhone(v) { return /^01[0-9]\d{7,8}$/.test(normalizePhone(v)) }
function formatPhone(v) {
  const n = normalizePhone(v)
  if (n.length === 10) return n.slice(0,3)+'-'+n.slice(3,6)+'-'+n.slice(6)
  if (n.length === 11) return n.slice(0,3)+'-'+n.slice(3,7)+'-'+n.slice(7)
  return v
}
function extractPhonesFromAnswers(answers) {
  const phones = new Set()
  Object.values(answers || {}).forEach(v => {
    if (looksLikePhone(v)) phones.add(normalizePhone(v))
  })
  return [...phones]
}
function dateStartIso(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString()
}
function dateEndIso(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d + 1, 0, 0, 0, 0).toISOString()
}
function csvCell(value) {
  const s = value == null ? '' : String(value)
  return `"${s.replace(/"/g, '""')}"`
}
function downloadCsv(filename, rows) {
  const csv = '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function getNameGuess(answers) {
  const entries = Object.entries(answers || {})
  const nameLike = entries.find(([key]) => ['이름', '성함', '성명', '닉네임', 'name'].some(word => String(key).toLowerCase().includes(word.toLowerCase())))
  return nameLike?.[1] || ''
}

function getPrimaryPhone(answers) {
  const phones = extractPhonesFromAnswers(answers)
  return phones[0] || ''
}

function buildProcessedDbRows(responses, forms) {
  const formMap = new Map(forms.map(f => [f.id, f]))
  const phoneMap = new Map()
  const noPhoneRows = []

  ;(responses || []).forEach(response => {
    const phone = getPrimaryPhone(response.answers)
    const form = formMap.get(response.form_id) || {}
    const entry = {
      response,
      phone,
      formId: response.form_id,
      formTitle: form.title || '제목 없음',
      group: form.group_tag || '',
      submittedAt: response.submitted_at,
    }
    if (!phone) {
      noPhoneRows.push(entry)
      return
    }
    if (!phoneMap.has(phone)) phoneMap.set(phone, [])
    phoneMap.get(phone).push(entry)
  })

  phoneMap.forEach(entries => entries.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)))

  const processed = []
  phoneMap.forEach((entries, phone) => {
    const formIds = [...new Set(entries.map(e => e.formId))]
    const sameFormIndexById = new Map()
    const sameFormTotalById = new Map()

    formIds.forEach(formId => {
      const sameEntries = entries.filter(e => e.formId === formId)
      sameEntries.forEach((entry, index) => {
        sameFormIndexById.set(entry.response.id, index + 1)
        sameFormTotalById.set(entry.response.id, sameEntries.length)
      })
    })

    entries.forEach((entry, index) => {
      const order = index + 1
      const sameFormOrder = sameFormIndexById.get(entry.response.id) || 1
      const sameFormTotal = sameFormTotalById.get(entry.response.id) || 1
      const isRepresentative = order === 1
      const isSameFormDuplicate = sameFormOrder > 1
      const isCrossFormDuplicate = formIds.length > 1 && !isRepresentative
      let duplicateType = '정상'
      if (!isRepresentative) {
        if (isSameFormDuplicate && formIds.length > 1) duplicateType = '같은폼+다른폼 중복'
        else if (isSameFormDuplicate) duplicateType = '같은폼 중복'
        else duplicateType = '다른폼 중복'
      }

      processed.push({
        status: isRepresentative ? '대표DB' : '중복후보',
        representative: isRepresentative ? '대표' : '제외',
        orderLabel: `${order}번째 신청`,
        duplicateType,
        name: getNameGuess(entry.response.answers),
        phone,
        formattedPhone: formatPhone(phone),
        formTitle: entry.formTitle,
        group: entry.group,
        submittedAt: entry.submittedAt,
        totalForPhone: entries.length,
        formCount: formIds.length,
        sameFormOrder,
        sameFormTotal,
        answers: entry.response.answers || {},
      })
    })
  })

  noPhoneRows.forEach(entry => {
    processed.push({
      status: '번호없음',
      representative: '확인필요',
      orderLabel: '',
      duplicateType: '번호없음',
      name: getNameGuess(entry.response.answers),
      phone: '',
      formattedPhone: '',
      formTitle: entry.formTitle,
      group: entry.group,
      submittedAt: entry.submittedAt,
      totalForPhone: '',
      formCount: '',
      sameFormOrder: '',
      sameFormTotal: '',
      answers: entry.response.answers || {},
    })
  })

  return processed.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
}

function buildProcessedCsvRows(processedRows, allKeys) {
  const header = [
    '상태', '대표여부', '중복차수', '중복구분', '이름추정', '전화번호',
    '신청폼', '그룹', '신청일시', '동일번호 전체신청수', '동일번호 참여폼수',
    '같은폼 신청차수', '같은폼 총신청수', ...allKeys
  ]
  const rows = processedRows.map(row => [
    row.status,
    row.representative,
    row.orderLabel,
    row.duplicateType,
    row.name,
    row.formattedPhone,
    row.formTitle,
    row.group,
    row.submittedAt ? new Date(row.submittedAt).toLocaleString('ko-KR') : '',
    row.totalForPhone,
    row.formCount,
    row.sameFormOrder,
    row.sameFormTotal,
    ...allKeys.map(key => row.answers?.[key] ?? '')
  ])
  return [header, ...rows]
}

function buildDuplicateAnalysis(responses, forms) {
  const formMap = new Map(forms.map(f => [f.id, f]))
  const phoneMap = new Map()
  const phoneFormMap = new Map()
  const infoByResponse = new Map()
  let noPhoneCount = 0

  const perFormRaw = new Map(forms.map(f => [f.id, {
    phoneSet: new Set(), noPhoneCount: 0,
    totalResponses: 0,
    duplicateResponses: 0, duplicatePhones: new Set(),
    sameFormDuplicateResponses: 0, sameFormDuplicatePhones: new Set(),
    crossFormDuplicateResponses: 0, crossFormDuplicatePhones: new Set(),
  }]))

  ;(responses || []).forEach(r => {
    const phones = extractPhonesFromAnswers(r.answers)
    const form = formMap.get(r.form_id)
    const stats = perFormRaw.get(r.form_id)
    if (stats) stats.totalResponses += 1

    if (!phones.length) {
      noPhoneCount += 1
      if (stats) stats.noPhoneCount += 1
      return
    }

    phones.forEach(phone => {
      const entry = {
        id: r.id,
        formId: r.form_id,
        formTitle: form?.title || '제목 없음',
        group: form?.group_tag || '',
        submittedAt: r.submitted_at,
      }
      if (!phoneMap.has(phone)) phoneMap.set(phone, [])
      phoneMap.get(phone).push(entry)

      const key = `${phone}::${r.form_id}`
      if (!phoneFormMap.has(key)) phoneFormMap.set(key, [])
      phoneFormMap.get(key).push(entry)

      if (stats) stats.phoneSet.add(phone)
    })
  })

  phoneMap.forEach(entries => entries.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)))
  phoneFormMap.forEach(entries => entries.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)))

  const groups = []
  let sameFormDuplicateGroupCount = 0
  let sameFormDuplicateResponseCount = 0
  let sameFormDuplicateOnlyCount = 0
  let crossFormDuplicatePhoneCount = 0
  let crossFormDuplicateResponseCount = 0

  phoneMap.forEach((entries, phone) => {
    const formIds = [...new Set(entries.map(e => e.formId))]
    const sameFormGroups = formIds.map(formId => {
      const sameEntries = phoneFormMap.get(`${phone}::${formId}`) || []
      return {
        formId,
        formTitle: sameEntries[0]?.formTitle || formMap.get(formId)?.title || '제목 없음',
        count: sameEntries.length,
      }
    }).filter(group => group.count > 1)

    const isSameFormDuplicate = sameFormGroups.length > 0
    const isCrossFormDuplicate = formIds.length > 1
    if (!isSameFormDuplicate && !isCrossFormDuplicate) return

    if (isSameFormDuplicate) {
      sameFormDuplicateGroupCount += sameFormGroups.length
      sameFormDuplicateResponseCount += sameFormGroups.reduce((sum, group) => sum + group.count, 0)
      sameFormDuplicateOnlyCount += sameFormGroups.reduce((sum, group) => sum + group.count - 1, 0)
    }
    if (isCrossFormDuplicate) {
      crossFormDuplicatePhoneCount += 1
      crossFormDuplicateResponseCount += entries.length
    }

    let kind = '같은폼 중복'
    if (isSameFormDuplicate && isCrossFormDuplicate) kind = '같은폼+다른폼 중복'
    else if (isCrossFormDuplicate) kind = '다른폼 중복'

    const formRows = formIds.map(formId => ({
      formId,
      title: formMap.get(formId)?.title || '제목 없음',
      count: entries.filter(e => e.formId === formId).length,
    }))

    groups.push({
      phone,
      formattedPhone: formatPhone(phone),
      kind,
      count: entries.length,
      duplicateOnlyCount: Math.max(0, entries.length - 1),
      formCount: formIds.length,
      forms: formRows,
      sameFormGroups,
    })

    entries.forEach(entry => {
      const sameEntries = phoneFormMap.get(`${phone}::${entry.formId}`) || []
      const sameIndex = sameEntries.findIndex(e => e.id === entry.id)
      const sameFormDuplicate = sameIndex > 0
      const crossFormDuplicate = isCrossFormDuplicate
      if (!sameFormDuplicate && !crossFormDuplicate) return

      let rowKind = ''
      if (sameFormDuplicate) rowKind += `같은폼 ${sameIndex + 1}번째 신청!`
      if (crossFormDuplicate) rowKind += rowKind ? ' / 다른폼 중복' : '다른폼 중복'

      infoByResponse.set(entry.id, {
        phone,
        formattedPhone: formatPhone(phone),
        duplicate: true,
        kind: rowKind,
        totalForPhone: entries.length,
        formCount: formIds.length,
        sameFormCount: sameEntries.length,
      })

      const stats = perFormRaw.get(entry.formId)
      if (stats) {
        stats.duplicateResponses += 1
        stats.duplicatePhones.add(phone)
        if (sameFormDuplicate) {
          stats.sameFormDuplicateResponses += 1
          stats.sameFormDuplicatePhones.add(phone)
        }
        if (crossFormDuplicate) {
          stats.crossFormDuplicateResponses += 1
          stats.crossFormDuplicatePhones.add(phone)
        }
      }
    })
  })

  groups.sort((a, b) => b.duplicateOnlyCount - a.duplicateOnlyCount || b.count - a.count)

  const perFormStats = Array.from(perFormRaw.entries()).map(([formId, stats]) => ({
    formId,
    title: formMap.get(formId)?.title || '제목 없음',
    group: formMap.get(formId)?.group_tag || '',
    totalResponses: stats.totalResponses,
    uniqueApplicants: stats.phoneSet.size + stats.noPhoneCount,
    duplicateResponses: stats.duplicateResponses,
    duplicatePhoneCount: stats.duplicatePhones.size,
    sameFormDuplicateResponses: stats.sameFormDuplicateResponses,
    sameFormDuplicatePhoneCount: stats.sameFormDuplicatePhones.size,
    crossFormDuplicateResponses: stats.crossFormDuplicateResponses,
    crossFormDuplicatePhoneCount: stats.crossFormDuplicatePhones.size,
  })).sort((a, b) => b.duplicateResponses - a.duplicateResponses || b.totalResponses - a.totalResponses)

  const uniqueApplicants = phoneMap.size + noPhoneCount
  return {
    summary: {
      totalResponses: responses.length,
      uniqueApplicants,
      uniquePhoneCount: phoneMap.size,
      noPhoneCount,
      duplicateRemovalCount: Math.max(0, responses.length - uniqueApplicants),
      duplicatePhoneCount: groups.length,
      duplicateGroupCount: groups.length,
      sameFormDuplicateGroupCount,
      sameFormDuplicateResponseCount,
      sameFormDuplicateOnlyCount,
      crossFormDuplicatePhoneCount,
      crossFormDuplicateResponseCount,
    },
    groups,
    infoByResponse,
    perFormStats,
  }
}

function fallbackSummary(analysis, periodLabel) {
  const s = analysis.summary
  const top = analysis.groups.slice(0, 10)
  return [
    `기간: ${periodLabel}`,
    '',
    '1) 중복 제외 DB 갯수',
    `- 전체 응답: ${s.totalResponses}개`,
    `- 중복 제외 DB: ${s.uniqueApplicants}개`,
    `- 중복으로 빠지는 건수: ${s.duplicateRemovalCount}개`,
    '',
    '2) 같은 폼 같은 번호 중복',
    `- 중복 그룹 수: ${s.sameFormDuplicateGroupCount}개`,
    `- 2번째 신청부터 빠지는 건수: ${s.sameFormDuplicateOnlyCount}개`,
    '',
    '3) 다른 폼까지 걸친 중복',
    `- 중복 번호 수: ${s.crossFormDuplicatePhoneCount}개`,
    `- 해당 응답 건수: ${s.crossFormDuplicateResponseCount}개`,
    '',
    '4) 먼저 확인할 중복 TOP 10',
    ...(top.length ? top.map(group => `- ${group.formattedPhone} / ${group.kind} / 총 ${group.count}건 / ${group.forms.map(f => `${f.title} ${f.count}건`).join(' · ')}`) : ['- 중복 그룹 없음']),
    '',
    '5) 처리 기준',
    '- 같은 번호는 전체 DB에서 1개로 계산합니다.',
    '- 같은 폼 안에서는 첫 신청은 정상, 2번째 신청부터 중복 후보입니다.',
    '- 여러 폼에 걸친 같은 번호도 전체 DB 기준으로 1명입니다.',
  ].join('\n')
}

export default function AiCalc() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [responses, setResponses] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    getForms(user.id).then(setForms).catch(() => setError('폼 목록을 불러오지 못했습니다.'))
  }, [user])

  const periodLabel = useMemo(() => {
    if (from && to) return `${from} ~ ${to}`
    if (from) return `${from} 이후`
    if (to) return `${to}까지`
    return '전체 기간'
  }, [from, to])

  async function runCalculation() {
    setLoading(true)
    setError('')
    setAiText('')
    try {
      const options = {}
      if (from) options.from = dateStartIso(from)
      if (to) options.to = dateEndIso(to)
      const result = await getResponsesForForms(forms.map(f => f.id), 'id, form_id, answers, submitted_at', options)
      const nextAnalysis = buildDuplicateAnalysis(result || [], forms)
      setResponses(result || [])
      setAnalysis(nextAnalysis)
      return { responses: result || [], analysis: nextAnalysis }
    } catch (e) {
      setError(e?.message || '계산 중 오류가 발생했습니다.')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function runAiSummary() {
    const current = analysis ? { responses, analysis } : await runCalculation()
    if (!current) return
    setAiLoading(true)
    setError('')
    try {
      const baseText = fallbackSummary(current.analysis, periodLabel)
      setAiText(baseText + '\n\nGemini 3.5가 위 계산값을 운영자용으로 정리 중입니다...')
      const res = await fetch('/.netlify/functions/gemini-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodLabel,
          totalForms: forms.length,
          totalResponses: current.responses.length,
          duplicateSummary: current.analysis.summary,
          duplicateGroups: current.analysis.groups.slice(0, 80),
          rows: current.analysis.perFormStats,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'AI 분석 실패')
      const modelLine = data.model ? `사용 모델: ${data.model}\n\n` : ''
      setAiText(modelLine + (data.text || baseText))
    } catch (e) {
      setAiText(fallbackSummary(current.analysis, periodLabel))
      setError(`AI 분석 실패: ${e.message}. 정확한 계산 결과는 아래에 표시했습니다.`)
    } finally {
      setAiLoading(false)
    }
  }

  function getAllAnswerKeys() {
    return [...new Set(responses.flatMap(r => Object.keys(r.answers || {}).filter(k => !k.startsWith('_'))))]
  }

  function getProcessedRows() {
    return buildProcessedDbRows(responses, forms)
  }

  function downloadAllCsv() {
    if (!analysis) return
    const allKeys = getAllAnswerKeys()
    const processedRows = getProcessedRows()
    const fileRange = from || to ? `${from || 'start'}_${to || 'end'}` : 'all'
    downloadCsv(`AI중복계산_중복처리전체_${fileRange}.csv`, buildProcessedCsvRows(processedRows, allKeys))
  }

  function downloadRepresentativeCsv() {
    if (!analysis) return
    const allKeys = getAllAnswerKeys()
    const processedRows = getProcessedRows().filter(row => row.status === '대표DB')
    const fileRange = from || to ? `${from || 'start'}_${to || 'end'}` : 'all'
    downloadCsv(`AI중복계산_중복제외대표DB_${fileRange}.csv`, buildProcessedCsvRows(processedRows, allKeys))
  }

  function downloadDuplicateRowsCsv() {
    if (!analysis) return
    const allKeys = getAllAnswerKeys()
    const processedRows = getProcessedRows().filter(row => row.status === '중복후보')
    const fileRange = from || to ? `${from || 'start'}_${to || 'end'}` : 'all'
    downloadCsv(`AI중복계산_중복후보_${fileRange}.csv`, buildProcessedCsvRows(processedRows, allKeys))
  }

  function downloadGroupsCsv() {
    if (!analysis) return
    const header = ['전화번호', '중복구분', '전체응답수', '중복으로빠지는건수', '참여폼수', '걸린폼']
    const rows = analysis.groups.map(group => [
      group.formattedPhone,
      group.kind,
      group.count,
      group.duplicateOnlyCount,
      group.formCount,
      group.forms.map(f => `${f.title} ${f.count}건`).join(' / ')
    ])
    const fileRange = from || to ? `${from || 'start'}_${to || 'end'}` : 'all'
    downloadCsv(`AI중복계산_중복그룹_${fileRange}.csv`, [header, ...rows])
  }

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <div>
          <h1>AI 중복 계산 탭</h1>
          <p>정확한 숫자와 CSV는 코드가 먼저 만들고, Gemini 3.5는 그 결과를 운영자용으로 정리만 합니다.</p>
        </div>
        <button onClick={() => navigate('/dashboard')}>대시보드로 돌아가기</button>
      </header>

      <section className={s.controls}>
        <label><span>시작일</span><input type="date" value={from} onChange={e => { setFrom(e.target.value); setAnalysis(null); setAiText('') }} /></label>
        <label><span>종료일</span><input type="date" value={to} onChange={e => { setTo(e.target.value); setAnalysis(null); setAiText('') }} /></label>
        <button className={s.primary} onClick={runCalculation} disabled={loading || !forms.length}>{loading ? '계산 중...' : '중복 제외 DB 계산'}</button>
        <button className={s.aiBtn} onClick={runAiSummary} disabled={loading || aiLoading || !forms.length}>{aiLoading ? 'Gemini 3.5 분석 중...' : 'Gemini 3.5로 정리'}</button>
      </section>

      {error && <div className={s.error}>{error}</div>}

      {analysis ? (
        <>
          <section className={s.summaryGrid}>
            <div><b>{forms.length}</b><span>전체 폼</span></div>
            <div><b>{analysis.summary.totalResponses}</b><span>전체 응답</span></div>
            <div><b>{analysis.summary.uniqueApplicants}</b><span>중복 제외 DB</span></div>
            <div><b>{analysis.summary.duplicateRemovalCount}</b><span>중복으로 빠짐</span></div>
            <div><b>{analysis.summary.sameFormDuplicateOnlyCount}</b><span>같은폼 2번째부터</span></div>
            <div><b>{analysis.summary.crossFormDuplicatePhoneCount}</b><span>다른폼 중복 번호</span></div>
          </section>

          <section className={s.actions}>
            <button className={s.representativeBtn} onClick={downloadRepresentativeCsv}>중복 제외 대표 DB CSV</button>
            <button onClick={downloadDuplicateRowsCsv}>중복 후보 CSV</button>
            <button onClick={downloadAllCsv}>중복처리 전체 CSV</button>
            <button onClick={downloadGroupsCsv}>중복 그룹 CSV</button>
          </section>

          <section className={s.resultBox}>
            <h2>정확한 계산 결과</h2>
            <pre>{aiText || fallbackSummary(analysis, periodLabel)}</pre>
          </section>

          <section className={s.listBox}>
            <h2>중복 후보 TOP 50</h2>
            {analysis.groups.length === 0 ? <p className={s.empty}>중복 그룹이 없습니다.</p> : analysis.groups.slice(0, 50).map(group => (
              <div key={group.phone} className={s.groupRow}>
                <div className={s.phone}>{group.formattedPhone}</div>
                <div className={s.groupInfo}>
                  <strong>{group.kind} · 총 {group.count}건 · 중복 제외 {group.duplicateOnlyCount}건</strong>
                  <span>{group.forms.map(f => `${f.title} ${f.count}건`).join(' / ')}</span>
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <section className={s.readyBox}>
          <h2>계산 전입니다</h2>
          <p>기간을 정하고 “중복 제외 DB 계산”을 누르세요. 계산 후 대표 DB CSV, 중복 후보 CSV를 따로 받을 수 있습니다.</p>
        </section>
      )}
    </div>
  )
}
