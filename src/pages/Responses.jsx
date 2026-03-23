import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getForm, getResponses } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import s from './Responses.module.css'

export default function Responses() {
  const { formId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [viewMode, setViewMode] = useState('card') // card | table
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all | today | week | month | custom
  const [customDate, setCustomDate] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // desc | asc
  const [selected, setSelected] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const prevCountRef = useRef(0)
  const pollRef = useRef(null)

  useEffect(() => {
    loadData()
    checkNotifPermission()
    startPolling()
    return () => clearInterval(pollRef.current)
  }, [formId])

  async function loadData() {
    try {
      const [f, r] = await Promise.all([getForm(formId), getResponses(formId)])
      setForm(f)
      setResponses(r || [])
      prevCountRef.current = (r || []).length
    } catch { navigate('/dashboard') }
    finally { setLoading(false) }
  }

  // 실시간 폴링 (30초마다)
  function startPolling() {
    pollRef.current = setInterval(async () => {
      try {
        const r = await getResponses(formId)
        const newResponses = r || []
        const diff = newResponses.length - prevCountRef.current
        if (diff > 0) {
          setNewCount(diff)
          setResponses(newResponses)
          prevCountRef.current = newResponses.length
          if (notifEnabled || Notification.permission === 'granted') {
            new Notification('새 응답이 도착했어요! 🎉', {
              body: `${diff}개의 새 응답이 있어요.`,
              icon: '/favicon.ico'
            })
          }
          showToast(`🎉 새 응답 ${diff}개 도착!`, 'ok')
        }
      } catch {}
    }, 30000)
  }

  function checkNotifPermission() {
    if (Notification.permission === 'granted') setNotifEnabled(true)
  }

  async function requestNotif() {
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setNotifEnabled(true)
      showToast('✅ 알림이 활성화되었습니다!', 'ok')
    } else {
      showToast('알림 권한이 거부되었습니다.', 'fail')
    }
  }

  // 필터링
  const filtered = responses
    .filter(r => {
      // 날짜 필터
      const d = new Date(r.submitted_at)
      const now = new Date()
      if (dateFilter === 'today') {
        return d.toDateString() === now.toDateString()
      } else if (dateFilter === 'week') {
        const week = new Date(now); week.setDate(now.getDate() - 7)
        return d >= week
      } else if (dateFilter === 'month') {
        const month = new Date(now); month.setMonth(now.getMonth() - 1)
        return d >= month
      } else if (dateFilter === 'custom' && customDate) {
        return d.toDateString() === new Date(customDate).toDateString()
      }
      return true
    })
    .filter(r => {
      if (!search) return true
      const vals = Object.values(r.answers || {}).join(' ').toLowerCase()
      return vals.includes(search.toLowerCase())
    })
    .sort((a, b) => sortOrder === 'desc'
      ? new Date(b.submitted_at) - new Date(a.submitted_at)
      : new Date(a.submitted_at) - new Date(b.submitted_at)
    )

  // 날짜별 그룹핑
  const grouped = filtered.reduce((acc, r) => {
    const date = new Date(r.submitted_at).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'short' })
    if (!acc[date]) acc[date] = []
    acc[date].push(r)
    return acc
  }, {})

  const allKeys = [...new Set(
    responses.flatMap(r => Object.keys(r.answers || {})).filter(k => !k.startsWith('_'))
  )]

  // 미리보기용 - 단답/이메일/전화번호 타입 질문 먼저, 동의/장문은 뒤로
  const previewKeys = [...allKeys].sort((a, b) => {
    const shortTypes = ['이름', '성함', '닉네임', '이메일', 'email', '전화', '연락처', '번호', 'phone']
    const lateTypes = ['동의', '약관', '개인정보']
    const aIsShort = shortTypes.some(k => a.toLowerCase().includes(k))
    const bIsShort = shortTypes.some(k => b.toLowerCase().includes(k))
    const aIsLate = lateTypes.some(k => a.includes(k))
    const bIsLate = lateTypes.some(k => b.includes(k))
    if (aIsShort && !bIsShort) return -1
    if (!aIsShort && bIsShort) return 1
    if (aIsLate && !bIsLate) return 1
    if (!aIsLate && bIsLate) return -1
    return 0
  })

  // CSV 다운로드
  function downloadCSV(data = filtered) {
    const headers = ['제출 시간', ...allKeys]
    const rows = data.map(r => [
      new Date(r.submitted_at).toLocaleString('ko-KR'),
      ...allKeys.map(k => r.answers?.[k] || '')
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${form?.title || '응답'}_${new Date().toLocaleDateString('ko-KR')}.csv`
    a.click()
    showToast('✅ CSV 다운로드 완료!', 'ok')
  }

  function downloadSelected() {
    const sel = filtered.filter(r => selected.has(r.id))
    if (!sel.length) return showToast('선택된 응답이 없어요.', 'fail')
    downloadCSV(sel)
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(r => r.id)))
  }

  function formatDate(d) {
    return new Date(d).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function formatDateFull(d) {
    return new Date(d).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  if (loading) return (
    <div className={s.loadWrap}><div className={s.spinner}></div></div>
  )

  return (
    <div className={s.wrap}>
      {/* 헤더 */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.backBtn} onClick={() => navigate('/dashboard')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <div>
            <div className={s.formName}>{form?.title || '응답'}</div>
            <div className={s.headerMeta}>
              <span className={s.totalBadge}>총 {responses.length}개</span>
              {filtered.length !== responses.length && (
                <span className={s.filterBadge}>필터: {filtered.length}개</span>
              )}
              {newCount > 0 && (
                <span className={s.newBadge} onClick={() => setNewCount(0)}>
                  🔴 새 응답 {newCount}개
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={s.headerRight}>
          {/* 알림 버튼 */}
          <button
            className={`${s.notifBtn} ${notifEnabled ? s.notifOn : ''}`}
            onClick={requestNotif}
            title={notifEnabled ? '알림 활성화됨' : '알림 켜기'}
          >
            {notifEnabled ? '🔔' : '🔕'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/builder/${formId}`)}>폼 편집</button>
          {selected.size > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={downloadSelected}>
              ⬇ 선택 다운로드 ({selected.size})
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV()}>⬇ 전체 CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.open(form?.sheet_url, '_blank')} disabled={!form?.sheet_url}>
            📗 시트 열기
          </button>
        </div>
      </header>

      {/* 필터 바 */}
      <div className={s.filterBar}>
        {/* 검색 */}
        <div className={s.searchWrap}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className={s.searchInp}
            placeholder="응답 내용 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className={s.searchClear} onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* 날짜 필터 */}
        <div className={s.dateFilters}>
          {[
            { key:'all', label:'전체' },
            { key:'today', label:'오늘' },
            { key:'week', label:'7일' },
            { key:'month', label:'30일' },
          ].map(f => (
            <button
              key={f.key}
              className={`${s.dateBtn} ${dateFilter === f.key ? s.dateBtnOn : ''}`}
              onClick={() => setDateFilter(f.key)}
            >{f.label}</button>
          ))}
          <input
            type="date"
            className={s.dateInput}
            value={customDate}
            onChange={e => { setCustomDate(e.target.value); setDateFilter('custom') }}
          />
        </div>

        {/* 정렬 & 뷰 토글 */}
        <div className={s.filterRight}>
          <button
            className={s.sortBtn}
            onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '최신순 ↓' : '오래된순 ↑'}
          </button>
          <div className={s.viewToggle}>
            <button className={`${s.viewBtn} ${viewMode === 'card' ? s.viewBtnOn : ''}`} onClick={() => setViewMode('card')}>카드</button>
            <button className={`${s.viewBtn} ${viewMode === 'table' ? s.viewBtnOn : ''}`} onClick={() => setViewMode('table')}>표</button>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      {responses.length === 0 ? (
        <div className={s.emptyWrap}>
          <div className={s.emptyIco}>📭</div>
          <h2>아직 응답이 없어요</h2>
          <p>폼 공유 링크를 배포해서 응답을 받아보세요!</p>
          {form?.is_published && (
            <button className="btn btn-primary" style={{ marginTop:16 }}
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`); showToast('링크 복사!','ok') }}>
              🔗 공유 링크 복사
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className={s.emptyWrap}>
          <div className={s.emptyIco}>🔍</div>
          <h2>검색 결과가 없어요</h2>
          <p>다른 검색어나 날짜 범위를 시도해보세요.</p>
        </div>
      ) : viewMode === 'card' ? (
        /* ── 카드 뷰 ── */
        <div className={s.cardContent}>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className={s.dateGroup}>
              <div className={s.dateGroupHeader}>
                <span className={s.dateGroupLabel}>{date}</span>
                <span className={s.dateGroupCount}>{items.length}개</span>
              </div>
              <div className={s.cardGrid}>
                {items.map((r, i) => (
                  <div
                    key={r.id}
                    className={`${s.respCard} ${selected.has(r.id) ? s.respCardSelected : ''} ${expandedId === r.id ? s.respCardExpanded : ''}`}
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    {/* 카드 헤더 */}
                    <div className={s.respCardHeader}>
                      <div className={s.respCardLeft}>
                        <input
                          type="checkbox"
                          className={s.checkbox}
                          checked={selected.has(r.id)}
                          onChange={() => toggleSelect(r.id)}
                          onClick={e => e.stopPropagation()}
                        />
                        <span className={s.respNum}>#{responses.length - responses.findIndex(x => x.id === r.id)}</span>
                        <span className={s.respDate}>{formatDate(r.submitted_at)}</span>
                      </div>
                      <div className={s.respCardRight}>
                        <span className={s.expandIcon}>{expandedId === r.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* 미리보기 (첫 2개 답변) */}
                    {expandedId !== r.id && (
                      <div className={s.respPreview}>
                        {previewKeys.slice(0, 2).map(k => r.answers?.[k] && (
                          <div key={k} className={s.previewItem}>
                            <span className={s.previewKey}>{k}</span>
                            <span className={s.previewVal}>{r.answers[k]}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 전체 답변 (펼쳤을 때) */}
                    {expandedId === r.id && (
                      <div className={s.respFull}>
                        <div className={s.respTime}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {formatDateFull(r.submitted_at)}
                        </div>
                        {allKeys.map(k => (
                          <div key={k} className={s.answerRow}>
                            <div className={s.answerQ}>{k}</div>
                            <div className={s.answerA}>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── 테이블 뷰 ── */
        <div className={s.tableContent}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th className={s.thCheck}>
                    <input type="checkbox" className={s.checkbox} checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
                  </th>
                  <th className={s.thNum}>#</th>
                  <th className={s.thDate}>제출 시간</th>
                  {allKeys.map(k => <th key={k} className={s.th}>{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={`${s.tr} ${selected.has(r.id) ? s.trSelected : ''}`} onClick={() => toggleSelect(r.id)}>
                    <td className={s.tdCheck}>
                      <input type="checkbox" className={s.checkbox} checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} onClick={e => e.stopPropagation()} />
                    </td>
                    <td className={s.tdNum}>{filtered.length - i}</td>
                    <td className={s.tdDate}>{formatDate(r.submitted_at)}</td>
                    {allKeys.map(k => (
                      <td key={k} className={s.td}>
                        {r.answers?.[k]
                          ? String(r.answers[k]).startsWith('data:image')
                            ? <img src={r.answers[k]} style={{maxWidth:60,maxHeight:40,borderRadius:4,objectFit:'cover'}} alt="이미지" />
                            : r.answers[k]
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
