import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import s from './Duplicates.module.css'

function normalizePhone(v) { return String(v||'').replace(/[-\s()]/g,'').trim() }
function looksLikePhone(v) { return /^0\d{8,10}$/.test(normalizePhone(v)) }

export default function Duplicates() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dupeGroups, setDupeGroups] = useState([])
  const [stats, setStats] = useState({ totalForms: 0, totalResponses: 0, dupePhones: 0, dupeResponses: 0 })
  const [search, setSearch] = useState('')
  const [expandedPhone, setExpandedPhone] = useState(null)
  const [sortBy, setSortBy] = useState('count')

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    setLoading(true)
    try {
      const { data: formList } = await supabase
        .from('forms').select('id, title, theme_c1, theme_c2').eq('user_id', user.id)

      const formMap = Object.fromEntries((formList||[]).map(f=>[f.id,f]))

      const { data: allResp } = await supabase
        .from('responses').select('id, form_id, answers, submitted_at')
        .in('form_id', (formList||[]).map(f=>f.id))
        .order('submitted_at', { ascending: false })

      // 전화번호별 그룹핑
      const phoneMap = {}
      ;(allResp||[]).forEach(r => {
        Object.entries(r.answers||{}).forEach(([k,v]) => {
          if (!looksLikePhone(v)) return
          const norm = normalizePhone(v)
          if (!phoneMap[norm]) phoneMap[norm] = { phone: String(v), normalized: norm, entries: [] }
          phoneMap[norm].entries.push({
            responseId: r.id, formId: r.form_id,
            formTitle: formMap[r.form_id]?.title || '알 수 없는 폼',
            formColor1: formMap[r.form_id]?.theme_c1 || '#7c6cfc',
            formColor2: formMap[r.form_id]?.theme_c2 || '#c084fc',
            answers: r.answers, date: r.submitted_at, questionKey: k,
          })
        })
      })

      const dupes = Object.values(phoneMap)
        .filter(g => g.entries.length >= 2)

      sorted(dupes, 'count')

      const dupeResponseCount = dupes.reduce((a,g)=>a+g.entries.length,0)
      setStats({
        totalForms: (formList||[]).length,
        totalResponses: (allResp||[]).length,
        dupePhones: dupes.length,
        dupeResponses: dupeResponseCount,
      })
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  function sorted(data, by) {
    const arr = [...data]
    if (by==='count') arr.sort((a,b)=>b.entries.length-a.entries.length)
    else arr.sort((a,b)=>new Date(b.entries[0].date)-new Date(a.entries[0].date))
    setDupeGroups(arr)
    setSortBy(by)
  }

  function formatDate(d) { return new Date(d).toLocaleDateString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) }

  function getOtherAnswers(answers, phoneKey) {
    return Object.entries(answers||{})
      .filter(([k])=>k!==phoneKey&&!k.startsWith('_')&&!k.startsWith('Q'))
      .slice(0,3)
  }

  // 전화번호별로 폼 목록 (중복 폼 표시)
  function getFormSummary(entries) {
    const formCounts = {}
    entries.forEach(e => {
      if (!formCounts[e.formId]) formCounts[e.formId] = { ...e, count: 0 }
      formCounts[e.formId].count++
    })
    return Object.values(formCounts)
  }

  const filtered = dupeGroups.filter(g =>
    g.phone.includes(search) ||
    g.entries.some(e=>e.formTitle.includes(search))
  )

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.backBtn} onClick={()=>navigate('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <div>
            <div className={s.headerTitle}>📵 전체 중복 신청자</div>
            <div className={s.headerSub}>전체 {stats.totalForms}개 폼 · {stats.totalResponses}개 응답 분석</div>
          </div>
        </div>
        <div className={s.headerRight}>
          <button className={s.refreshBtn} onClick={load}>🔄 새로고침</button>
        </div>
      </header>

      {/* 통계 카드 */}
      {!loading && (
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <div className={s.statNum} style={{color:'var(--danger)'}}>{stats.dupePhones}</div>
            <div className={s.statLabel}>중복 전화번호</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNum} style={{color:'var(--warning)'}}>{stats.dupeResponses}</div>
            <div className={s.statLabel}>중복 응답 건수</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNum}>{stats.totalResponses}</div>
            <div className={s.statLabel}>전체 응답</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNum}>{stats.totalForms}</div>
            <div className={s.statLabel}>전체 폼</div>
          </div>
        </div>
      )}

      {/* 필터 */}
      <div className={s.filterBar}>
        <div className={s.searchWrap}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className={s.searchInp} value={search} onChange={e=>setSearch(e.target.value)} placeholder="전화번호 또는 폼 이름 검색..." />
          {search && <button className={s.searchClear} onClick={()=>setSearch('')}>✕</button>}
        </div>
        <div className={s.sortBtns}>
          <button className={`${s.sortBtn} ${sortBy==='count'?s.sortBtnOn:''}`} onClick={()=>sorted(dupeGroups,'count')}>중복 많은 순</button>
          <button className={`${s.sortBtn} ${sortBy==='date'?s.sortBtnOn:''}`} onClick={()=>sorted(dupeGroups,'date')}>최근 신청 순</button>
        </div>
      </div>

      <div className={s.content}>
        {loading ? (
          <div className={s.loadWrap}><div className={s.spinner}></div><span>전체 응답 분석 중...</span></div>
        ) : dupeGroups.length===0 ? (
          <div className={s.emptyWrap}>
            <div className={s.emptyIco}>✅</div>
            <h2>중복 신청자 없음</h2>
            <p>같은 전화번호로 여러 폼에 신청한 사람이 없습니다.</p>
          </div>
        ) : filtered.length===0 ? (
          <div className={s.emptyWrap}><div className={s.emptyIco}>🔍</div><h2>검색 결과 없음</h2></div>
        ) : (
          <div className={s.list}>
            {filtered.map(group => {
              const formSummary = getFormSummary(group.entries)
              const isOpen = expandedPhone === group.normalized
              return (
                <div key={group.normalized} className={`${s.dupeCard} ${isOpen?s.dupeCardOpen:''}`}>
                  {/* 요약 행 */}
                  <div className={s.dupeHead} onClick={()=>setExpandedPhone(isOpen?null:group.normalized)}>
                    <div className={s.dupeHeadLeft}>
                      <span className={s.dupeCntBadge}>{group.entries.length}회 신청</span>
                      <span className={s.dupePhone}>{group.phone}</span>
                    </div>

                    {/* 어느 폼에 신청했는지 pill */}
                    <div className={s.formPillRow}>
                      {formSummary.map(fs=>(
                        <span key={fs.formId} className={s.formPill}
                          style={{background:`linear-gradient(135deg,${fs.formColor1},${fs.formColor2})`}}
                          title={fs.formTitle}>
                          {fs.formTitle.slice(0,14)}{fs.formTitle.length>14?'…':''}
                          {fs.count>1&&<span className={s.formPillCount}>×{fs.count}</span>}
                        </span>
                      ))}
                    </div>

                    <div className={s.dupeHeadRight}>
                      <span className={s.dupeLatest}>최근 {formatDate(group.entries[0].date)}</span>
                      <svg className={`${s.chevron} ${isOpen?s.chevronOpen:''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>

                  {/* 상세 */}
                  {isOpen && (
                    <div className={s.dupeDetail}>
                      {group.entries.map((entry,i)=>(
                        <div key={entry.responseId} className={s.dupeEntry}>
                          <div className={s.dupeEntryHead}>
                            <div className={s.dupeEntryFormBadge}
                              style={{background:`linear-gradient(135deg,${entry.formColor1},${entry.formColor2})`}}>
                              {entry.formTitle.slice(0,22)}{entry.formTitle.length>22?'…':''}
                            </div>
                            <span className={s.dupeEntryDate}>{formatDate(entry.date)}</span>
                            <button className={s.dupeEntryGo} onClick={()=>navigate(`/responses/${entry.formId}`)}>
                              응답 보기 →
                            </button>
                          </div>
                          <div className={s.dupeEntryAnswers}>
                            <div className={s.dupeEntryRow}>
                              <span className={s.dupeEntryKey}>{entry.questionKey}</span>
                              <span className={`${s.dupeEntryVal} ${s.dupeEntryPhone}`}>{entry.phone}</span>
                            </div>
                            {getOtherAnswers(entry.answers, entry.questionKey).map(([k,v])=>(
                              <div key={k} className={s.dupeEntryRow}>
                                <span className={s.dupeEntryKey}>{k}</span>
                                <span className={s.dupeEntryVal}>{String(v).slice(0,60)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
