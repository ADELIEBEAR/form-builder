import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForms, deleteForm, publishForm, unpublishForm, signOut, getResponsesForForms } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { createAndConnectSheet } from '../lib/googleSheets'
import s from './Dashboard.module.css'
import { useTheme } from '../lib/themeContext'

const RESULTS_PATH = '/responses'

function normalizePhone(v) { return String(v||'').replace(/[-\s()]/g,'').trim() }
function looksLikePhone(v) { return /^010\d{8}$/.test(normalizePhone(v)) }
function formatPhone(v) {
  const n = normalizePhone(v)
  if (n.length === 10) return n.slice(0,3)+'-'+n.slice(3,6)+'-'+n.slice(6)
  if (n.length === 11) return n.slice(0,3)+'-'+n.slice(3,7)+'-'+n.slice(7)
  return v
}
function formatVal(v) {
  const s = String(v||'')
  return looksLikePhone(s) ? formatPhone(s) : s
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
function safeFilePart(value) {
  return String(value || 'all').replace(/[^0-9a-zA-Z가-힣_-]/g, '-')
}

function extractPhonesFromAnswers(answers) {
  const phones = new Set()
  Object.values(answers || {}).forEach(v => {
    if (looksLikePhone(v)) phones.add(normalizePhone(v))
  })
  return [...phones]
}

function buildDuplicateAnalysis(responses, forms) {
  const formMap = new Map(forms.map(f => [f.id, f]))
  const phoneMap = new Map()
  const phoneFormMap = new Map()
  const infoByResponse = new Map()
  let noPhoneCount = 0
  const perFormRaw = new Map(forms.map(f => [f.id, {
    phoneSet: new Set(), noPhoneCount: 0,
    duplicateResponses: 0, duplicatePhones: new Set(),
    sameFormDuplicateResponses: 0, sameFormDuplicatePhones: new Set(),
    crossFormDuplicateResponses: 0, crossFormDuplicatePhones: new Set(),
  }]))

  ;(responses || []).forEach(r => {
    const phones = extractPhonesFromAnswers(r.answers)
    const form = formMap.get(r.form_id)
    const stats = perFormRaw.get(r.form_id)
    if (!phones.length) { noPhoneCount += 1; if (stats) stats.noPhoneCount += 1; return }
    phones.forEach(phone => {
      const entry = { id: r.id, formId: r.form_id, formTitle: form?.title || '제목 없음', group: form?.group_tag || '', submittedAt: r.submitted_at }
      if (!phoneMap.has(phone)) phoneMap.set(phone, [])
      phoneMap.get(phone).push(entry)
      const key = `${phone}::${r.form_id}`
      if (!phoneFormMap.has(key)) phoneFormMap.set(key, [])
      phoneFormMap.get(key).push(entry)
      if (stats) stats.phoneSet.add(phone)
    })
  })

  phoneMap.forEach(entries => entries.sort((a,b) => new Date(a.submittedAt) - new Date(b.submittedAt)))
  phoneFormMap.forEach(entries => entries.sort((a,b) => new Date(a.submittedAt) - new Date(b.submittedAt)))

  const groups = []
  let sameFormGroupCount = 0, sameFormDuplicateOnlyCount = 0, sameFormResponseCount = 0
  let crossFormGroupCount = 0, crossFormResponseCount = 0

  phoneMap.forEach((entries, phone) => {
    const formIds = [...new Set(entries.map(e => e.formId))]
    const sameFormGroups = formIds.map(formId => {
      const sameEntries = phoneFormMap.get(`${phone}::${formId}`) || []
      return { formId, formTitle: sameEntries[0]?.formTitle || formMap.get(formId)?.title || '제목 없음', count: sameEntries.length }
    }).filter(g => g.count > 1)
    const isSame = sameFormGroups.length > 0
    const isCross = formIds.length > 1
    if (!isSame && !isCross) return
    if (isSame) {
      sameFormGroupCount += sameFormGroups.length
      sameFormResponseCount += sameFormGroups.reduce((sum, g) => sum + g.count, 0)
      sameFormDuplicateOnlyCount += sameFormGroups.reduce((sum, g) => sum + g.count - 1, 0)
    }
    if (isCross) { crossFormGroupCount += 1; crossFormResponseCount += entries.length }

    let kind = '같은폼 중복'
    if (isSame && isCross) kind = '같은폼+다른폼 중복'
    else if (isCross) kind = '다른폼 중복'

    const forms = formIds.map(formId => ({ formId, title: formMap.get(formId)?.title || '제목 없음', count: entries.filter(e => e.formId === formId).length }))
    groups.push({
      phone, formattedPhone: formatPhone(phone), kind,
      count: entries.length, duplicateOnlyCount: Math.max(0, entries.length - 1), formCount: formIds.length,
      forms, sameFormGroups,
    })

    entries.forEach((entry, index) => {
      const sameEntries = phoneFormMap.get(`${phone}::${entry.formId}`) || []
      const sameIndex = sameEntries.findIndex(e => e.id === entry.id)
      const sameFormDuplicate = sameIndex > 0
      const crossFormDuplicate = isCross
      if (!sameFormDuplicate && !crossFormDuplicate) return
      let rowKind = ''
      if (sameFormDuplicate) rowKind += `같은폼 ${sameIndex + 1}번째 신청!`
      if (crossFormDuplicate) rowKind += rowKind ? ' / 다른폼 중복' : '다른폼 중복'
      infoByResponse.set(entry.id, {
        phone, formattedPhone: formatPhone(phone), duplicate: true, kind: rowKind,
        totalForPhone: entries.length, formCount: formIds.length, sameFormCount: sameEntries.length,
      })
      const stats = perFormRaw.get(entry.formId)
      if (stats) {
        stats.duplicateResponses += 1; stats.duplicatePhones.add(phone)
        if (sameFormDuplicate) { stats.sameFormDuplicateResponses += 1; stats.sameFormDuplicatePhones.add(phone) }
        if (crossFormDuplicate) { stats.crossFormDuplicateResponses += 1; stats.crossFormDuplicatePhones.add(phone) }
      }
    })
  })

  groups.sort((a,b) => b.duplicateOnlyCount - a.duplicateOnlyCount || b.count - a.count)
  const perFormStats = {}
  perFormRaw.forEach((stats, formId) => {
    perFormStats[formId] = {
      uniqueApplicants: stats.phoneSet.size + stats.noPhoneCount,
      duplicateResponses: stats.duplicateResponses,
      duplicatePhoneCount: stats.duplicatePhones.size,
      sameFormDuplicateResponses: stats.sameFormDuplicateResponses,
      sameFormDuplicatePhoneCount: stats.sameFormDuplicatePhones.size,
      crossFormDuplicateResponses: stats.crossFormDuplicateResponses,
      crossFormDuplicatePhoneCount: stats.crossFormDuplicatePhones.size,
    }
  })
  const uniqueApplicants = phoneMap.size + noPhoneCount
  return {
    summary: {
      totalResponses: (responses || []).length,
      uniqueApplicants,
      uniquePhoneCount: phoneMap.size,
      noPhoneCount,
      duplicateRemovalCount: Math.max(0, (responses || []).length - uniqueApplicants),
      duplicatePhoneCount: groups.length,
      duplicateGroupCount: groups.length,
      sameFormDuplicateGroupCount: sameFormGroupCount,
      sameFormDuplicateResponseCount: sameFormResponseCount,
      sameFormDuplicateOnlyCount,
      crossFormDuplicatePhoneCount: crossFormGroupCount,
      crossFormDuplicateResponseCount: crossFormResponseCount,
    }, groups, infoByResponse, perFormStats
  }
}


export default function Dashboard() {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [publishing, setPublishing] = useState({})
  const [editingMemo, setEditingMemo] = useState(null)
  const [memoVal, setMemoVal] = useState('')
  const [editingTitle, setEditingTitle] = useState(null)
  const [titleVal, setTitleVal] = useState('')
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState(() => sessionStorage.getItem('groupFilter') || '전체')
  const [editingGroup, setEditingGroup] = useState(null)
  const [groupVal, setGroupVal] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const memoRef = useRef(null)
  const titleRef = useRef(null)
  const groupRef = useRef(null)

  // ── 관리자 잠금
  const currentAdminPw = user?.user_metadata?.admin_pw || '0000'
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwError, setPwError] = useState('')

  // ── 응답 패널
  const [panelMode, setPanelMode] = useState(null)   // null | 'form' | 'all'
  const [panelForm, setPanelForm] = useState(null)   // 열린 폼 (form 모드)
  const [panelData, setPanelData] = useState(null)   // { responses, dupes }
  const [allRespData, setAllRespData] = useState(null) // 전체 응답
  const [allRespLoading, setAllRespLoading] = useState(false)
  const [panelLoading, setPanelLoading] = useState(false)
  const [panelTab, setPanelTab] = useState('recent') // 'recent' | 'dupes'

  // ── 전체 폼 통계 / 기간 CSV / Gemini 요약
  const [statsFrom, setStatsFrom] = useState('')
  const [statsTo, setStatsTo] = useState('')
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsRows, setStatsRows] = useState(null)
  const [statsResponses, setStatsResponses] = useState([])
  const [statsDupes, setStatsDupes] = useState(null)
  const [statsAiLoading, setStatsAiLoading] = useState(false)
  const [statsAiText, setStatsAiText] = useState('')

  useEffect(() => {
    if (user) { loadForms(); saveGoogleToken() }
    else setLoading(false)
  }, [user])

  async function saveGoogleToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.provider_token || !user) return
      await supabase.from('google_tokens').upsert({
        user_id: user.id, access_token: session.provider_token,
        refresh_token: session.provider_refresh_token || '', updated_at: new Date().toISOString()
      })
    } catch {}
  }

  async function loadForms() {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
      const data = await Promise.race([getForms(user.id), timeout])
      setForms(data || [])
    } catch (e) {
      showToast(e.message === 'timeout' ? '연결이 느립니다. 새로고침해주세요.' : '폼을 불러오는 데 실패했습니다.', 'fail')
    } finally { setLoading(false) }
  }

  // ── 응답 패널 열기
  async function openPanel(form, e) {
    e?.stopPropagation()
    if (!isUnlocked) {
      setPanelForm(form)
      setInputPw(''); setPwError('')
      setShowPwModal(true)
      return
    }
    setPanelMode('form')
    await fetchPanelData(form)
  }

  async function fetchPanelData(form) {
    setPanelMode('form')
    setPanelForm(form)
    setPanelLoading(true)
    setPanelData(null)
    try {
      const responses = await getResponsesForForms([form.id], 'id, form_id, answers, submitted_at')
      // 전화번호만 기준으로 중복 감지
      function normPhone(v) { return String(v||'').replace(/[-\s()]/g,'').trim() }
      function isPhone(v) { return /^010\d{8}$/.test(normPhone(v)) }

      const phoneMap = {}
      responses.forEach(r => {
        Object.values(r.answers || {}).forEach(v => {
          if (!isPhone(v)) return
          const n = normPhone(v)
          if (!phoneMap[n]) phoneMap[n] = []
          phoneMap[n].push(r.id)
        })
      })
      // 같은 폼 안에서 같은 번호가 2번 이상인 것만
      const dupeIds = new Set()
      Object.values(phoneMap).forEach(ids => { if (ids.length > 1) ids.forEach(id => dupeIds.add(id)) })
      const dupes = responses.filter(r => dupeIds.has(r.id))
      setPanelData({ responses, dupes })
    } catch { showToast('응답을 불러오지 못했습니다.', 'fail') }
    finally { setPanelLoading(false) }
  }

  // ── 전체 응답 불러오기
  async function fetchAllResp() {
    setPanelMode('all')
    setPanelForm(null)
    setAllRespLoading(true)
    setAllRespData(null)
    try {
      // 폼 목록 (그룹 태그 포함)
      const formMap = Object.fromEntries(forms.map(f => [f.id, f]))

      const data = await getResponsesForForms(forms.map(f => f.id), 'id, form_id, answers, submitted_at')

      setAllRespData(data || [])
    } catch { showToast('전체 응답을 불러오지 못했습니다.', 'fail') }
    finally { setAllRespLoading(false) }
  }


  function getStatsOptions() {
    const options = {}
    if (statsFrom) options.from = dateStartIso(statsFrom)
    if (statsTo) options.to = dateEndIso(statsTo)
    return options
  }

  function getStatsPeriodLabel() {
    if (statsFrom && statsTo) return `${statsFrom} ~ ${statsTo}`
    if (statsFrom) return `${statsFrom} 이후`
    if (statsTo) return `${statsTo}까지`
    return '전체 기간'
  }

  function resetStatsData() {
    setStatsRows(null)
    setStatsResponses([])
    setStatsDupes(null)
    setStatsAiText('')
  }

  function buildStatsRows(responses) {
    const map = new Map(forms.map(f => [f.id, {
      formId: f.id,
      title: f.title || '제목 없음',
      group: f.group_tag || '',
      count: 0,
      firstSubmittedAt: null,
      lastSubmittedAt: null,
      theme_c1: f.theme_c1,
      theme_c2: f.theme_c2,
    }]))

    ;(responses || []).forEach(r => {
      const row = map.get(r.form_id)
      if (!row) return
      row.count += 1
      const t = new Date(r.submitted_at).getTime()
      if (!row.lastSubmittedAt || t > new Date(row.lastSubmittedAt).getTime()) row.lastSubmittedAt = r.submitted_at
      if (!row.firstSubmittedAt || t < new Date(row.firstSubmittedAt).getTime()) row.firstSubmittedAt = r.submitted_at
    })

    return Array.from(map.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.title.localeCompare(b.title, 'ko')
    })
  }

  async function fetchStatsReport() {
    setPanelMode('stats')
    setPanelForm(null)
    setStatsLoading(true)
    setStatsAiText('')
    try {
      const responses = await getResponsesForForms(forms.map(f => f.id), 'id, form_id, answers, submitted_at', getStatsOptions())
      const dupeAnalysis = buildDuplicateAnalysis(responses || [], forms)
      const rows = buildStatsRows(responses || []).map(row => ({
        ...row,
        ...(dupeAnalysis.perFormStats[row.formId] || { uniqueApplicants: row.count, duplicateResponses: 0, duplicatePhoneCount: 0, sameFormDuplicateResponses: 0, crossFormDuplicateResponses: 0 })
      }))
      setStatsResponses(responses || [])
      setStatsRows(rows)
      setStatsDupes(dupeAnalysis)
      return { responses: responses || [], rows, dupes: dupeAnalysis }
    } catch (e) {
      showToast('전체 폼 통계를 불러오지 못했습니다.', 'fail')
      return null
    } finally {
      setStatsLoading(false)
    }
  }

  async function ensureStatsReport() {
    if (statsRows) return { responses: statsResponses, rows: statsRows, dupes: statsDupes || buildDuplicateAnalysis(statsResponses || [], forms) }
    return await fetchStatsReport()
  }

  async function downloadAllFormsCsv() {
    const report = await ensureStatsReport()
    if (!report) return
    const { responses } = report
    if (!responses.length) return showToast('다운로드할 응답이 없습니다.', 'fail')

    const formMap = Object.fromEntries(forms.map(f => [f.id, f]))
    const dupeAnalysis = report.dupes || buildDuplicateAnalysis(responses || [], forms)
    const keys = [...new Set(responses.flatMap(r => Object.keys(r.answers || {}).filter(k => !k.startsWith('_'))))]
    const header = ['폼명', '그룹', '제출일시', '전화번호', '중복여부', '중복구분', '동일번호 전체응답수', '동일번호 참여폼수', '같은폼 동일번호 응답수', ...keys]
    const rows = responses.map(r => {
      const f = formMap[r.form_id] || {}
      const submitted = new Date(r.submitted_at).toLocaleString('ko-KR')
      const info = dupeAnalysis.infoByResponse.get(r.id)
      const phone = info?.formattedPhone || extractPhonesFromAnswers(r.answers)[0] || ''
      return [f.title || '제목 없음', f.group_tag || '', submitted, phone, info?.duplicate ? '중복' : '', info?.kind || '', info?.totalForPhone || '', info?.formCount || '', info?.sameFormCount || '', ...keys.map(k => r.answers?.[k] ?? '')]
    })

    const period = statsFrom || statsTo ? `${safeFilePart(statsFrom || 'start')}_${safeFilePart(statsTo || 'end')}` : 'all'
    downloadCsv(`전체폼_응답_${period}.csv`, [header, ...rows])
    showToast('CSV 다운로드를 시작했습니다.', 'ok')
  }

  async function downloadFormCountCsv() {
    const report = await ensureStatsReport()
    if (!report) return
    const header = ['폼명', '그룹', '전체 응답 수', '중복 제외 신청자 수', '중복 관련 응답 수', '중복 전화번호 수', '같은폼 중복 응답 수', '다른폼 중복 응답 수', '첫 신청', '최근 신청']
    const rows = report.rows.map(row => [
      row.title,
      row.group,
      row.count,
      row.uniqueApplicants ?? row.count,
      row.duplicateResponses || 0,
      row.duplicatePhoneCount || 0,
      row.sameFormDuplicateResponses || 0,
      row.crossFormDuplicateResponses || 0,
      row.firstSubmittedAt ? new Date(row.firstSubmittedAt).toLocaleString('ko-KR') : '',
      row.lastSubmittedAt ? new Date(row.lastSubmittedAt).toLocaleString('ko-KR') : '',
    ])
    const period = statsFrom || statsTo ? `${safeFilePart(statsFrom || 'start')}_${safeFilePart(statsTo || 'end')}` : 'all'
    downloadCsv(`전체폼_응답수_${period}.csv`, [header, ...rows])
    showToast('응답 수 CSV 다운로드를 시작했습니다.', 'ok')
  }

  async function runGeminiSummary() {
    const report = await ensureStatsReport()
    if (!report) return
    setStatsAiLoading(true)
    setStatsAiText('')
    try {
      const res = await fetch('/.netlify/functions/gemini-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodLabel: getStatsPeriodLabel(),
          totalForms: forms.length,
          totalResponses: report.responses.length,
          duplicateSummary: (report.dupes || buildDuplicateAnalysis(report.responses || [], forms)).summary,
          duplicateGroups: (report.dupes || buildDuplicateAnalysis(report.responses || [], forms)).groups.slice(0, 80),
          rows: report.rows,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Gemini 요약 실패')
      setStatsAiText(data.text || '요약 결과가 없습니다.')
    } catch (e) {
      setStatsAiText(`Gemini 요약 실패: ${e.message}`)
    } finally {
      setStatsAiLoading(false)
    }
  }

  function handleStatsClick() {
    if (panelMode === 'stats') { setPanelMode(null); return }
    if (!isUnlocked) {
      setPendingAction('stats')
      setInputPw('')
      setPwError('')
      setShowPwModal(true)
      return
    }
    fetchStatsReport()
  }

  function runAfterUnlock() {
    const action = pendingAction
    setPendingAction(null)
    if (action === 'stats') return fetchStatsReport()
    if (action === 'all') return fetchAllResp()
    if (targetFormId) {
      navigate(`${RESULTS_PATH}/${targetFormId}`)
      setTargetFormId(null)
      return
    }
    if (panelForm) return fetchPanelData(panelForm)
    return fetchAllResp()
  }

  // ── 그룹 편집
  function startGroup(form, e) {
    e.stopPropagation()
    setEditingGroup(form.id)
    setGroupVal(form.group_tag || '')
    setTimeout(() => groupRef.current?.focus(), 50)
  }
  async function saveGroup(formId) {
    try {
      await supabase.from('forms').update({ group_tag: groupVal.trim() || null }).eq('id', formId)
      setForms(prev => prev.map(f => f.id === formId ? { ...f, group_tag: groupVal.trim() || null } : f))
    } catch {}
    setEditingGroup(null)
  }

  async function handleDelete(formId, e) {
    e.stopPropagation()
    if (!confirm('이 폼을 삭제할까요?')) return
    try {
      await deleteForm(formId)
      setForms(prev => prev.filter(f => f.id !== formId))
      if (panelForm?.id === formId) setPanelForm(null)
      showToast('폼이 삭제되었습니다.', 'ok')
    } catch { showToast('삭제 중 오류가 발생했습니다.', 'fail') }
  }

  async function handlePublish(form, e) {
    e.stopPropagation()
    setPublishing(prev => ({ ...prev, [form.id]: true }))
    try {
      if (form.is_published) {
        await unpublishForm(form.id)
        setForms(prev => prev.map(f => f.id === form.id ? { ...f, is_published: false } : f))
        showToast('비공개로 변경되었습니다.', 'ok')
      } else {
        const updated = await publishForm(form.id, form.title)
        setForms(prev => prev.map(f => f.id === form.id ? { ...f, ...updated } : f))
        showToast('🎉 폼이 공개되었습니다!', 'ok')
      }
    } catch { showToast('오류가 발생했습니다.', 'fail') }
    finally { setPublishing(prev => ({ ...prev, [form.id]: false })) }
  }

  function copyShareLink(form, e) {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`)
    showToast('✅ 링크 복사 완료!', 'ok')
  }

  async function handleSheetConnect(form, e) {
    e.stopPropagation()
    try {
      // Apps Script URL + 백업 시트로 연결
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec'
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/14BpX7cxcKVrw2LF0bQWW9CNjmBcY7HVj7HcQNaaSPL0/edit'
      await supabase.from('forms').update({ sheet_id: 'backup', sheet_url: sheetUrl }).eq('id', form.id)
      // 폼 settings에 scriptUrl 저장
      const form_data = forms.find(f => f.id === form.id)
      const settings = { ...(form_data?.settings || {}), scriptUrl }
      await supabase.from('forms').update({ settings }).eq('id', form.id)
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, sheet_id: 'backup', sheet_url: sheetUrl, settings } : f))
      showToast('✅ 백업 시트 연결 완료!', 'ok')
      window.open(sheetUrl, '_blank')
    } catch (err) {
      showToast('연결 실패: ' + err.message, 'fail')
    }
  }

  async function handleSheetDisconnect(formId, e) {
    e.stopPropagation()
    if (!confirm('시트 연결을 해제할까요?')) return
    await supabase.from('forms').update({ sheet_id: null, sheet_url: null }).eq('id', formId)
    setForms(prev => prev.map(f => f.id === formId ? { ...f, sheet_id: null, sheet_url: null } : f))
    showToast('시트 연결이 해제되었습니다.', 'ok')
  }

  function startMemo(form, e) {
    e.stopPropagation()
    setEditingMemo(form.id)
    setMemoVal(form.memo || '')
    setTimeout(() => memoRef.current?.focus(), 50)
  }
  async function saveMemo(formId) {
    try {
      await supabase.from('forms').update({ memo: memoVal }).eq('id', formId)
      setForms(prev => prev.map(f => f.id === formId ? { ...f, memo: memoVal } : f))
    } catch { showToast('저장 실패', 'fail') }
    setEditingMemo(null)
  }

  function startTitle(form, e) {
    e.stopPropagation()
    setEditingTitle(form.id)
    setTitleVal(form.title)
    setTimeout(() => titleRef.current?.focus(), 50)
  }
  async function saveTitle(formId) {
    if (!titleVal.trim()) return setEditingTitle(null)
    try {
      await supabase.from('forms').update({ title: titleVal, updated_at: new Date().toISOString() }).eq('id', formId)
      setForms(prev => prev.map(f => f.id === formId ? { ...f, title: titleVal } : f))
      showToast('제목이 변경되었습니다.', 'ok')
    } catch { showToast('저장 실패', 'fail') }
    setEditingTitle(null)
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  function formatDateShort(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // ── 암호 관련
  function handleAdminAction() {
    if (isUnlocked) { setOldPw(''); setNewPw(''); setShowSetPwModal(true) }
    else { setInputPw(''); setPwError(''); setShowPwModal(true) }
  }

  function submitPassword(afterUnlock) {
    if (inputPw === currentAdminPw) {
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowPwModal(false)
      setPwError('')
      if (afterUnlock) afterUnlock()
      else runAfterUnlock()
    } else {
      setPwError('비밀번호가 일치하지 않습니다.')
    }
  }

  async function saveNewPassword() {
    if (oldPw !== currentAdminPw) return setPwError('기존 암호가 일치하지 않습니다.')
    if (newPw.length < 4) return setPwError('새 암호는 4자리 이상 입력해주세요.')
    try {
      await supabase.auth.updateUser({ data: { admin_pw: newPw } })
      showToast('암호가 변경되었습니다.', 'ok')
      setShowSetPwModal(false)
    } catch { setPwError('암호 변경 중 오류가 발생했습니다.') }
  }

  // ── 그룹 목록
  const allGroups = ['전체', ...Array.from(new Set(forms.map(f => f.group_tag).filter(Boolean)))]

  const filtered = forms.filter(f => {
    const matchSearch = f.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.memo?.toLowerCase().includes(search.toLowerCase()) ||
      f.group_tag?.toLowerCase().includes(search.toLowerCase())
    const matchGroup = groupFilter === '전체' || f.group_tag === groupFilter
    return matchSearch && matchGroup
  })

  // ── 패널 응답 첫 번째 값 추출
  function getFirstAnswers(r) {
    const entries = Object.entries(r.answers || {}).filter(([k]) => !k.startsWith('_'))
    return entries.slice(0, 3)
  }

  return (
    <div className={`${s.wrap} ${panelMode ? s.wrapPanelOpen : ''}`}>
      {/* ── 헤더 */}
      <header className={s.header}>
        <div className={s.headerLeft} onClick={() => navigate('/')}>
          <div className={s.logoMark}>✦</div>
          <span className={s.logoText}>폼 빌더</span>
        </div>
        <div className={s.headerRight}>
          <button className={`${s.adminBtn} ${isUnlocked ? s.unlocked : ''}`} onClick={handleAdminAction}>
            {isUnlocked ? '🔓 암호 변경' : '🔒 잠금 해제'}
          </button>
          <button className={s.aiCalcBtn || s.statsBtn} onClick={() => navigate('/ai-calc')}>🤖 AI 계산</button>
          <button className={s.dupeBtn} onClick={() => navigate('/duplicates')}>📵 중복 체크</button>
          <button className={`${s.allRespBtn} ${panelMode === 'all' ? s.allRespBtnOn : ''}`}
            onClick={() => {
              if (panelMode === 'all') { setPanelMode(null); return }
              if (!isUnlocked) { setPendingAction('all'); setInputPw(''); setPwError(''); setShowPwModal(true); return }
              fetchAllResp()
            }}>
            {isUnlocked ? '📋 전체 응답' : '🔒 전체 응답'}
          </button>
          <button className={`${s.statsBtn} ${panelMode === 'stats' ? s.statsBtnOn : ''}`} onClick={handleStatsClick}>
            {isUnlocked ? '📈 통계/CSV' : '🔒 통계/CSV'}
          </button>
          <div className={s.userChip}>
            {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} className={s.avatar} alt="" />}
            <span>{user?.user_metadata?.full_name || user?.email}</span>
          </div>
          <button className={s.themeToggle} onClick={toggle} title="테마 전환">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/') }}>로그아웃</button>
        </div>
      </header>

      <div className={s.body}>
        <main className={s.main}>
          {/* 상단 */}
          <div className={s.topRow}>
            <div className={s.topLeft}>
              <h1 className={s.pageTitle}>내 폼</h1>
              <span className={s.formCount}>{forms.length}개</span>
            </div>
            <div className={s.topRight}>
              <div className={s.searchWrap}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input className={s.searchInp} value={search} onChange={e => setSearch(e.target.value)} placeholder="제목, 메모, 그룹 검색..." />
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/builder')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                새 폼 만들기
              </button>
            </div>
          </div>

          {/* 그룹 필터 탭 */}
          {allGroups.length > 1 && (
            <div className={s.groupTabs}>
              {allGroups.map(g => (
                <button key={g} className={`${s.groupTab} ${groupFilter === g ? s.groupTabOn : ''}`} onClick={() => { setGroupFilter(g); sessionStorage.setItem('groupFilter', g) }}>
                  {g}
                  {g !== '전체' && <span className={s.groupTabCount}>{forms.filter(f => f.group_tag === g).length}</span>}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className={s.loadWrap}><div className={s.spinner}></div></div>
          ) : forms.length === 0 ? (
            <div className={s.emptyWrap}>
              <div className={s.emptyIco}>✦</div>
              <h2>아직 만든 폼이 없어요</h2>
              <p>새 폼을 만들어 응답을 받아보세요!</p>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }} onClick={() => navigate('/builder')}>첫 번째 폼 만들기</button>
            </div>
          ) : (
            <div className={s.grid}>
              <div className={s.newCard} onClick={() => navigate('/builder')}>
                <div className={s.newIco}>+</div>
                <span>새 폼 만들기</span>
              </div>

              {filtered.map(form => (
                <div key={form.id} className={`${s.formCard} ${panelForm?.id === form.id ? s.formCardActive : ''}`}>
                  {/* 컬러 헤더 */}
                  <div className={s.cardTop} style={{ background: `linear-gradient(135deg,${form.theme_c1},${form.theme_c2})` }}>
                    <div className={s.cardTopRow}>
                      <span className={s.qBadge}>{form.questions?.length || 0}문항</span>
                      {form.is_published
                        ? <span className={s.pubBadge}>● 공개중</span>
                        : <span className={s.draftBadge}>초안</span>
                      }
                    </div>
                  </div>

                  <div className={s.cardBody}>
                    {/* 제목 */}
                    {editingTitle === form.id ? (
                      <input ref={titleRef} className={`${s.titleEdit} inp`} value={titleVal}
                        onChange={e => setTitleVal(e.target.value)}
                        onBlur={() => saveTitle(form.id)}
                        onKeyDown={e => e.key === 'Enter' && saveTitle(form.id)}
                        onClick={e => e.stopPropagation()} />
                    ) : (
                      <div className={s.cardTitle} onClick={e => startTitle(form, e)} title="클릭해서 제목 수정">
                        {form.title || '제목 없음'}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.editIco}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </div>
                    )}

                    {/* 그룹 태그 */}
                    {editingGroup === form.id ? (
                      <input ref={groupRef} className={s.groupEdit} value={groupVal}
                        onChange={e => setGroupVal(e.target.value)}
                        onBlur={() => saveGroup(form.id)}
                        onKeyDown={e => e.key === 'Enter' && saveGroup(form.id)}
                        onClick={e => e.stopPropagation()}
                        placeholder="그룹명 입력 (예: 코인채널, 주식채널)" />
                    ) : (
                      <div className={s.groupTagWrap} onClick={e => startGroup(form, e)}>
                        {form.group_tag
                          ? <span className={s.groupTag}>📁 {form.group_tag}</span>
                          : <span className={s.groupTagEmpty}>+ 그룹 설정</span>
                        }
                      </div>
                    )}

                    {/* 메모 */}
                    {editingMemo === form.id ? (
                      <input ref={memoRef} className={`${s.memoEdit} inp`} value={memoVal}
                        onChange={e => setMemoVal(e.target.value)}
                        placeholder="내부 메모 (나만 보여요)..."
                        onBlur={() => saveMemo(form.id)}
                        onKeyDown={e => e.key === 'Enter' && saveMemo(form.id)}
                        onClick={e => e.stopPropagation()} />
                    ) : (
                      <div className={s.memo} onClick={e => startMemo(form, e)}>
                        {form.memo
                          ? <span className={s.memoText}>📝 {form.memo}</span>
                          : <span className={s.memoEmpty}>+ 내부 메모 추가</span>
                        }
                      </div>
                    )}

                    <div className={s.cardDate}>{formatDate(form.updated_at)}</div>
                  </div>

                  <div className={s.cardActions}>
                    <div className={s.actionRow}>
                      <button className={`${s.actionBtn} ${s.actionBtnPrimary}`} onClick={() => navigate(`/builder/${form.id}`)}>✏️ 편집</button>
                      {/* 응답 미리보기 — 패널 열기 */}
                      <button className={`${s.actionBtn} ${s.actionBtnPanel} ${panelForm?.id === form.id ? s.actionBtnPanelOn : ''}`}
                        onClick={e => panelForm?.id === form.id ? setPanelForm(null) : openPanel(form, e)}>
                        {panelForm?.id === form.id ? '✕ 닫기' : (isUnlocked ? '👁 응답 보기' : '🔒 응답 보기')}
                      </button>
                    </div>
                    <div className={s.actionRow}>
                      <button className={`${s.actionBtn}`} onClick={e => {
                        e.stopPropagation()
                        if (!isUnlocked) { setInputPw(''); setPwError(''); setTargetFormId(form.id); setShowPwModal(true); return }
                        navigate(`${RESULTS_PATH}/${form.id}`)
                      }}>
                        {isUnlocked ? '📊 전체 응답' : '🔒 전체 응답'}
                      </button>
                      <button className={`${s.actionBtn} ${form.is_published ? s.actionBtnWarning : s.actionBtnSuccess}`}
                        onClick={e => handlePublish(form, e)} disabled={publishing[form.id]}>
                        {publishing[form.id] ? '...' : form.is_published ? '🔒 비공개' : '🚀 발행'}
                      </button>
                    </div>
                    <div className={s.actionRow}>
                      {form.is_published && (
                        <button className={s.actionBtn} onClick={e => copyShareLink(form, e)}>🔗 링크 복사</button>
                      )}
                      <span className={s.sheetConnected}>✅ 시트 백업 연결됨</span>
                      <button className={`${s.actionBtn} ${s.actionBtnDanger}`} onClick={e => handleDelete(form.id, e)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ── 우측 패널 (폼별 or 전체) */}
        {panelMode && (
          <aside className={s.panel}>

            {/* ── 폼별 응답 패널 */}
            {panelMode === 'form' && panelForm && (<>
              <div className={s.panelHeader}>
                <div className={s.panelTitle}>
                  <span>{panelForm.title}</span>
                  {panelData && <span className={s.panelCount}>{panelData.responses.length}개 응답</span>}
                </div>
                <div className={s.panelHeaderRight}>
                  <button className={s.panelFullBtn} onClick={() => {
                  if (!isUnlocked) { setInputPw(''); setPwError(''); setTargetFormId(panelForm.id); setShowPwModal(true); return }
                  navigate(`${RESULTS_PATH}/${panelForm.id}`)
                }}>전체보기 ↗</button>
                  <button className={s.panelClose} onClick={() => { setPanelMode(null); setPanelForm(null) }}>✕</button>
                </div>
              </div>
              <div className={s.panelTabs}>
                <button className={`${s.panelTab} ${panelTab === 'recent' ? s.panelTabOn : ''}`} onClick={() => setPanelTab('recent')}>최근 응답</button>
                <button className={`${s.panelTab} ${panelTab === 'dupes' ? s.panelTabOn : ''}`} onClick={() => setPanelTab('dupes')}>
                  중복 의심
                  {panelData?.dupes.length > 0 && <span className={s.dupeBadge}>{panelData.dupes.length}</span>}
                </button>
              </div>
              <div className={s.panelBody}>
                {panelLoading ? (
                  <div className={s.panelLoading}><div className={s.spinner}></div></div>
                ) : !panelData ? null : panelTab === 'recent' ? (
                  panelData.responses.length === 0 ? (
                    <div className={s.panelEmpty}>아직 응답이 없습니다</div>
                  ) : panelData.responses.map((r, i) => (
                    <div key={r.id} className={s.respItem}>
                      <div className={s.respItemHead}>
                        <span className={s.respNum}>#{panelData.responses.length - i}</span>
                        <span className={s.respDate}>{formatDateShort(r.submitted_at)}</span>
                        {panelData.dupes.find(d => d.id === r.id) && <span className={s.dupeTag}>중복</span>}
                      </div>
                      {getFirstAnswers(r).map(([k, v]) => (
                        <div key={k} className={s.respRow}>
                          <span className={s.respKey}>{k}</span>
                          <span className={s.respVal}>{formatVal(String(v)).slice(0, 60)}</span>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  panelData.dupes.length === 0 ? (
                    <div className={s.panelEmpty}>✅ 중복 의심 응답 없음</div>
                  ) : panelData.dupes.map((r, i) => (
                    <div key={r.id} className={`${s.respItem} ${s.respItemDupe}`}>
                      <div className={s.respItemHead}>
                        <span className={s.dupeTag}>중복</span>
                        <span className={s.respDate}>{formatDateShort(r.submitted_at)}</span>
                      </div>
                      {getFirstAnswers(r).map(([k, v]) => (
                        <div key={k} className={s.respRow}>
                          <span className={s.respKey}>{k}</span>
                          <span className={s.respVal}>{formatVal(String(v)).slice(0, 60)}</span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </>)}


            {/* ── 전체 폼 통계 / 기간 CSV / Gemini 요약 패널 */}
            {panelMode === 'stats' && (<>
              <div className={s.panelHeader}>
                <div className={s.panelTitle}>
                  <span>전체 폼 중복 체크 / CSV</span>
                  <span className={s.panelCount}>{getStatsPeriodLabel()}</span>
                </div>
                <div className={s.panelHeaderRight}>
                  <button className={s.panelClose} onClick={() => setPanelMode(null)}>✕</button>
                </div>
              </div>
              <div className={s.panelBody}>
                <div className={s.statsBox}>
                  <div className={s.statsLabel}>기간 설정</div>
                  <div className={s.dateGrid}>
                    <label>
                      <span>시작일</span>
                      <input type="date" value={statsFrom} onChange={e => { setStatsFrom(e.target.value); resetStatsData() }} />
                    </label>
                    <label>
                      <span>종료일</span>
                      <input type="date" value={statsTo} onChange={e => { setStatsTo(e.target.value); resetStatsData() }} />
                    </label>
                  </div>
                  <div className={s.statsActions}>
                    <button className={s.statsPrimaryBtn} onClick={fetchStatsReport} disabled={statsLoading}>
                      {statsLoading ? '불러오는 중...' : '기간 적용 / 응답 수 파악'}
                    </button>
                    <button className={s.statsGhostBtn} onClick={() => { setStatsFrom(''); setStatsTo(''); resetStatsData() }} disabled={statsLoading}>전체 기간</button>
                  </div>
                </div>

                {statsLoading ? (
                  <div className={s.panelLoading}><div className={s.spinner}></div></div>
                ) : statsRows ? (<>
                  <div className={s.statsSummaryGrid}>
                    <div><b>{forms.length}</b><span>전체 폼</span></div>
                    <div><b>{statsResponses.length}</b><span>전체 응답</span></div>
                    <div><b>{statsDupes?.summary.uniqueApplicants ?? statsResponses.length}</b><span>중복 제외 DB</span></div>
                    <div><b>{statsDupes?.summary.duplicateRemovalCount ?? 0}</b><span>중복 제외 건수</span></div>
                  </div>

                  <div className={s.statsActions}>
                    <button className={s.statsPrimaryBtn} onClick={downloadAllFormsCsv}>전체폼 CSV 다운로드</button>
                    <button className={s.statsGhostBtn} onClick={downloadFormCountCsv}>응답 수 CSV</button>
                  </div>

                  <div className={s.statsActions}>
                    <button className={s.statsPrimaryBtn} onClick={() => navigate('/ai-calc')}>🤖 AI 계산 탭에서 중복 DB 계산하기</button>
                  </div>

                  <div className={s.formCountList}>
                    {statsRows.map((row, idx) => (
                      <div key={row.formId} className={s.formCountRow}>
                        <div className={s.formCountRank}>#{idx + 1}</div>
                        <div className={s.formCountInfo}>
                          <div className={s.formCountTitle}>{row.title}</div>
                          <div className={s.formCountMeta}>
                            {row.group ? `📁 ${row.group} · ` : ''}
                            {row.lastSubmittedAt ? `최근 ${formatDateShort(row.lastSubmittedAt)}` : '응답 없음'}
                          </div>
                        </div>
                        <div className={s.formCountNum}>{row.count}</div>
                      </div>
                    ))}
                  </div>
                </>) : (
                  <div className={s.panelEmpty}>기간을 정하고 “기간 적용 / 응답 수 파악”을 눌러주세요.</div>
                )}
              </div>
            </>)}

            {/* ── 전체 응답 패널 */}
            {panelMode === 'all' && (<>
              <div className={s.panelHeader}>
                <div className={s.panelTitle}>
                  <span>전체 응답</span>
                  {allRespData && <span className={s.panelCount}>{allRespData.length}개</span>}
                </div>
                <div className={s.panelHeaderRight}>
                  <button className={s.panelClose} onClick={() => setPanelMode(null)}>✕</button>
                </div>
              </div>
              <div className={s.panelBody}>
                {allRespLoading ? (
                  <div className={s.panelLoading}><div className={s.spinner}></div></div>
                ) : !allRespData ? null : allRespData.length === 0 ? (
                  <div className={s.panelEmpty}>응답이 없습니다</div>
                ) : allRespData.map((r, i) => {
                  const form = forms.find(f => f.id === r.form_id)
                  return (
                    <div key={r.id} className={s.respItem}>
                      <div className={s.respItemHead}>
                        <span className={s.respDate}>{formatDateShort(r.submitted_at)}</span>
                      </div>
                      {/* 폼명 + 그룹 */}
                      <div className={s.respFormBadgeRow}>
                        {form?.group_tag && (
                          <span className={s.respGroupTag}>{form.group_tag}</span>
                        )}
                        <span className={s.respFormName}
                          style={{background: `linear-gradient(135deg,${form?.theme_c1||'#7c6cfc'},${form?.theme_c2||'#c084fc'})`}}>
                          {form?.title?.slice(0, 16)}{form?.title?.length > 16 ? '…' : ''}
                        </span>
                      </div>
                      {getFirstAnswers(r).map(([k, v]) => (
                        <div key={k} className={s.respRow}>
                          <span className={s.respKey}>{k}</span>
                          <span className={s.respVal}>{formatVal(String(v)).slice(0, 60)}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </>)}

          </aside>
        )}
      </div>

      {/* ── 잠금 해제 모달 */}
      {showPwModal && (
        <div className={s.modalBg} onClick={() => setShowPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🔒</div>
            <h3>관리자 잠금 해제</h3>
            <p>비밀번호를 입력하면 응답을 확인할 수 있습니다.<br/><span style={{fontSize:11,opacity:.6}}>(기본: 0000)</span></p>
            <input type="password" className={s.pwInp} value={inputPw} onChange={e => { setInputPw(e.target.value); setPwError('') }}
              placeholder="비밀번호" autoFocus
              onKeyDown={e => e.key === 'Enter' && submitPassword(runAfterUnlock)} />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhostModal} onClick={() => setShowPwModal(false)}>취소</button>
              <button className={s.btnPrimaryModal} onClick={() => submitPassword(runAfterUnlock)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 암호 변경 모달 */}
      {showSetPwModal && (
        <div className={s.modalBg} onClick={() => setShowSetPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>⚙️</div>
            <h3>관리자 암호 변경</h3>
            <p>기존 암호와 새 암호를 입력하세요.</p>
            <input type="password" className={s.pwInp} value={oldPw} onChange={e => { setOldPw(e.target.value); setPwError('') }} placeholder="기존 암호" autoFocus style={{marginBottom:'8px'}} />
            <input type="password" className={s.pwInp} value={newPw} onChange={e => { setNewPw(e.target.value); setPwError('') }} placeholder="새 암호 (4자리 이상)" onKeyDown={e => e.key === 'Enter' && saveNewPassword()} />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhostModal} onClick={() => setShowSetPwModal(false)}>취소</button>
              <button className={s.btnPrimaryModal} onClick={saveNewPassword}>변경하기</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
