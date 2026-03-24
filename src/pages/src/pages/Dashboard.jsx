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
  
  // ── 보안(관리자) 관련 상태 ──
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

  // ── 비밀번호 검증 로직 ──
  function handleResultsClick(formId) {
    if (!adminPw) {
      // 대표님 비밀번호가 아직 설정 안 된 상태면 그냥 통과 (최초 1회 설정 유도 가능)
      navigate(`/results/${formId}`)
      return
    }
    
    if (isUnlocked) {
      // 이미 세션 내에서 암호를 풀었다면 프리패스
      navigate(`/results/${formId}`)
    } else {
      // 암호가 걸려있으면 모달 띄우기
      setTargetFormId(formId)
      setInputPw('')
      setPwError('')
      setShowPwModal(true)
    }
  }

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

  // ── 대표님 전용 비밀번호 설정 로직 ──
  async function saveNewPassword() {
    if (inputPw.length < 4) {
      setPwError('비밀번호는 4자리 이상 입력해주세요.')
      return
    }
    try {
      // Supabase user_metadata에 비밀번호 몰래 저장
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
      {/* ── 상단 네비게이션 ── */}
      <div className={s.header}>
        <div className={s.logo}>
          <div className={s.mark}>✦</div>
          <span className={s.title}>정프로 폼빌더</span>
        </div>
        <div className={s.actions}>
          {/* 👇 대표님 전용 관리자 설정 버튼 */}
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
          <button className={s.newBtn} onClick={() => navigate('/builder')}>+ 새 폼 만들기</button>
        </div>
      </div>

      {/* ── 폼 리스트 ── */}
      <div className={s.content}>
        <h2 className={s.pageTitle}>내 폼 목록</h2>
        
        {loading ? (
          <div className={s.loading}>로딩 중...</div>
        ) : forms.length === 0 ? (
          <div className={s.empty}>
            <p>아직 만들어진 폼이 없습니다.</p>
            <button className={s.newBtn} onClick={() => navigate('/builder')}>첫 폼 만들기</button>
          </div>
        ) : (
          <div className={s.grid}>
            {forms.map(form => (
              <div key={form.id} className={s.card}>
                <div className={s.cardTop}>
                  {form.is_published ? <span className={s.badgeOn}>게시됨</span> : <span className={s.badgeOff}>임시저장</span>}
                  <div className={s.views}>조회수: {form.views || 0}</div>
                </div>
                <h3 className={s.formTitle}>{form.title || '제목 없는 폼'}</h3>
                <div className={s.cardActs}>
                  <button className={s.btnGhost} onClick={() => navigate(`/builder/${form.id}`)}>편집</button>
                  {/* 👇 응답 보기 클릭 시 검증 로직 가동 */}
                  <button className={s.btnPrimary} onClick={() => handleResultsClick(form.id)}>응답 보기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── [모달] 응답 열람 시 비밀번호 입력 ── */}
      {showPwModal && (
        <div className={s.modalBg} onClick={() => setShowPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>🔒</div>
            <h3>관리자 권한 확인</h3>
            <p>응답 데이터를 보려면 대표 관리자 비밀번호를 입력하세요.</p>
            <input 
              type="password" 
              className={s.pwInp} 
              value={inputPw} 
              onChange={e => setInputPw(e.target.value)} 
              placeholder="비밀번호 입력"
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

      {/* ── [모달] 우측 상단 관리자 비밀번호 세팅 ── */}
      {showSetPwModal && (
        <div className={s.modalBg} onClick={() => setShowSetPwModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mIcon}>⚙️</div>
            <h3>대표 관리자 암호 설정</h3>
            <p>직원들이 응답 데이터를 보지 못하도록 암호를 설정합니다.</p>
            <input 
              type="password" 
              className={s.pwInp} 
              value={inputPw} 
              onChange={e => setInputPw(e.target.value)} 
              placeholder="새 비밀번호 입력 (4자리 이상)"
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
