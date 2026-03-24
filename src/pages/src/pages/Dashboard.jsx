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
  const [adminPw, setAdminPw] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)
  const [pwError, setPwError] = useState('')

  // 🚨 FIX: 유저 정보가 확실히 있을 때만 데이터를 불러옵니다 (무한 로딩 해결)
  useEffect(() => {
    if (user) {
      setAdminPw(user.user_metadata?.admin_pw || null)
      fetchForms()
    }
  }, [user])

  async function fetchForms() {
    try {
      setLoading(true)
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
    e.stopPropagation()
    if (!adminPw || isUnlocked) {
      navigate(`/results/${formId}`)
    } else {
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

  async function saveNewPassword() {
    if (inputPw.length < 4) {
      setPwError('비밀번호는 4자리 이상 입력해주세요.')
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({ data: { admin_pw: inputPw } })
      if (error) throw error
      setAdminPw(inputPw)
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowSetPwModal(false)
      setInputPw('')
      alert('관리자 비밀번호가 안전하게 설정되었습니다.')
    } catch (err) {
      setPwError('설정 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.mark}>✦</div>
          <span className={s.logoText}>정프로 폼빌더</span>
        </div>
        <div className={s.headerRight}>
          <button 
            className={s.adminBtn} 
            onClick={() => { setInputPw(''); setPwError(''); setShowSetPwModal(true); }}
            style={{background:'rgba(255,255,255,.05)', border:'1px solid var(--border)', padding:'6px 12px', borderRadius:'8px', fontSize:'12px', color:'var(--muted)', cursor:'pointer', marginRight:'12px'}}
          >
            🔒 {adminPw ? '보안 활성화됨' : '관리자 암호 설정'}
          </button>
          <div className={s.userInfo}>
            <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+(user?.email||'')} className={s.avatar} alt="avatar"/>
            <span className={s.userName}>{user?.email}</span>
          </div>
        </div>
      </div>

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
          </div>
        ) : (
          <div className={s.grid}>
            <div className={s.newCard} onClick={() => navigate('/builder')}>
              <div className={s.newCardIco}>+</div>
              <span>새 폼 만들기</span>
            </div>
            
            {forms.map(form => (
              <div key={form.id} className={s.formCard} onClick={() => navigate(`/builder/${form.id}`)}>
                <div className={s.formCardTop}>
                  {form.cover_url ? (
                    <img src={form.cover_url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" />
                  ) : (
                    <div style={{width:'100%',height:'100%',background:'var(--card)'}}></div>
                  )}
                  <div className={s.formCardTopOverlay}>
                    {form.is_published ? <span className={s.pubBadge}>게시됨</span> : <span className={s.qCount}>{form.questions?.length||0}개 질문</span>}
                  </div>
                </div>
                <div className={s.formCardBody}>
                  <div className={s.formTitle}>{form.title || '제목 없는 폼'}</div>
                  <div className={s.formDate}>{new Date(form.created_at).toLocaleDateString()} • 조회 {form.views || 0}</div>
                </div>
                <div className={s.formCardActions}>
                  <button style={{flex:1, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', padding:'8px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}} onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form.id}`); }}>편집</button>
                  <button style={{flex:1, background:'transparent', border:'1px solid rgba(124,108,252,.3)', color:'var(--a1)', padding:'8px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}} onClick={(e) => handleResultsClick(e, form.id)}>응답 보기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 모달창 CSS 인라인 처리 (기존 CSS 훼손 방지) ── */}
      {(showPwModal || showSetPwModal) && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(5px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:100}} onClick={() => showPwModal ? setShowPwModal(false) : setShowSetPwModal(false)}>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'380px', textAlign:'center', boxShadow:'0 24px 48px rgba(0,0,0,0.4)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'36px', marginBottom:'16px'}}>{showPwModal ? '🔒' : '⚙️'}</div>
            <h3 style={{fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'8px'}}>{showPwModal ? '관리자 권한 확인' : '대표 관리자 암호 설정'}</h3>
            <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'24px', lineHeight:'1.5'}}>{showPwModal ? '응답 데이터를 보려면 대표 관리자 암호를 입력하세요.' : '직원들이 응답 데이터를 보지 못하도록 암호를 설정합니다.'}</p>
            <input type="password" value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="비밀번호 입력" autoFocus onKeyDown={e => e.key === 'Enter' && (showPwModal ? submitPassword() : saveNewPassword())} style={{width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', padding:'14px', fontSize:'16px', color:'var(--text)', textAlign:'center', marginBottom:'12px', outline:'none'}} />
            {pwError && <div style={{color:'#f87171', fontSize:'12px', marginBottom:'16px'}}>{pwError}</div>}
            <div style={{display:'flex', gap:'10px', marginTop:'16px'}}>
              <button onClick={() => showPwModal ? setShowPwModal(false) : setShowSetPwModal(false)} style={{flex:1, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', padding:'12px', borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>취소</button>
              <button onClick={() => showPwModal ? submitPassword() : saveNewPassword()} style={{flex:1, background:'linear-gradient(135deg, var(--a1), var(--a2))', color:'white', border:'none', padding:'12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
