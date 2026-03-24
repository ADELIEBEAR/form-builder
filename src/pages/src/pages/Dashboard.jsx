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
  
  // ── [보안 관제탑] 상태 관리 ──
  const [adminPw, setAdminPw] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true')
  
  // 모달 상태
  const [showPwModal, setShowPwModal] = useState(false)
  const [showSetPwModal, setShowSetPwModal] = useState(false)
  const [inputPw, setInputPw] = useState('')
  const [targetFormId, setTargetFormId] = useState(null)
  const [pwError, setPwError] = useState('')

  // 🚨 FIX: 무한 로딩 해결! Supabase에서 직접 유저 정보를 낚아챕니다.
  useEffect(() => {
    async function initDashboard() {
      try {
        setLoading(true)
        // 1. 유저 정보 강제 확인
        const { data: { user: currentUser }, error: authErr } = await supabase.auth.getUser()
        if (authErr || !currentUser) return
        
        // 2. 대표님 비밀번호 세팅 확인
        setAdminPw(currentUser.user_metadata?.admin_pw || null)

        // 3. 폼 목록 가져오기
        const { data: formsData, error: formsErr } = await supabase
          .from('forms')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          
        if (formsErr) throw formsErr
        setForms(formsData || [])
        
      } catch (err) {
        console.error('대시보드 로딩 에러:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initDashboard()
  }, [])

  // ── [핵심] 응답 보기 버튼 클릭 시 발동하는 서킷 브레이커 ──
  function handleResultsClick(e, formId) {
    e.stopPropagation()
    
    if (!adminPw) {
      alert("🚨 보안 경고: 우측 상단에서 '관리자 암호'를 먼저 설정해야 응답을 볼 수 있습니다.")
      setShowSetPwModal(true)
      return
    }
    
    if (isUnlocked) {
      // 이미 비밀번호 풀었으면 프리패스
      navigate(`/results/${formId}`)
    } else {
      // 안 풀었으면 검문소 모달 띄우기
      setTargetFormId(formId)
      setInputPw('')
      setPwError('')
      setShowPwModal(true)
    }
  }

  // ── 검문소 비밀번호 제출 ──
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

  // ── 대표님 전용 비밀번호 최초 설정 및 변경 ──
  async function saveNewPassword() {
    if (inputPw.length < 4) {
      setPwError('비밀번호는 4자리 이상 입력해주세요.')
      return
    }
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const { error } = await supabase.auth.updateUser({
        data: { admin_pw: inputPw }
      })
      if (error) throw error
      
      setAdminPw(inputPw)
      setIsUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
      setShowSetPwModal(false)
      setInputPw('')
      alert('🔒 대표 관리자 비밀번호가 안전하게 설정되었습니다.')
    } catch (err) {
      setPwError('설정 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className={s.wrap}>
      {/* ── 상단 헤더 ── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.mark}>✦</div>
          <span className={s.logoText}>정프로 폼빌더</span>
        </div>
        
        <div className={s.headerRight}>
          {/* 👇 확실하게 눈에 띄는 '잠금장치' 버튼 */}
          <button 
            onClick={() => { setInputPw(''); setPwError(''); setShowSetPwModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: adminPw ? 'rgba(16, 185, 129, 0.1)' : '#fee2e2',
              color: adminPw ? '#10b981' : '#ef4444',
              border: `1px solid ${adminPw ? 'rgba(16, 185, 129, 0.3)' : '#f87171'}`,
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {adminPw ? '🔒 보안 켜짐 (암호변경)' : '⚠️ 관리자 암호 설정필요'}
          </button>
          
          <div className={s.userInfo}>
            <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+(user?.email||'')} className={s.avatar} alt="avatar"/>
            <span className={s.userName}>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* ── 메인 대시보드 영역 ── */}
      <div className={s.main}>
        <div className={s.topRow}>
          <div>
            <h1 className={s.pageTitle}>내 폼 목록</h1>
            <div className={s.pageSub}>총 {forms.length}개의 폼이 있습니다.</div>
          </div>
        </div>
        
        {/* 무한 로딩 방어선 */}
        {loading ? (
          <div className={s.loadingWrap}>
            <div className={s.spinner}></div>
            <span>폼 데이터를 불러오는 중입니다...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIco}>✦</div>
            <h2>아직 만들어진 폼이 없네요</h2>
            <p>직원들이 폼을 만들고 데이터를 수집할 수 있게 해주세요!</p>
            <button onClick={() => navigate('/builder')} style={{marginTop:'20px', padding:'12px 24px', background:'linear-gradient(135deg, var(--a1), var(--a2))', color:'white', border:'none', borderRadius:'12px', fontWeight:'600', cursor:'pointer'}}>+ 새 폼 만들기</button>
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
                    <div style={{width:'100%',height:'100%',background:'var(--card)'}}></div>
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
                  <button 
                    style={{flex:1, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', padding:'10px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', cursor:'pointer'}} 
                    onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form.id}`); }}
                  >
                    ✏️ 편집
                  </button>
                  
                  {/* 👇 강력한 잠금장치가 적용된 응답 보기 버튼 */}
                  <button 
                    style={{
                      flex:1.2, 
                      background: adminPw && !isUnlocked ? '#111827' : 'linear-gradient(135deg, var(--a1), var(--a2))', 
                      color:'white', border:'none', padding:'10px', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                    onClick={(e) => handleResultsClick(e, form.id)}
                  >
                    {adminPw && !isUnlocked ? '🔒 잠긴 응답 보기' : '📊 응답 보기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── [모달] 1. 응답 데이터 열람 시 비밀번호 검증 (서킷 브레이커) ── */}
      {showPwModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999}} onClick={() => setShowPwModal(false)}>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'24px', padding:'40px 32px', width:'100%', maxWidth:'400px', textAlign:'center', boxShadow:'0 32px 64px rgba(0,0,0,0.5)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'48px', marginBottom:'16px'}}>🔒</div>
            <h3 style={{fontSize:'20px', fontWeight:'700', color:'var(--text)', marginBottom:'12px'}}>관리자 권한 확인</h3>
            <p style={{fontSize:'14px', color:'var(--muted)', marginBottom:'28px', lineHeight:'1.5'}}>직원 접근 방지용입니다.<br/>대표 관리자 암호를 입력하세요.</p>
            <input 
              type="password" value={inputPw} onChange={e => setInputPw(e.target.value)} 
              placeholder="비밀번호 4자리" autoFocus 
              onKeyDown={e => e.key === 'Enter' && submitPassword()} 
              style={{width:'100%', background:'var(--bg)', border:'2px solid var(--border)', borderRadius:'14px', padding:'16px', fontSize:'18px', color:'var(--text)', textAlign:'center', marginBottom:'12px', outline:'none', letterSpacing:'4px'}} 
            />
            {pwError && <div style={{color:'#f87171', fontSize:'13px', fontWeight:'500', marginBottom:'20px'}}>{pwError}</div>}
            <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
              <button onClick={() => setShowPwModal(false)} style={{flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'var(--muted)', padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'500', cursor:'pointer'}}>취소</button>
              <button onClick={submitPassword} style={{flex:1, background:'linear-gradient(135deg, var(--a1), var(--a2))', color:'white', border:'none', padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}>잠금 해제</button>
            </div>
          </div>
        </div>
      )}

      {/* ── [모달] 2. 대표님 전용 비밀번호 새로 설정/변경 ── */}
      {showSetPwModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999}} onClick={() => setShowSetPwModal(false)}>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'24px', padding:'40px 32px', width:'100%', maxWidth:'400px', textAlign:'center', boxShadow:'0 32px 64px rgba(0,0,0,0.5)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'48px', marginBottom:'16px'}}>🛡️</div>
            <h3 style={{fontSize:'20px', fontWeight:'700', color:'var(--text)', marginBottom:'12px'}}>대표 관리자 암호 설정</h3>
            <p style={{fontSize:'14px', color:'var(--muted)', marginBottom:'28px', lineHeight:'1.5'}}>수집된 DB를 대표님만 볼 수 있도록<br/>강력한 암호를 설정하세요.</p>
            <input 
              type="password" value={inputPw} onChange={e => setInputPw(e.target.value)} 
              placeholder="새 암호 입력 (4자리 이상)" autoFocus 
              onKeyDown={e => e.key === 'Enter' && saveNewPassword()} 
              style={{width:'100%', background:'var(--bg)', border:'2px solid var(--a1)', borderRadius:'14px', padding:'16px', fontSize:'18px', color:'var(--text)', textAlign:'center', marginBottom:'12px', outline:'none', letterSpacing:'2px'}} 
            />
            {pwError && <div style={{color:'#f87171', fontSize:'13px', fontWeight:'500', marginBottom:'20px'}}>{pwError}</div>}
            <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
              <button onClick={() => setShowSetPwModal(false)} style={{flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'var(--muted)', padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'500', cursor:'pointer'}}>취소</button>
              <button onClick={saveNewPassword} style={{flex:1, background:'#10b981', color:'white', border:'none', padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer'}}>설정 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
