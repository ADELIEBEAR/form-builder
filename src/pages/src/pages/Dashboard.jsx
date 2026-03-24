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
  
  // ── [보안 관제탑 로직] 대표님 전용 상태 ──
  const [adminPw, setAdminPw] = useState(user?.user_metadata?.admin_pw || null)
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    fetchForms()
  }, [])

  async function fetchForms() {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setForms(data || [])
    } catch (err) {
      console.error('폼 목록 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── [핵심] 응답 보기 클릭 시 검문소 역할 ──
  function handleResultsClick(e, formId) {
    e.stopPropagation() // 부모 요소 클릭 이벤트 방지
    
    if (!adminPw) {
      // 대표님이 아직 금고 암호를 안 걸어뒀다면 프리패스
      navigate(`/results/${formId}`)
      return
    }
    
    if (isUnlocked) {
      // 대표님이 이미 한 번 암호를 치고 들어왔다면 프리패스
      navigate(`/results/${formId}`)
    } else {
      // 암호가 걸려있고, 아직 안 풀었다면 모달창 띄우기
      setTargetFormId(formId)
      setInputPw('')
      setPwError('')
      setShowPwModal(true)
    }
  }

  // ── 검문소 암호 입력 확인 ──
  function submitPassword() {
    if (inputPw === adminPw) {
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowPwModal(false)
      if (targetFormId) navigate(`/results/${targetFormId}`)
    } else {
      setPwError('비밀번호가 일치하지 않습니다.')
    }
  }

  // ── 대표님 금고 암호 새로 설정/변경 ──
  async function saveNewPassword() {
    if (inputPw.length < 4) {
      setPwError('비밀번호는 4자리 이상 입력해주세요.')
      return
    }
    try {
      // Supabase user_metadata에 비밀번호 업데이트
      const { error } = await supabase.auth.updateUser({
        data: { admin_pw: inputPw }
      })
      if (error) throw error
      
      setAdminPw(inputPw)
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowSetPwModal(false)
      setInputPw('')
      alert('관리자 비밀번호가 안전하게 설정되었습니다.')
    } catch (err) {
      console.error(err)
      setPwError('설정 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className={s.wrap}>
      {/* ── 상단 헤더 (정프로님 원본 유지 + 보안 버튼) ── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.mark}>✦</div>
          <span className={s.logoText}>정프로 폼빌더</span>
        </div>
        <div className={s.headerRight}>
          {/* 👇 보안 관제탑 버튼 (작게 배치) */}
          <button 
            className={s.adminBtn} 
            onClick={() => {
              setInputPw('')
              setPwError('')
              setShowSetPwModal(true)
            }}
          >
            🔒 {adminPw ? '보안 활성화됨' : '관리자 암호 설정'}
          </button>
          
          <div className={s.userInfo}>
            <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+user?.email} className={s.avatar} alt="avatar"/>
            <span className={s.userName}>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* ── 메인 대시보드 영역 (정프로님 원본 유지) ── */}
      <div className={s.main}>
        <div className={s.topRow}>
          <div>
            <h1 className={s.pageTitle}>내 폼 목록</h1>
            <div className={s.pageSub}>총 {forms.length}개의 폼이 있습니다.</div>
          </div>
        </div>
        
        {loading ? (
          <div className={s.loadingWrap}>
            <div className={s.spinner}></div>
            <span>로딩 중...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIco}>✦</div>
            <h2>아직 만들어진 폼이 없네요</h2>
            <p>첫 번째 폼을 만들고 데이터를 수집해 보세요!</p>
            <button className={s.btnPrimary} style={{marginTop:'20px'}} onClick={() => navigate('/builder')}>+ 새 폼 만들기</button>
          </div>
        ) : (
          <div className={s.grid}>
            {/* 새 폼 만들기 카드 */}
            <div className={s.newCard} onClick={() => navigate('/builder')}>
              <div className={s.newCardIco}>+</div>
              <span>새 폼 만들기</span>
            </div>
            
            {/* 폼 목록 카드들 */}
            {forms.map(form => (
              <div key={form.id} className={s.formCard} onClick={() => navigate(`/builder/${form.id}`)}>
                <div className={s.formCardTop}>
                  {form.cover_url ? (
                    <img src={form.cover_url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" />
                  ) : (
                    <div style={{width:'100%',height:'100%',background:'var(--s2)'}}></div>
                  )}
                  <div className={s.formCardTopOverlay}>
                    {form.is_published ? <span className={s.pubBadge}>게시됨</span> : <span className={s.qCount}>{form.questions?.length||0}개 질문</span>}
                  </div>
                </div>
                
                <div className={s.formCardBody}>
                  <div className={s.formTitle}>{form.title || '제목 없는 폼'}</div>
                  <div className={s.formDate}>{new Date(form.created_at).toLocaleDateString()} 생성됨 • 조회 {form.views || 0}</div>
                </div>
                
                <div className={s.formCardActions}>
                  <button className={s.btnGhost} onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form.id}`); }}>편집</button>
                  {/* 👇 응답 보기 클릭 시 보안 검문소 발동 */}
                  <button className={s.btnGhost} style={{color:'var(--a1)',borderColor:'rgba(124,108,252,.3)'}} onClick={(e) => handleResultsClick(e, form.id)}>응답 보기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── [모달] 1. 응답 데이터 열람 시 비밀번호 검증 ── */}
      {showPwModal && (
        <div className={s.modalBg} onClick={() => setShowPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🔒</div>
            <h3>관리자 권한 확인</h3>
            <p>응답 데이터를 보려면 대표 관리자 암호를 입력하세요.</p>
            <input 
              type="password" 
              className={s.pwInp} 
              value={inputPw} 
              onChange={e => setInputPw(e.target.value)} 
              placeholder="비밀번호 입력"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && submitPassword()}
            />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhost} onClick={() => setShowPwModal(false)}>취소</button>
              <button className={s.btnPrimary} onClick={submitPassword}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* ── [모달] 2. 대표님 전용 비밀번호 새로 설정/변경 ── */}
      {showSetPwModal && (
        <div className={s.modalBg} onClick={() => setShowSetPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>⚙️</div>
            <h3>대표 관리자 암호 설정</h3>
            <p>직원들이 응답 데이터를 보지 못하도록 암호를 설정합니다.<br/>(비워두면 누구나 볼 수 있습니다)</p>
            <input 
              type="password" 
              className={s.pwInp} 
              value={inputPw} 
              onChange={e => setInputPw(e.target.value)} 
              placeholder="새 비밀번호 입력 (4자리 이상)"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && saveNewPassword()}
            />
            {pwError && <div className={s.err}>{pwError}</div>}
            <div className={s.mFoot}>
              <button className={s.btnGhost} onClick={() => setShowSetPwModal(false)}>취소</button>
              <button className={s.btnPrimary} onClick={saveNewPassword}>저장하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
