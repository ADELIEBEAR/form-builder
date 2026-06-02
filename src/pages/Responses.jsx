import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getForm, getResponses, getResponsesForForms } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import s from './Responses.module.css'

// 전화번호 정규화 — 하이픈/공백 제거
function normalizePhone(v) { return String(v||'').replace(/[-\s()]/g,'').trim() }
// 한국 전화번호 패턴만 인식 (010/011/016/017/018/019 + 7~8자리)
function looksLikePhone(v) {
  const n = normalizePhone(v)
  return /^01[0-9]\d{7,8}$/.test(n)
}
// 전화번호 포맷 — 010-1234-5678
function formatPhone(v) {
  const n = normalizePhone(v)
  if (/^01[0-9]\d{7,8}$/.test(n)) {
    if (n.length === 10) return n.slice(0,3)+'-'+n.slice(3,6)+'-'+n.slice(6)
    if (n.length === 11) return n.slice(0,3)+'-'+n.slice(3,7)+'-'+n.slice(7)
  }
  return v
}
function formatVal(v) {
  const s = String(v)
  return looksLikePhone(s) ? formatPhone(s) : s
}
function getPhonesFromAnswers(answers) {
  const phones = new Set()
  Object.values(answers || {}).forEach(v => { if (looksLikePhone(v)) phones.add(normalizePhone(v)) })
  return [...phones]
}

export default function Responses() {
  const { formId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [viewMode, setViewMode] = useState('card')
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [customDate, setCustomDate] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selected, setSelected] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [showDupesOnly, setShowDupesOnly] = useState(false)
  const [tooltip, setTooltip] = useState(null) // {x,y,content}
  const prevCountRef = useRef(0)
  const pollRef = useRef(null)

  useEffect(() => {
    loadData(); checkNotifPermission(); startPolling()
    return () => clearInterval(pollRef.current)
  }, [formId])

  async function loadData() {
    try {
      const [f, r] = await Promise.all([getForm(formId), getResponses(formId)])
      setForm(f); setResponses(r || []); prevCountRef.current = (r||[]).length
    } catch { navigate('/dashboard') }
    finally { setLoading(false) }
  }

  function startPolling() {
    pollRef.current = setInterval(async () => {
      try {
        const r = await getResponses(formId)
        const diff = (r||[]).length - prevCountRef.current
        if (diff > 0) {
          setNewCount(diff); setResponses(r||[]); prevCountRef.current = (r||[]).length
          if (Notification.permission === 'granted') new Notification('새 응답이 도착했어요! 🎉', { body:`${diff}개의 새 응답이 있어요.` })
          showToast(`🎉 새 응답 ${diff}개 도착!`, 'ok')
        }
      } catch {}
    }, 30000)
  }

  function checkNotifPermission() { if (Notification.permission==='granted') setNotifEnabled(true) }
  async function requestNotif() {
    const p = await Notification.requestPermission()
    if (p==='granted') { setNotifEnabled(true); showToast('✅ 알림이 활성화되었습니다!','ok') }
    else showToast('알림 권한이 거부되었습니다.','fail')
  }

  // ── 전체 폼 기준 중복 전화번호 맵
  // { normalizedPhone → [{formId, formTitle, responseId, date}] }
  const [crossDupeMap, setCrossDupeMap] = useState({})

  useEffect(() => {
    if (!user || !form) return
    loadCrossDupes()
  }, [form])

  async function loadCrossDupes() {
    try {
      // 내 폼 목록
      const { data: formList } = await supabase
        .from('forms').select('id, title').eq('user_id', user.id)
      if (!formList?.length) return

      // 현재 폼 제외한 다른 폼들 응답
      const otherFormIds = formList.filter(f => f.id !== formId).map(f => f.id)
      if (!otherFormIds.length) return

      const formTitleMap = Object.fromEntries(formList.map(f => [f.id, f.title]))

      const otherResp = await getResponsesForForms(otherFormIds, 'id, form_id, answers, submitted_at')

      // 다른 폼에서 전화번호 수집
      const map = {}
      ;(otherResp||[]).forEach(r => {
        getPhonesFromAnswers(r.answers).forEach(n => {
          if (!map[n]) map[n] = []
          map[n].push({ formId: r.form_id, formTitle: formTitleMap[r.form_id]||'다른 폼', responseId: r.id, date: r.submitted_at })
        })
      })
      setCrossDupeMap(map)
    } catch {}
  }

  // 같은 폼 안에서는 번호별 첫 신청은 정상, 2번째부터 중복 후보
  const sameFormPhoneMap = useMemo(() => {
    const map = {}
    const sorted = [...responses].sort((a,b) => new Date(a.submitted_at) - new Date(b.submitted_at))
    sorted.forEach(r => {
      getPhonesFromAnswers(r.answers).forEach(phone => {
        if (!map[phone]) map[phone] = []
        map[phone].push({ responseId: r.id, date: r.submitted_at })
      })
    })
    return map
  }, [responses])

  const localDupeInfoById = useMemo(() => {
    const result = {}
    Object.entries(sameFormPhoneMap).forEach(([phone, entries]) => {
      entries.forEach((entry, idx) => {
        if (!result[entry.responseId]) result[entry.responseId] = []
        result[entry.responseId].push({
          phone,
          displayPhone: formatPhone(phone),
          order: idx + 1,
          total: entries.length,
          isDuplicate: idx > 0,
        })
      })
    })
    return result
  }, [sameFormPhoneMap])

  const dupePhoneSet = useMemo(() => new Set(Object.keys(crossDupeMap)), [crossDupeMap])

  function getLocalApplyInfo(r) {
    const infos = localDupeInfoById[r.id] || []
    return infos.find(i => i.total > 1) || null
  }
  function hasSameFormDuplicate(r) { return (localDupeInfoById[r.id] || []).some(i => i.isDuplicate) }

  // 다른 폼 중복도 번호 기준 첫 신청은 정상, 이후 신청부터만 중복으로 표시
  function getEarlierCrossEntries(r, phone) {
    const currentTime = new Date(r.submitted_at).getTime()
    return (crossDupeMap[phone] || []).filter(o => new Date(o.date).getTime() < currentTime)
  }

  function hasCrossFormDuplicate(r) {
    return getPhonesFromAnswers(r.answers).some(n => getEarlierCrossEntries(r, n).length > 0)
  }
  function isDupe(r) { return hasSameFormDuplicate(r) || hasCrossFormDuplicate(r) }

  function getDupeInfo(r) {
    const results = []
    ;(localDupeInfoById[r.id] || []).forEach(i => {
      if (i.total <= 1 || !i.isDuplicate) return
      results.push({ type: 'same', phone: i.displayPhone, order: i.order, total: i.total, isDuplicate: i.isDuplicate })
    })
    getPhonesFromAnswers(r.answers).forEach(n => {
      const earlier = getEarlierCrossEntries(r, n)
      if (earlier.length) {
        const formNames = [...new Set(earlier.map(o => o.formTitle))].slice(0,3).join(', ')
        results.push({ type: 'cross', phone: formatPhone(n), formNames, count: earlier.length })
      }
    })
    return results
  }

  const dupeCount = useMemo(() => responses.filter(isDupe).length, [responses, localDupeInfoById, crossDupeMap])

  // 필터링
  const filtered = responses
    .filter(r => {
      const d = new Date(r.submitted_at); const now = new Date()
      if (dateFilter==='today') return d.toDateString()===now.toDateString()
      if (dateFilter==='week') { const w=new Date(now); w.setDate(now.getDate()-7); return d>=w }
      if (dateFilter==='month') { const m=new Date(now); m.setMonth(now.getMonth()-1); return d>=m }
      if (dateFilter==='custom' && customDate) return d.toDateString()===new Date(customDate).toDateString()
      return true
    })
    .filter(r => {
      if (!search) return true
      return Object.values(r.answers||{}).join(' ').toLowerCase().includes(search.toLowerCase())
    })
    .filter(r => showDupesOnly ? isDupe(r) : true)
    .sort((a,b) => sortOrder==='desc'
      ? new Date(b.submitted_at)-new Date(a.submitted_at)
      : new Date(a.submitted_at)-new Date(b.submitted_at)
    )

  const grouped = filtered.reduce((acc,r) => {
    const date = new Date(r.submitted_at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'short'})
    if (!acc[date]) acc[date]=[]
    acc[date].push(r); return acc
  }, {})

  const allKeys = [...new Set(responses.flatMap(r=>Object.keys(r.answers||{})).filter(k=>!k.startsWith('_')))]
  const previewKeys = [...allKeys].sort((a,b) => {
    const short=['이름','성함','닉네임','이메일','email','전화','연락처','번호','phone']
    const late=['동의','약관','개인정보']
    const aS=short.some(k=>a.toLowerCase().includes(k)), bS=short.some(k=>b.toLowerCase().includes(k))
    const aL=late.some(k=>a.includes(k)), bL=late.some(k=>b.includes(k))
    if(aS&&!bS) return -1; if(!aS&&bS) return 1
    if(aL&&!bL) return 1; if(!aL&&bL) return -1
    return 0
  })

  function downloadCSV(data=filtered) {
    const headers=['제출 시간','중복구분',...allKeys]
    const rows=data.map(r=>{
      const tags = getDupeInfo(r).filter(i => i.type === 'cross' || i.isDuplicate).map(i => i.type === 'same' ? `같은폼 ${i.order}번째 신청!` : `다른폼 ${i.count}건`).join(' / ')
      return [new Date(r.submitted_at).toLocaleString('ko-KR'), tags, ...allKeys.map(k=>r.answers?.[k]?formatVal(r.answers[k]):'')]
    })
    const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download=`${form?.title||'응답'}_${new Date().toLocaleDateString('ko-KR')}.csv`; a.click()
    showToast('✅ CSV 다운로드 완료!','ok')
  }

  function toggleSelect(id) { setSelected(prev=>{const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n}) }
  function toggleSelectAll() { selected.size===filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(r=>r.id))) }
  function formatDate(d) { return new Date(d).toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) }
  function formatDateFull(d) { return new Date(d).toLocaleString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit'}) }
  function showToast(msg,type) { setToast({msg,type}); setTimeout(()=>setToast(null),3500) }

  // 툴팁 핸들러
  function showDupeTooltip(e, r) {
    const info = getDupeInfo(r).filter(i => i.type === 'cross' || i.isDuplicate)
    if (!info.length) return
    const content = info.map(i => {
      if (i.type === 'same') return `📵 ${i.phone}\n→ 같은 폼 ${i.order}번째 신청! 첫 신청 이후 중복 후보`
      return `📵 ${i.phone}\n→ 다른 폼에서도 신청: ${i.formNames || '폼명 확인 필요'} (${i.count || 0}건)`
    }).join('\n')
    setTooltip({ x: e.clientX, y: e.clientY, content })
  }

  if (loading) return <div className={s.loadWrap}><div className={s.spinner}></div></div>

  return (
    <div className={s.wrap} onClick={() => setTooltip(null)}>
      {/* 헤더 */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.backBtn} onClick={() => navigate('/dashboard')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <div>
            <div className={s.formName}>{form?.title||'응답'}</div>
            <div className={s.headerMeta}>
              <span className={s.totalBadge}>총 {responses.length}개</span>
              {filtered.length!==responses.length && <span className={s.filterBadge}>필터: {filtered.length}개</span>}
              {dupeCount > 0 && (
                <span className={`${s.dupeBadgeHeader} ${showDupesOnly ? s.dupeBadgeOn : ''}`}
                  onClick={() => setShowDupesOnly(p=>!p)} title="클릭해서 중복만 보기">
                  📵 중복의심 {dupeCount}명
                </span>
              )}
              {newCount>0 && <span className={s.newBadge} onClick={()=>setNewCount(0)}>🔴 새 응답 {newCount}개</span>}
            </div>
          </div>
        </div>
        <div className={s.headerRight}>
          <button className={`${s.notifBtn} ${notifEnabled?s.notifOn:''}`} onClick={requestNotif} title={notifEnabled?'알림 활성화됨':'알림 켜기'}>
            {notifEnabled?'🔔':'🔕'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigate(`/builder/${formId}`)}>폼 편집</button>
          {selected.size>0 && <button className="btn btn-ghost btn-sm" onClick={()=>{const sel=filtered.filter(r=>selected.has(r.id));downloadCSV(sel)}}>⬇ 선택 다운로드 ({selected.size})</button>}
          <button className="btn btn-ghost btn-sm" onClick={()=>downloadCSV()}>⬇ 전체 CSV</button>
          <button className="btn btn-primary btn-sm" onClick={()=>window.open(form?.sheet_url,'_blank')} disabled={!form?.sheet_url}>📗 시트 열기</button>
        </div>
      </header>

      {/* 필터 바 */}
      <div className={s.filterBar}>
        <div className={s.searchWrap}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className={s.searchInp} placeholder="응답 내용 검색..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <button className={s.searchClear} onClick={()=>setSearch('')}>✕</button>}
        </div>
        <div className={s.dateFilters}>
          {[{key:'all',label:'전체'},{key:'today',label:'오늘'},{key:'week',label:'7일'},{key:'month',label:'30일'}].map(f=>(
            <button key={f.key} className={`${s.dateBtn} ${dateFilter===f.key?s.dateBtnOn:''}`} onClick={()=>setDateFilter(f.key)}>{f.label}</button>
          ))}
          <input type="date" className={s.dateInput} value={customDate} onChange={e=>{setCustomDate(e.target.value);setDateFilter('custom')}} />
        </div>
        <div className={s.filterRight}>
          {dupeCount > 0 && (
            <button className={`${s.dupeFilterBtn} ${showDupesOnly?s.dupeFilterBtnOn:''}`} onClick={()=>setShowDupesOnly(p=>!p)}>
              📵 중복만 보기 {showDupesOnly ? '✕' : ''}
            </button>
          )}
          <button className={s.sortBtn} onClick={()=>setSortOrder(o=>o==='desc'?'asc':'desc')}>
            {sortOrder==='desc'?'최신순 ↓':'오래된순 ↑'}
          </button>
          <div className={s.viewToggle}>
            <button className={`${s.viewBtn} ${viewMode==='card'?s.viewBtnOn:''}`} onClick={()=>setViewMode('card')}>카드</button>
            <button className={`${s.viewBtn} ${viewMode==='table'?s.viewBtnOn:''}`} onClick={()=>setViewMode('table')}>표</button>
          </div>
        </div>
      </div>

      {responses.length===0 ? (
        <div className={s.emptyWrap}>
          <div className={s.emptyIco}>📭</div>
          <h2>아직 응답이 없어요</h2>
          <p>폼 공유 링크를 배포해서 응답을 받아보세요!</p>
        </div>
      ) : filtered.length===0 ? (
        <div className={s.emptyWrap}><div className={s.emptyIco}>🔍</div><h2>검색 결과가 없어요</h2></div>
      ) : viewMode==='card' ? (
        <div className={s.cardContent}>
          {Object.entries(grouped).map(([date,items])=>(
            <div key={date} className={s.dateGroup}>
              <div className={s.dateGroupHeader}>
                <span className={s.dateGroupLabel}>{date}</span>
                <span className={s.dateGroupCount}>{items.length}개</span>
              </div>
              <div className={s.cardGrid}>
                {items.map(r => {
                  const dupe = isDupe(r)
                  const dupeInfo = getDupeInfo(r)
                  const localApply = getLocalApplyInfo(r)
                  const sameFormSecondOrMore = localApply?.order > 1
                  const crossDuplicate = hasCrossFormDuplicate(r)
                  return (
                    <div key={r.id}
                      className={`${s.respCard} ${selected.has(r.id)?s.respCardSelected:''} ${expandedId===r.id?s.respCardExpanded:''} ${dupe?s.respCardDupe:''}`}
                      onClick={()=>setExpandedId(expandedId===r.id?null:r.id)}
                    >
                      <div className={s.respCardHeader}>
                        <div className={s.respCardLeft}>
                          <input type="checkbox" className={s.checkbox} checked={selected.has(r.id)}
                            onChange={()=>toggleSelect(r.id)} onClick={e=>e.stopPropagation()} />
                          <span className={s.respNum}>#{responses.length-responses.findIndex(x=>x.id===r.id)}</span>
                          <span className={s.respDate}>{formatDate(r.submitted_at)}</span>
                          {sameFormSecondOrMore && (
                            <span className={s.applyOrderTag}
                              onMouseEnter={e=>{e.stopPropagation();showDupeTooltip(e,r)}}
                              onMouseLeave={()=>setTooltip(null)}
                              onClick={e=>e.stopPropagation()}>
                              {`${localApply.order}번째 신청!`}
                            </span>
                          )}
                          {crossDuplicate && (
                            <span className={s.dupeTagCard}
                              onMouseEnter={e=>{e.stopPropagation();showDupeTooltip(e,r)}}
                              onMouseLeave={()=>setTooltip(null)}
                              onClick={e=>e.stopPropagation()}>
                              다른폼 중복
                            </span>
                          )}
                        </div>
                        <span className={s.expandIcon}>{expandedId===r.id?'▲':'▼'}</span>
                      </div>

                      {expandedId!==r.id && (
                        <div className={s.respPreview}>
                          {previewKeys.slice(0,2).map(k=>r.answers?.[k]&&(
                            <div key={k} className={s.previewItem}>
                              <span className={s.previewKey}>{k}</span>
                              <span className={s.previewVal}>{formatVal(r.answers[k])}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {expandedId===r.id && (
                        <div className={s.respFull}>
                          {dupeInfo.some(i => i.type === 'cross' || i.isDuplicate) && (
                            <div className={s.dupeWarningBox}>
                              {dupeInfo.filter(i => i.type === 'cross' || i.isDuplicate).map((i, idx)=> i.type === 'same' ? (
                                <span key={`${i.phone}-${idx}`} className={s.dupeWarningPhone}>📵 {i.phone} 같은 폼 {i.order}번째 신청! 첫 신청 이후 중복 후보입니다.</span>
                              ) : (
                                <span key={`${i.phone}-${idx}`} className={s.dupeWarningPhone}>📵 {i.phone} → 다른 폼에서도 신청: {i.formNames}</span>
                              ))}
                            </div>
                          )}
                          <div className={s.respTime}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            {formatDateFull(r.submitted_at)}
                          </div>
                          {allKeys.map(k=>(
                            <div key={k} className={s.answerRow}>
                              <div className={s.answerQ}>{k}</div>
                              <div className={`${s.answerA} ${looksLikePhone(r.answers?.[k])&&(getEarlierCrossEntries(r, normalizePhone(r.answers?.[k])).length > 0 || ((sameFormPhoneMap[normalizePhone(r.answers?.[k])] || []).findIndex(e => e.responseId === r.id) > 0))?s.answerADupe:''}`}>
                                {r.answers?.[k]
                                  ? String(r.answers[k]).startsWith('data:image')
                                    ? <img src={r.answers[k]} style={{maxWidth:120,maxHeight:80,borderRadius:6,objectFit:'cover'}} alt="이미지" />
                                    : r.answers[k]
                                  : <span style={{color:'var(--muted)'}}>-</span>
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.tableContent}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th className={s.thCheck}><input type="checkbox" className={s.checkbox} checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleSelectAll}/></th>
                  <th className={s.thNum}>#</th>
                  <th className={s.thDate}>제출 시간</th>
                  <th className={s.thDupe}>중복</th>
                  {allKeys.map(k=><th key={k} className={s.th}>{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r,i)=>{
                  const dupe = isDupe(r)
                  const localApply = getLocalApplyInfo(r)
                  const crossDuplicate = hasCrossFormDuplicate(r)
                  return (
                    <tr key={r.id} className={`${s.tr} ${selected.has(r.id)?s.trSelected:''} ${dupe?s.trDupe:''}`}
                      onClick={()=>toggleSelect(r.id)}>
                      <td className={s.tdCheck}><input type="checkbox" className={s.checkbox} checked={selected.has(r.id)} onChange={()=>toggleSelect(r.id)} onClick={e=>e.stopPropagation()}/></td>
                      <td className={s.tdNum}>{filtered.length-i}</td>
                      <td className={s.tdDate}>{formatDate(r.submitted_at)}</td>
                      <td className={s.tdDupe}>
                        {localApply?.order > 1 && (
                          <span className={s.dupeTagTable}
                            onMouseEnter={e=>{e.stopPropagation(); showDupeTooltip(e,r)}}
                            onMouseLeave={()=>setTooltip(null)}
                            onClick={e=>e.stopPropagation()}>
                            {`${localApply.order}회`}
                          </span>
                        )}
                        {crossDuplicate && (
                          <span className={s.dupeTagTable}
                            onMouseEnter={e=>{e.stopPropagation(); showDupeTooltip(e,r)}}
                            onMouseLeave={()=>setTooltip(null)}
                            onClick={e=>e.stopPropagation()}>
                            📵
                          </span>
                        )}
                      </td>
                      {allKeys.map(k=>(
                        <td key={k} className={`${s.td} ${looksLikePhone(r.answers?.[k])&&(getEarlierCrossEntries(r, normalizePhone(r.answers?.[k])).length > 0 || ((sameFormPhoneMap[normalizePhone(r.answers?.[k])] || []).findIndex(e => e.responseId === r.id) > 0))?s.tdDupeCell:''}`}>
                          {r.answers?.[k]
                            ? String(r.answers[k]).startsWith('data:image')
                              ? <img src={r.answers[k]} style={{maxWidth:60,maxHeight:40,borderRadius:4,objectFit:'cover'}} alt="이미지"/>
                              : formatVal(r.answers[k])
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 중복 툴팁 */}
      {tooltip && (
        <div className={s.dupeTooltip} style={{left: tooltip.x + 12, top: tooltip.y - 10}}
          onMouseEnter={()=>setTooltip(null)}>
          {tooltip.content.split('\n').map((line,i)=><div key={i}>{line}</div>)}
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
