import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getForm, getResponses } from '../lib/supabase'
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

      const { data: otherResp } = await supabase
        .from('responses').select('id, form_id, answers, submitted_at')
        .in('form_id', otherFormIds)

      // 다른 폼에서 전화번호 수집
      const map = {}
      ;(otherResp||[]).forEach(r => {
        Object.values(r.answers||{}).forEach(v => {
          if (!looksLikePhone(v)) return
          const n = normalizePhone(v)
          if (!map[n]) map[n] = []
          map[n].push({ formId: r.form_id, formTitle: formTitleMap[r.form_id]||'다른 폼', responseId: r.id, date: r.submitted_at })
        })
      })
      setCrossDupeMap(map)
    } catch {}
  }

  // 이 응답이 다른 폼에서도 신청했는지 — crossDupeMap을 인자로 직접 받아서 클로저 문제 방지
  const dupePhoneSet = useMemo(() => new Set(Object.keys(crossDupeMap)), [crossDupeMap])

  function isDupe(r) {
    return Object.values(r.answers||{}).some(v =>
      looksLikePhone(v) && dupePhoneSet.has(normalizePhone(v))
    )
  }

  function getDupeInfo(r) {
    const results = []
    Object.values(r.answers||{}).forEach(v => {
      if (!looksLikePhone(v)) return
      const n = normalizePhone(v)
      const others = crossDupeMap[n]
      if (others?.length) {
        const formNames = [...new Set(others.map(o => o.formTitle))].slice(0,3).join(', ')
        results.push({ phone: String(v), formNames, count: others.length })
      }
    })
    return results
  }

  const dupeCount = useMemo(() => responses.filter(r =>
    Object.values(r.answers||{}).some(v => looksLikePhone(v) && dupePhoneSet.has(normalizePhone(v)))
  ).length, [dupePhoneSet, responses])

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
    const headers=['제출 시간',...allKeys]
    const rows=data.map(r=>[new Date(r.submitted_at).toLocaleString('ko-KR'),...allKeys.map(k=>r.answers?.[k]||'')])
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
    const info = getDupeInfo(r)
    if (!info.length) return
    const content = info.map(i => `📵 ${i.phone}\n→ 다른 폼에서도 신청: ${i.formNames}`).join('\n')
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
                  const dupeInfo = dupe ? getDupeInfo(r) : []
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
                          {dupe && (
                            <span className={s.dupeTagCard}
                              onMouseEnter={e=>{e.stopPropagation();showDupeTooltip(e,r)}}
                              onMouseLeave={()=>setTooltip(null)}
                              onClick={e=>e.stopPropagation()}>
                              📵 중복
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
                              <span className={s.previewVal}>{r.answers[k]}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {expandedId===r.id && (
                        <div className={s.respFull}>
                          {dupe && (
                            <div className={s.dupeWarningBox}>
                              📵 다른 폼에서도 신청 이력 있음
                              {dupeInfo.map(i=>(
                                <span key={i.phone} className={s.dupeWarningPhone}>{i.phone} → {i.formNames}</span>
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
                              <div className={`${s.answerA} ${looksLikePhone(r.answers?.[k])&&dupePhoneMap[normalizePhone(r.answers?.[k])]?s.answerADupe:''}`}>
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
                  const dupeInfo = dupe ? getDupeInfo(r) : []
                  return (
                    <tr key={r.id} className={`${s.tr} ${selected.has(r.id)?s.trSelected:''} ${dupe?s.trDupe:''}`}
                      onClick={()=>toggleSelect(r.id)}>
                      <td className={s.tdCheck}><input type="checkbox" className={s.checkbox} checked={selected.has(r.id)} onChange={()=>toggleSelect(r.id)} onClick={e=>e.stopPropagation()}/></td>
                      <td className={s.tdNum}>{filtered.length-i}</td>
                      <td className={s.tdDate}>{formatDate(r.submitted_at)}</td>
                      <td className={s.tdDupe}>
                        {dupe && (
                          <span className={s.dupeTagTable}
                            onMouseEnter={e=>{e.stopPropagation(); showDupeTooltip(e,r)}}
                            onMouseLeave={()=>setTooltip(null)}
                            onClick={e=>e.stopPropagation()}>
                            📵
                          </span>
                        )}
                      </td>
                      {allKeys.map(k=>(
                        <td key={k} className={`${s.td} ${looksLikePhone(r.answers?.[k])&&dupePhoneMap[normalizePhone(r.answers?.[k])]?s.tdDupeCell:''}`}>
                          {r.answers?.[k]
                            ? String(r.answers[k]).startsWith('data:image')
                              ? <img src={r.answers[k]} style={{maxWidth:60,maxHeight:40,borderRadius:4,objectFit:'cover'}} alt="이미지"/>
                              : r.answers[k]
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
