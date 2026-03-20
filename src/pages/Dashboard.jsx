import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForms, deleteForm, publishForm, unpublishForm, signOut, connectGoogleSheet, disconnectSheet } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { createAndConnectSheet } from '../lib/googleSheets'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [publishing, setPublishing] = useState({})

  useEffect(() => {
    loadForms()
    // 구글 토큰 저장 (시트 연동용)
    saveGoogleToken()
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
    } catch (e) {
      console.log('토큰 저장 실패:', e)
    }
  }

  async function loadForms() {
    try {
      const data = await getForms(user.id)
      setForms(data || [])
    } catch { showToast('폼을 불러오는 데 실패했습니다.', 'fail') }
    finally { setLoading(false) }
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
        showToast('폼이 비공개로 변경되었습니다.', 'ok')
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
      // Supabase에 sheet_id, sheet_url 저장
      const { supabase: sb } = await import('../lib/supabase')
      await supabase.from('forms').update({ sheet_id: sheetId, sheet_url: sheetUrl }).eq('id', form.id)
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, sheet_id: sheetId, sheet_url: sheetUrl } : f))
      showToast('✅ 구글 시트 연결 완료!', 'ok')
      window.open(sheetUrl, '_blank')
    } catch (err) {
      if (err.message !== 'popup_closed_by_user') {
        showToast('시트 연결 실패: ' + err.message, 'fail')
      }
    }
  }

  async function handleSheetDisconnect(form, e) {
    e.stopPropagation()
    if (!confirm('시트 연결을 해제할까요?')) return
    await disconnectSheet(form.id)
    setForms(prev => prev.map(f => f.id === form.id ? { ...f, sheet_url: null, sheet_id: null } : f))
    showToast('시트 연결이 해제되었습니다.', 'ok')
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerLeft} onClick={() => navigate('/')} style={{ cursor:'pointer' }}>
          <div className={styles.mark}>✦</div>
          <span className={styles.logoText}>폼 빌더</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="" className={styles.avatar} />}
            <span className={styles.userName}>{user?.user_metadata?.full_name || user?.email}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/') }}>로그아웃</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.topRow}>
          <div>
            <h1 className={styles.pageTitle}>내 폼</h1>
            <p className={styles.pageSub}>총 {forms.length}개의 폼</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/builder')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            새 폼 만들기
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingWrap}><div className={styles.spinner}></div><span>불러오는 중...</span></div>
        ) : forms.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIco}>✦</div>
            <h2>아직 만든 폼이 없어요</h2>
            <p>새 폼을 만들어보세요!</p>
            <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => navigate('/builder')}>첫 번째 폼 만들기</button>
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.newCard} onClick={() => navigate('/builder')}>
              <div className={styles.newCardIco}>+</div>
              <span>새 폼 만들기</span>
            </div>
            {forms.map(form => (
              <div key={form.id} className={styles.formCard} onClick={() => navigate(`/builder/${form.id}`)}>
                <div className={styles.formCardTop} style={{ background:`linear-gradient(135deg,${form.theme_c1},${form.theme_c2})` }}>
                  <div className={styles.formCardTopOverlay}>
                    <span className={styles.qCount}>{form.questions?.length || 0}개 질문</span>
                    {form.is_published && <span className={styles.pubBadge}>● 공개중</span>}
                  </div>
                </div>
                <div className={styles.formCardBody}>
                  <h3 className={styles.formTitle}>{form.title || '제목 없음'}</h3>
                  <span className={styles.formDate}>{formatDate(form.updated_at)}</span>
                </div>
                <div className={styles.formCardActions}>
                  {/* 응답 보기 */}
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/responses/${form.id}`) }}>
                    📊 응답
                  </button>
                  {/* 공유 링크 복사 */}
                  {form.is_published && (
                    <button className="btn btn-ghost btn-sm" onClick={e => copyShareLink(form, e)}>
                      🔗 링크
                    </button>
                  )}
                  {/* 발행 / 비공개 */}
                  <button
                    className={`btn btn-sm ${form.is_published ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={e => handlePublish(form, e)}
                    disabled={publishing[form.id]}
                  >
                    {publishing[form.id] ? '...' : form.is_published ? '비공개' : '🚀 발행'}
                  </button>
                  {/* 구글 시트 연결 */}
                  {form.sheet_url
                    ? <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); window.open(form.sheet_url, '_blank') }}>📊 시트</button>
                    : <button className="btn btn-ghost btn-sm" onClick={e => handleSheetConnect(form, e)}>🔗 시트 연결</button>
                  }
                  {/* 삭제 */}
                  <button className="btn btn-sm" style={{ background:'rgba(248,113,113,.1)', color:'#f87171', border:'1px solid rgba(248,113,113,.2)' }} onClick={e => handleDelete(form.id, e)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
