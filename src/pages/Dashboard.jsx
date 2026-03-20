import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForms, deleteForm, signOut } from '../lib/supabase'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadForms()
  }, [user])

  async function loadForms() {
    try {
      const data = await getForms(user.id)
      setForms(data || [])
    } catch (e) {
      showToast('폼을 불러오는 데 실패했습니다.', 'fail')
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
    } catch {
      showToast('삭제 중 오류가 발생했습니다.', 'fail')
    }
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.wrap}>
      {/* 상단바 */}
      <header className={styles.header}>
        <div className={styles.headerLeft} onClick={() => navigate('/')} style={{ cursor:'pointer' }}>
          <div className={styles.mark}>✦</div>
          <span className={styles.logoText}>폼 빌더</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            {user?.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="" className={styles.avatar} />
            )}
            <span className={styles.userName}>{user?.user_metadata?.full_name || user?.email}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      <main className={styles.main}>
        {/* 타이틀 + 새 폼 버튼 */}
        <div className={styles.topRow}>
          <div>
            <h1 className={styles.pageTitle}>내 폼</h1>
            <p className={styles.pageSub}>총 {forms.length}개의 폼</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/builder')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            새 폼 만들기
          </button>
        </div>

        {/* 폼 목록 */}
        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner}></div>
            <span>불러오는 중...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIco}>✦</div>
            <h2>아직 만든 폼이 없어요</h2>
            <p>새 폼을 만들어 참가신청을 시작해보세요!</p>
            <button className="btn btn-primary" style={{ marginTop:'16px' }} onClick={() => navigate('/builder')}>
              첫 번째 폼 만들기
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {/* 새 폼 카드 */}
            <div className={styles.newCard} onClick={() => navigate('/builder')}>
              <div className={styles.newCardIco}>+</div>
              <span>새 폼 만들기</span>
            </div>

            {/* 기존 폼들 */}
            {forms.map(form => (
              <div
                key={form.id}
                className={styles.formCard}
                onClick={() => navigate(`/builder/${form.id}`)}
              >
                {/* 색상 프리뷰 */}
                <div
                  className={styles.formCardTop}
                  style={{ background: `linear-gradient(135deg, ${form.theme_c1}, ${form.theme_c2})` }}
                >
                  <div className={styles.formCardTopOverlay}>
                    <span className={styles.qCount}>{form.questions?.length || 0}개 질문</span>
                  </div>
                </div>

                <div className={styles.formCardBody}>
                  <h3 className={styles.formTitle}>{form.title || '제목 없음'}</h3>
                  <span className={styles.formDate}>{formatDate(form.updated_at)}</span>
                </div>

                <div className={styles.formCardActions}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form.id}`) }}
                  >편집</button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDelete(form.id, e)}
                  >삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 토스트 */}
      {toast && (
        <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  )
}
