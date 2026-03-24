import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import s from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // ── [보안 관제탑] 상태 관리 ──
  const [adminPw, setAdminPw] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  
  // 모달 상태
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    async function initDashboard() {
      try {
        setLoading(true)
        const { data: { user: currentUser }, error: authErr } = await supabase.auth.getUser()
        if (authErr || !currentUser) return
        
        setAdminPw(currentUser.user_metadata?.admin_pw || null)
        fetchForms(currentUser.id)
      } catch (err) {
        console.error('대시보드 로딩 에러:', err)
      }
    }
    initDashboard()
  }, [])

  async function fetchForms(userId) {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setForms(data || [])
    } catch (err) {
      console.error('폼 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── 액션 로직 ──
  async function togglePublish(e, formId, currentStatus) {
    e.stopPropagation()
    try {
      const { error } = await supabase.from('forms').update({ is_published: !currentStatus }).eq('id', formId)
      if (error) throw error
      setForms(prev => prev.map(f => f.id === formId ? { ...f, is_published: !currentStatus } : f))
    } catch (err) { alert('상태 변경 실패') }
  }

  function copyLink(e, slug) {
    e.stopPropagation()
    if (!slug) return alert('먼저 폼을 저장해주세요.')
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`)
    alert('✅ 링크가 복사되었습니다.')
  }

  async function connectSheet(e, form) {
    e.stopPropagation()
    const url = window.prompt("구글 Apps Script URL을 입력하세요.\n(비워두면 해제됩니다)", form.settings?.scriptUrl || '')
    if (url !== null) {
      const newSettings = { ...(form.settings || {}), scriptUrl: url.trim() }
      await supabase.from('forms').update({ settings: newSettings }).eq('id', form.id)
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, settings: newSettings } : f))
    }
  }

  async function deleteForm(e, formId) {
    e.stopPropagation()
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await supabase.from('forms').delete().eq('id', formId)
      setForms(prev => prev.filter(f => f.id !== formId))
    }
  }

  // ── 보안 응답 보기 로직 ──
  function handleResultsClick(e, formId) {
    e.stopPropagation()
    if (!adminPw) {
      alert("🚨 우측 상단에서 '관리자 암호'를 먼저 설정해야 응답을 볼 수 있습니다.")
      setShowSetPwModal(true)
      return
    }
    if (isUnlocked) navigate(`/results/${formId}`)
    else {
      setTargetFormId(formId)
      setInputPw(''); setPwError(''); setShowPwModal(true)
    }
  }

  function submitPassword() {
    if (inputPw === adminPw) {
      setIsUnlocked(true); sessionStorage.setItem('admin_unlocked', 'true'); setShowPwModal(false)
      if (targetFormId) navigate(`/results/${targetFormId}`)
    } else setPwError('비밀번호가 일치하지 않습니다.')
  }

  async function saveNewPassword() {
    if (inputPw.length < 4) return setPwError('4자리 이상 입력해주세요.')
    try {
      await supabase.auth.updateUser({ data: { admin_pw: inputPw } })
      setAdminPw(inputPw); setIsUnlocked(true); sessionStorage.setItem('admin_unlocked', 'true'); setShowSetPwModal(false)
      alert('🔒 암호가 설정되었습니다.')
    } catch (err) { setPwError('오류가 발생했습니다.') }
  }

  const filteredForms = forms.filter(f => f.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={s.wrap}>
      {/* ── 헤더 (사진 원본 복구) ── */}
      <div className={s.header}>
        <div className={s.logo}>
          <span className={s.mark}>✦</span> 폼 빌더
        </div>
        <div className={s.headerRight}>
          <button className={`${s.adminLockBtn} ${adminPw ? s.active : ''}`} onClick={() => { setInputPw(''); setShowSetPwModal(true) }}>
            {adminPw ? '🔒 보안 켜짐' : '⚠️ 암호 설정필요'}
          </button>
          <div className={s.userInfo}>
            <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=곰'} className={s.avatar} alt="avatar"/>
            <span className={s.userName}>{user?.user_metadata?.name || '작은곰'}</span>
          </div>
          <button className={s.iconBtn}>🌞</button>
          <button className={s.logoutBtn} onClick={() => supabase.auth.signOut()}>로그아웃</button>
        </div>
      </div>

      {/* ── 메인 영역 ── */}
      <div className={s.main}>
        <div className={s.topRow}>
          <div className={s.titleArea}>
            <h1 className={s.pageTitle}>내 폼</h1>
            <span className={s.countBadge}>{forms.length}개</span>
          </div>
          <div className={s.actionArea}>
            <div className={s.searchBox}>
              <span className={s.searchIcon}>🔍</span>
              <input type="text" className={s.searchInput} placeholder="폼 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button className={s.newBtn} onClick={() => navigate('/builder')}>+ 새 폼 만들기</button>
          </div>
        </div>

        <div className={s.grid}>
          <div className={s.newCard} onClick={() => navigate('/builder')}>
            <div className={s.newCardIco}>+</div>
            <span>새 폼 만들기</span>
          </div>

          {loading ? <div className={s.loadingWrap}><div className={s.spinner}></div></div> : null}

          {filteredForms.map((form, i) => (
            <div key={form.id} className={s.formCard}>
              <div className={`${s.cardHeader} ${s['c'+(i%3)]}`}>
                <span className={s.qBadge}>{form.questions?.length || 0}문항</span>
                {form.is_published ? <span className={`${s.statusBadge} ${s.pub}`}>🟢 공개중</span> : <span className={`${s.statusBadge} ${s.draft}`}>초안</span>}
              </div>
              
              <div className={s.cardBody}>
                <div className={s.formName}>{form.title || '제목 없는 폼'}</div>
                <div className={s.formSub}>📝 {form.settings?.startDesc?.slice(0, 15) || '설명 없음'}</div>
                <div className={s.formDate}>{new Date(form.created_at).toLocaleDateString('ko-KR', { month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'})}</div>
                
                {/* 2x2 버튼 그리드 (사진 완벽 일치) */}
                <div className={s.btnGrid}>
                  <button className={s.actionBtn} onClick={() => navigate(`/builder/${form.id}`)}>✏️ 편집</button>
                  <button className={`${s.actionBtn} ${adminPw && !isUnlocked ? s.resLocked : s.resBtn}`} onClick={(e) => handleResultsClick(e, form.id)}>
                    {adminPw && !isUnlocked ? '🔒 응답' : '📊 응답'}
                  </button>
                  
                  {form.is_published ? (
                    <button className={`${s.actionBtn} ${s.unpubBtn}`} onClick={(e) => togglePublish(e, form.id, true)}>🔒 비공개</button>
                  ) : (
                    <button className={`${s.actionBtn} ${s.pubBtn}`} onClick={(e) => togglePublish(e, form.id, false)}>🚀 발행</button>
                  )}
                  
                  <button className={s.actionBtn} onClick={(e) => copyLink(e, form.slug)}>🔗 링크 복사</button>
                </div>
                
                {/* 하단 시트 + 삭제 버튼 */}
                <div className={s.bottomRow}>
                  <button className={`${s.sheetBtn} ${!form.settings?.scriptUrl ? s.off : ''}`} onClick={(e) => connectSheet(e, form)}>
                    🟩 {form.settings?.scriptUrl ? '시트 열기 / 연결 해제' : '구글 시트 연결'}
                  </button>
                  <button className={s.delBtn} onClick={(e) => deleteForm(e, form.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 모달창들 ── */}
      {showPwModal && (
        <div className={s.modalBg} onClick={() => setShowPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🔒</div>
            <h3>관리자 권한 확인</h3>
            <p>대표 관리자 암호를 입력하세요.</p>
            <input type="password" className={s.pwInp} value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="비밀번호 4자리" autoFocus onKeyDown={e => e.key === 'Enter' && submitPassword()} />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhost} onClick={() => setShowPwModal(false)}>취소</button>
              <button className={s.btnPrimary} onClick={submitPassword}>잠금 해제</button>
            </div>
          </div>
        </div>
      )}

      {showSetPwModal && (
        <div className={s.modalBg} onClick={() => setShowSetPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🛡️</div>
            <h3>대표 관리자 암호 설정</h3>
            <p>수집된 DB를 보호할 암호를 설정하세요.</p>
            <input type="password" className={s.pwInp} value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="새 암호 입력 (4자리 이상)" autoFocus onKeyDown={e => e.key === 'Enter' && saveNewPassword()} />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhost} onClick={() => setShowSetPwModal(false)}>취소</button>
              <button className={s.btnPrimary} onClick={saveNewPassword}>설정 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
