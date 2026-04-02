import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import s from './Duplicates.module.css'

// 전화번호 정규화 — 하이픈/공백 제거 후 비교
function normalizePhone(v) {
  return String(v || '').replace(/[-\s()]/g, '').trim()
}

// 값이 전화번호처럼 생겼는지 판별
function looksLikePhone(v) {
  const n = normalizePhone(v)
  return /^0\d{8,10}$/.test(n)
}

export default function Duplicates() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState([])
  const [dupeGroups, setDupeGroups] = useState([]) // [{phone, normalized, entries:[{formId,formTitle,answerId,answers,date}]}]
  const [search, setSearch] = useState('')
  const [expandedPhone, setExpandedPhone] = useState(null)
  const [sortBy, setSortBy] = useState('count') // 'count' | 'date'

  useEffect(() => {
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    try {
      // 1. 내 폼 목록
      const { data: formList } = await supabase
        .from('forms')
        .select('id, title, theme_c1, theme_c2')
        .eq('user_id', user.id)

      setForms(formList || [])
      const formMap = Object.fromEntries((formList || []).map(f => [f.id, f]))

      // 2. 전체 응답 가져오기
      const { data: allResp } = await supabase
        .from('responses')
        .select('id, form_id, answers, submitted_at')
        .in('form_id', (formList || []).map(f => f.id))
        .order('submitted_at', { ascending: false })

      // 3. 전화번호 추출 및 그룹화
      const phoneMap = {} // normalizedPhone → entries[]
      ;(allResp || []).forEach(r => {
        Object.entries(r.answers || {}).forEach(([k, v]) => {
          if (!looksLikePhone(v)) return
          const norm = normalizePhone(v)
          if (!phoneMap[norm]) phoneMap[norm] = { phone: String(v), normalized: norm, entries: [] }
          phoneMap[norm].entries.push({
            responseId: r.id,
            formId: r.form_id,
            formTitle: formMap[r.form_id]?.title || '알 수 없는 폼',
            formColor1: formMap[r.form_id]?.theme_c1 || '#7c6cfc',
            formColor2: formMap[r.form_id]?.theme_c2 || '#c084fc',
            answers: r.answers,
            date: r.submitted_at,
            questionKey: k,
          })
        })
      })

      // 4. 중복(2개 이상)만 필터
      const dupes = Object.values(phoneMap)
        .filter(g => g.entries.length >= 2)
        .sort((a, b) => sortBy === 'count'
          ? b.entries.length - a.entries.length
          : new Date(b.entries[0].date) - new Date(a.entries[0].date)
        )

      setDupeGroups(dupes)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // 첫 번째 답변 몇 개 추출 (전화번호 제외)
  function getOtherAnswers(answers, phoneKey) {
    return Object.entries(answers || {})
      .filter(([k]) => k !== phoneKey && !k.startsWith('_') && !k.startsWith('Q'))
      .slice(0, 3)
  }

  const filtered = dupeGroups.filter(g =>
    g.phone.includes(search) ||
    g.entries.some(e => e.formTitle.includes(search))
  )

  return (
    <div className={s.wrap}>
      {/* 헤더 */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.backBtn} onClick={() => navigate('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <div>
            <div className={s.headerTitle}>📵 중복 신청자</div>
            <div className={s.headerSub}>전체 폼 기준 · 전화번호로 중복 탐지</div>
          </div>
        </div>
        <div className={s.headerRight}>
          {!loading && (
            <div className={s.statChips}>
              <span className={s.statChip}>
                중복 번호 <strong>{dupeGroups.length}</strong>개
              </span>
              <span className={s.statChip}>
                중복 응답 <strong>{dupeGroups.reduce((acc, g) => acc + g.entries.length, 0)}</strong>건
              </span>
            </div>
          )}
          <button className={s.refreshBtn} onClick={load}>🔄 새로고침</button>
        </div>
      </header>

      {/* 필터 바 */}
      <div className={s.filterBar}>
        <div className={s.searchWrap}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className={s.searchInp} value={search} onChange={e => setSearch(e.target.value)} placeholder="전화번호 또는 폼 이름 검색..." />
          {search && <button className={s.searchClear} onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className={s.sortBtns}>
          <button className={`${s.sortBtn} ${sortBy === 'count' ? s.sortBtnOn : ''}`} onClick={() => { setSortBy('count'); setDupeGroups(prev => [...prev].sort((a,b) => b.entries.length - a.entries.length)) }}>중복 많은 순</button>
          <button className={`${s.sortBtn} ${sortBy === 'date' ? s.sortBtnOn : ''}`} onClick={() => { setSortBy('date'); setDupeGroups(prev => [...prev].sort((a,b) => new Date(b.entries[0].date) - new Date(a.entries[0].date))) }}>최근 신청 순</button>
        </div>
      </div>

      {/* 본문 */}
      <div className={s.content}>
        {loading ? (
          <div className={s.loadWrap}><div className={s.spinner}></div><span>전체 응답 분석 중...</span></div>
        ) : dupeGroups.length === 0 ? (
          <div className={s.emptyWrap}>
            <div className={s.emptyIco}>✅</div>
            <h2>중복 신청자 없음</h2>
            <p>같은 전화번호로 여러 폼에 신청한 사람이 없습니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={s.emptyWrap}>
            <div className={s.emptyIco}>🔍</div>
            <h2>검색 결과 없음</h2>
            <p>"{search}" 에 해당하는 중복 신청자가 없습니다.</p>
          </div>
        ) : (
          <div className={s.list}>
            {filtered.map(group => (
              <div key={group.normalized} className={`${s.dupeCard} ${expandedPhone === group.normalized ? s.dupeCardOpen : ''}`}>
                {/* 헤더 행 */}
                <div className={s.dupeHead} onClick={() => setExpandedPhone(prev => prev === group.normalized ? null : group.normalized)}>
                  <div className={s.dupeHeadLeft}>
                    <span className={s.dupeBadge}>{group.entries.length}회 신청</span>
                    <span className={s.dupePhone}>{group.phone}</span>
                    <div className={s.dupeFormPills}>
                      {[...new Set(group.entries.map(e => e.formId))].slice(0, 4).map(fid => {
                        const entry = group.entries.find(e => e.formId === fid)
                        return (
                          <span key={fid} className={s.dupeFormPill} style={{ background: `linear-gradient(135deg,${entry.formColor1},${entry.formColor2})` }}>
                            {entry.formTitle.slice(0, 12)}{entry.formTitle.length > 12 ? '...' : ''}
                          </span>
                        )
                      })}
                      {[...new Set(group.entries.map(e => e.formId))].length > 4 && (
                        <span className={s.dupeFormPillMore}>+{[...new Set(group.entries.map(e => e.formId))].length - 4}</span>
                      )}
                    </div>
                  </div>
                  <div className={s.dupeHeadRight}>
                    <span className={s.dupeLatest}>최근: {formatDate(group.entries[0].date)}</span>
                    <svg className={`${s.chevron} ${expandedPhone === group.normalized ? s.chevronOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* 펼쳤을 때 상세 */}
                {expandedPhone === group.normalized && (
                  <div className={s.dupeDetail}>
                    {group.entries.map((entry, i) => (
                      <div key={entry.responseId} className={s.dupeEntry}>
                        <div className={s.dupeEntryHead}>
                          <div className={s.dupeEntryFormBadge} style={{ background: `linear-gradient(135deg,${entry.formColor1},${entry.formColor2})` }}>
                            {entry.formTitle.slice(0, 20)}{entry.formTitle.length > 20 ? '...' : ''}
                          </div>
                          <span className={s.dupeEntryDate}>{formatDate(entry.date)}</span>
                          <button className={s.dupeEntryGo} onClick={() => navigate(`/responses/${entry.formId}`)}>응답 보기 →</button>
                        </div>
                        <div className={s.dupeEntryAnswers}>
                          <div className={s.dupeEntryRow}>
                            <span className={s.dupeEntryKey}>{entry.questionKey}</span>
                            <span className={s.dupeEntryVal}>{entry.phone}</span>
                          </div>
                          {getOtherAnswers(entry.answers, entry.questionKey).map(([k, v]) => (
                            <div key={k} className={s.dupeEntryRow}>
                              <span className={s.dupeEntryKey}>{k}</span>
                              <span className={s.dupeEntryVal}>{String(v).slice(0, 50)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
