import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForms, deleteForm, publishForm, unpublishForm, signOut } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { createAndConnectSheet } from '../lib/googleSheets'
import s from './Dashboard.module.css'
import { useTheme } from '../lib/themeContext'

const RESULTS_PATH = '/responses' // 🚨 실제 응답 페이지 라우터 주소로 변경해주세요!

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
  const memoRef = useRef(null)
  const titleRef = useRef(null)

  // ── [핵심] 보안 관제탑 로직 ──
  // 기본 비밀번호는 무조건 '0000'이며, 처음엔 굳게 잠겨있습니다.
  const currentAdminPw = user?.user_metadata?.admin_pw || '0000'
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)

  useEffect(() => {
    if (user) {
      loadForms()
      saveGoogleToken()
    } else {
      // user가 null 확정되면 로딩 해제 (useAuth loading이 끝난 뒤 여기 도달)
      setLoading(false)
    }
  }, [user])

  async function saveGoogleToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.provider_token || !user) return
      await supabase.from('google_tokens').upsert({
        user_id: user.id,
        access_token: session.provider_token,
        refresh_token: session.provider_refresh_token || '',
        updated_at: new Date().toISOString()
      })
    } catch (e) { console.log('토큰 저장 실패:', e) }
  }

  async function loadForms() {
    try {
      // 10초 타임아웃 안전장치
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      )
      const data = await Promise.race([getForms(user.id), timeout])
      setForms(data || [])
    } catch (e) {
      if (e.message === 'timeout') {
        showToast('연결이 느립니다. 새로고침 해주세요.', 'fail')
      } else {
        showToast('폼을 불러오는 데 실패했습니다.', 'fail')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(formId, e) {
    e.stopPropagation()
    if (!confirm('이 폼을 삭제할까요?')) return
    try {
      await deleteForm(formId)
      setForms(prev => prev.filter(f => f.id !== formId))
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
    const url = `${window.location.origin}/f/${form.slug}`
    navigator.clipboard.writeText(url)
    showToast('✅ 링크 복사 완료!', 'ok')
  }

  async function handleSheetConnect(form, e) {
    e.stopPropagation()
    try {
      showToast('⏳ 구글 계정 선택 중...', 'info')
      const { sheetId, sheetUrl } = await createAndConnectSheet(form.id, form.title)
      await supabase.from('forms').update({ sheet_id: sheetId, sheet_url: sheetUrl }).eq('id', form.id)
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, sheet_id: sheetId, sheet_url: sheetUrl } : f))
      showToast('✅ 구글 시트 연결 완료!', 'ok')
      window.open(sheetUrl, '_blank')
    } catch (err) {
      if (err.message !== 'popup_closed_by_user') showToast('시트 연결 실패: ' + err.message, 'fail')
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
    return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // ── [보안] 관리자 문지기 로직 ──
  function handleAdminAction() {
    if (isUnlocked) {
      setOldPw('')
      setNewPw('')
      setShowSetPwModal(true)
    } else {
      setInputPw('')
      setShowPwModal(true)
    }
  }

  function handleResultsClick(e, formId) {
    e.stopPropagation()
    if (isUnlocked) {
      navigate(`${RESULTS_PATH}/${formId}`)
    } else {
      setTargetFormId(formId)
      setInputPw('')
      setShowPwModal(true)
    }
  }

  function submitPassword() {
    if (inputPw === currentAdminPw) {
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowPwModal(false)
      if (targetFormId) {
        navigate(`${RESULTS_PATH}/${targetFormId}`)
        setTargetFormId(null)
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.')
    }
    setInputPw('')
  }

  async function saveNewPassword() {
    if (oldPw !== currentAdminPw) {
      return alert('기존 암호가 일치하지 않습니다.')
    }
    if (newPw.length < 4) {
      return alert('새 암호는 4자리 이상 입력해주세요.')
    }
    try {
      await supabase.auth.updateUser({ data: { admin_pw: newPw } })
      alert('관리자 암호가 성공적으로 변경되었습니다.')
      setShowSetPwModal(false)
      setOldPw('')
      setNewPw('')
    } catch (err) {
      alert('암호 변경 중 오류가 발생했습니다.')
    }
  }

  const filtered = forms.filter(f =>
    f.title?.toLowerCase().includes(search.toLowerCase()) ||
    f.memo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <div className={s.headerLeft} onClick={() => navigate('/')}>
          <div className={s.logoMark}>✦</div>
          <span className={s.logoText}>폼 빌더</span>
        </div>
        <div className={s.headerRight}>
          
          {/* 👇 관리자 잠금 버튼 */}
          <button className={`${s.adminBtn} ${isUnlocked ? s.unlocked : ''}`} onClick={handleAdminAction}>
            {isUnlocked ? '🔓 암호 변경' : '🔒 잠금 해제'}
          </button>

          <div className={s.userChip}>
            {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} className={s.avatar} alt="" />}
            <span>{user?.user_metadata?.full_name || user?.email}</span>
          </div>
          <button className={s.themeToggle} onClick={toggle} title="테마 전환">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/') }}>로그아웃</button>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.topRow}>
          <div className={s.topLeft}>
            <h1 className={s.pageTitle}>내 폼</h1>
            <span className={s.formCount}>{forms.length}개</span>
          </div>
          <div className={s.topRight}>
            <div className={s.searchWrap}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.searchIco}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className={s.searchInp} value={search} onChange={e => setSearch(e.target.value)} placeholder="폼 검색..." />
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/builder')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              새 폼 만들기
            </button>
          </div>
        </div>

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
              <div key={form.id} className={s.formCard}>
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
                  {editingTitle === form.id ? (
                    <input
                      ref={titleRef}
                      className={`${s.titleEdit} inp`}
                      value={titleVal}
                      onChange={e => setTitleVal(e.target.value)}
                      onBlur={() => saveTitle(form.id)}
                      onKeyDown={e => e.key === 'Enter' && saveTitle(form.id)}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <div className={s.cardTitle} onClick={e => startTitle(form, e)} title="클릭해서 제목 수정">
                      {form.title || '제목 없음'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.editIco}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                  )}

                  {editingMemo === form.id ? (
                    <input
                      ref={memoRef}
                      className={`${s.memoEdit} inp`}
                      value={memoVal}
                      onChange={e => setMemoVal(e.target.value)}
                      placeholder="내부 메모 (나만 보여요)..."
                      onBlur={() => saveMemo(form.id)}
                      onKeyDown={e => e.key === 'Enter' && saveMemo(form.id)}
                      onClick={e => e.stopPropagation()}
                    />
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
                    <button className={`${s.actionBtn} ${s.actionBtnPrimary}`} onClick={() => navigate(`/builder/${form.id}`)}>
                      ✏️ 편집
                    </button>
                    {/* 👇 보안이 적용된 응답 보기 버튼 */}
                    <button className={`${s.actionBtn}`} onClick={e => handleResultsClick(e, form.id)}>
                      {isUnlocked ? '📊 응답 보기' : '🔒 응답 보기'}
                    </button>
                  </div>

                  <div className={s.actionRow}>
                    <button
                      className={`${s.actionBtn} ${form.is_published ? s.actionBtnWarning : s.actionBtnSuccess}`}
                      onClick={e => handlePublish(form, e)}
                      disabled={publishing[form.id]}
                    >
                      {publishing[form.id] ? '...' : form.is_published ? '🔒 비공개' : '🚀 발행'}
                    </button>
                    {form.is_published && (
                      <button className={s.actionBtn} onClick={e => copyShareLink(form, e)}>
                        🔗 링크 복사
                      </button>
                    )}
                  </div>

                  <div className={s.actionRow}>
                    {form.sheet_url ? (
                      <>
                        <button className={`${s.actionBtn} ${s.actionBtnSheet}`} onClick={e => { e.stopPropagation(); window.open(form.sheet_url, '_blank') }}>
                          📗 시트 열기
                        </button>
                        <button className={`${s.actionBtn} ${s.actionBtnMuted}`} onClick={e => handleSheetDisconnect(form.id, e)}>
                          연결 해제
                        </button>
                      </>
                    ) : (
                      <button className={`${s.actionBtn} ${s.actionBtnSheet}`} onClick={e => handleSheetConnect(form, e)} style={{ flex: 1 }}>
                        📗 구글 시트 연결
                      </button>
                    )}
                    <button className={`${s.actionBtn} ${s.actionBtnDanger}`} onClick={e => handleDelete(form.id, e)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── 1. 잠금 해제 묻는 모달 ── */}
      {showPwModal && (
        <div className={s.modalBg} onClick={() => setShowPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🔒</div>
            <h3>관리자 잠금 해제</h3>
            <p>비밀번호를 입력하세요. (기본: 0000)</p>
            <input type="password" className={s.pwInp} value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="비밀번호" autoFocus onKeyDown={e => e.key === 'Enter' && submitPassword()} />
            <div className={s.mFoot}>
              <button className={s.btnGhostModal} onClick={() => setShowPwModal(false)}>취소</button>
              <button className={s.btnPrimaryModal} onClick={submitPassword}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. 암호 변경 모달 ── */}
      {showSetPwModal && (
        <div className={s.modalBg} onClick={() => setShowSetPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>⚙️</div>
            <h3>관리자 암호 변경</h3>
            <p>기존 암호와 새 암호를 입력하세요.</p>
            <input type="password" className={s.pwInp} value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="기존 암호" autoFocus style={{marginBottom: '8px'}} />
            <input type="password" className={s.pwInp} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 암호 (4자리 이상)" onKeyDown={e => e.key === 'Enter' && saveNewPassword()} />
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
