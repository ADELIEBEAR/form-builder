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

  // 1. 유저 정보 및 폼 리스트 초기화
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

  // ── [복구된 알짜 기능 1] 공개/비공개 전환 ──
  async function togglePublish(e, formId, currentStatus) {
    e.stopPropagation()
    try {
      const { error } = await supabase.from('forms').update({ is_published: !currentStatus }).eq('id', formId)
      if (error) throw error
      setForms(prev => prev.map(f => f.id === formId ? { ...f, is_published: !currentStatus } : f))
    } catch (err) {
      alert('상태 변경에 실패했습니다.')
    }
  }

  // ── [복구된 알짜 기능 2] 링크 복사 ──
  function copyLink(e, slug) {
    e.stopPropagation()
    if (!slug) return alert('아직 주소가 생성되지 않았습니다. 폼을 한 번 저장해주세요.')
    const url = `${window.location.origin}/f/${slug}`
    navigator.clipboard.writeText(url)
    alert('✅ 폼 링크가 복사되었습니다!\n' + url)
  }

  // ── [복구된 알짜 기능 3] 구글 시트 연동 (URL 세팅) ──
  async function connectSheet(e, form) {
    e.stopPropagation()
    const currentUrl = form.settings?.scriptUrl || ''
    const newUrl = window.prompt("구글 Apps Script URL을 입력하세요.\n(비워두면 연동이 해제됩니다)", currentUrl)
    
    if (newUrl !== null) {
      try {
        const newSettings = { ...(form.settings || {}), scriptUrl: newUrl.trim() }
        const { error } = await supabase.from('forms').update({ settings: newSettings }).eq('id', form.id)
        if (error) throw error
        setForms(prev => prev.map(f => f.id === form.id ? { ...f, settings: newSettings } : f))
        alert('📊 구글 시트 연동 URL이 저장되었습니다.')
      } catch (err) {
        alert('저장에 실패했습니다.')
      }
    }
  }

  // ── [복구된 알짜 기능 4] 휴지통 (삭제) ──
  async function deleteForm(e, formId) {
    e.stopPropagation()
    if (!window.confirm('정말 이 폼을 삭제하시겠습니까?\n(수집된 응답도 함께 삭제될 수 있습니다)')) return
    
    try {
      const { error } = await supabase.from('forms').delete().eq('id', formId)
      if (error) throw error
      setForms(prev => prev.filter(f => f.id !== formId))
    } catch (err) {
      alert('삭제에 실패했습니다.')
    }
  }

  // ── [보안] 응답 보기 클릭 시 검문소 역할 ──
  function handleResultsClick(e, formId) {
    e.stopPropagation()
    if (!adminPw) {
      alert("🚨 보안 경고: 우측 상단에서 '관리자 암호'를 먼저 설정해야 응답을 볼 수 있습니다.")
      setShowSetPwModal(true)
      return
    }
    if (isUnlocked) {
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
          {/* 대표님 전용 암호 설정 버튼 */}
          <button 
            onClick={() => { setInputPw(''); setPwError(''); setShowSetPwModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: adminPw ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: adminPw ? '#4ade80' : '#f87171',
              border: `1px solid ${adminPw ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {adminPw ? '🔒 보안 켜짐' : '⚠️ 암호 설정필요'}
          </button>
          
          <div className={s.userInfo}>
            <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+(user?.email||'')} className={s.avatar} alt="avatar"/>
            <span className={s.userName}>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* ── 메인 대시보드 ── */}
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
            <p>직원들이 폼을 만들고 데이터를 수집할 수 있게 해주세요!</p>
            <button onClick={() => navigate('/builder')} style={{marginTop:'20px', padding:'10px 20px', background:'linear-gradient(135deg, var(--a1), var(--a2))', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer'}}>+ 새 폼 만들기</button>
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
                
                {/* 카드 썸네일 */}
                <div className={s.formCardTop}>
                  {form.cover_url ? (
                    <img src={form.cover_url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" />
                  ) : (
                    <div style={{width:'100%',height:'100%',background:'rgba(255,255,255,0.02)'}}></div>
                  )}
                  <div className={s.formCardTopOverlay}>
                    {form.is_published ? <span className={s.pubBadge}>게시됨</span> : <span className={s.qCount} style={{background:'rgba(239,68,68,0.2)', color:'#f87171'}}>비공개</span>}
                  </div>
                </div>
                
                {/* 카드 본문 */}
                <div className={s.formCardBody}>
                  <div className={s.formTitle}>{form.title || '제목 없는 폼'}</div>
                  <div className={s.formDate}>
                    조회 {form.views || 0} • {new Date(form.created_at).toLocaleDateString()}
                  </div>
                  
                  {/* 복구된 기능 4인방 아이콘 버튼들 */}
                  <div style={{display:'flex', gap:'8px', marginTop:'14px'}}>
                    <button onClick={(e) => togglePublish(e, form.id, form.is_published)} style={{flex:1, padding:'6px', background:'var(--s1)', border:'1px solid var(--border)', borderRadius:'6px', fontSize:'12px', color:'var(--muted)', cursor:'pointer'}} title="공개/비공개 전환">
                      {form.is_published ? '🟢 공개' : '🔴 닫힘'}
                    </button>
                    <button onClick={(e) => copyLink(e, form.slug)} style={{flex:1, padding:'6px', background:'var(--s1)', border:'1px solid var(--border)', borderRadius:'6px', fontSize:'12px', color:'var(--muted)', cursor:'pointer'}} title="링크 복사">
                      🔗 링크
                    </button>
                    <button onClick={(e) => connectSheet(e, form)} style={{flex:1, padding:'6px', background: form.settings?.scriptUrl ? 'rgba(74,222,128,0.1)' : 'var(--s1)', border:'1px solid var(--border)', borderColor: form.settings?.scriptUrl ? 'rgba(74,222,128,0.3)' : 'var(--border)', borderRadius:'6px', fontSize:'12px', color: form.settings?.scriptUrl ? '#4ade80' : 'var(--muted)', cursor:'pointer'}} title="구글 시트 연동">
                      📊 시트
                    </button>
                    <button onClick={(e) => deleteForm(e, form.id)} style={{width:'32px', padding:'6px', background:'var(--s1)', border:'1px solid var(--border)', borderRadius:'6px', fontSize:'12px', color:'#f87171', cursor:'pointer'}} title="삭제">
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* 메인 액션 버튼 (편집 / 응답보기) */}
                <div className={s.formCardActions}>
                  <button 
                    style={{flex:1, background:'transparent', border:'none', color:'var(--muted)', padding:'10px', fontSize:'13px', fontWeight:'500', cursor:'pointer'}} 
                    onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form.id}`); }}
                  >
                    ✏️ 편집
                  </button>
                  <button 
                    style={{flex:1.5, background: adminPw && !isUnlocked ? 'var(--s1)' : 'linear-gradient(135deg, var(--a1), var(--a2))', color: adminPw && !isUnlocked ? 'var(--muted)' : 'white', border:'none', borderRadius:'8px', padding:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px'}} 
                    onClick={(e) => handleResultsClick(e, form.id)}
                  >
                    {adminPw && !isUnlocked ? '🔒 응답 잠김' : '📊 응답 보기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── [모달] 1. 응답 데이터 열람 시 비밀번호 검증 ── */}
      {showPwModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(4px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999}} onClick={() => setShowPwModal(false)}>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'36px 28px', width:'100%', maxWidth:'360px', textAlign:'center', boxShadow:'0 24px 48px rgba(0,0,0,0.5)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'40px', marginBottom:'16px'}}>🔒</div>
            <h3 style={{fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'8px'}}>관리자 권한 확인</h3>
            <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'24px', lineHeight:'1.5'}}>대표 관리자 암호를 입력하세요.</p>
            <input type="password" value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="비밀번호 4자리" autoFocus onKeyDown={e => e.key === 'Enter' && submitPassword()} style={{width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px', fontSize:'16px', color:'var(--text)', textAlign:'center', marginBottom:'12px', outline:'none', letterSpacing:'4px'}} />
            {pwError && <div style={{color:'#f87171', fontSize:'12px', marginBottom:'16px'}}>{pwError}</div>}
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={() => setShowPwModal(false)} style={{flex:1, background:'var(--s1)', border:'1px solid var(--border)', color:'var(--muted)', padding:'12px', borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>취소</button>
              <button onClick={submitPassword} style={{flex:1, background:'linear-gradient(135deg, var(--a1), var(--a2))', color:'white', border:'none', padding:'12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>잠금 해제</button>
            </div>
          </div>
        </div>
      )}

      {/* ── [모달] 2. 대표님 전용 비밀번호 새로 설정/변경 ── */}
      {showSetPwModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(4px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999}} onClick={() => setShowSetPwModal(false)}>
          <div style={{background:'var(--card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'36px 28px', width:'100%', maxWidth:'360px', textAlign:'center', boxShadow:'0 24px 48px rgba(0,0,0,0.5)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'40px', marginBottom:'16px'}}>🛡️</div>
            <h3 style={{fontSize:'18px', fontWeight:'600', color:'var(--text)', marginBottom:'8px'}}>대표 관리자 암호 설정</h3>
            <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'24px', lineHeight:'1.5'}}>수집된 DB를 보호할 암호를 설정하세요.</p>
            <input type="password" value={inputPw} onChange={e => setInputPw(e.target.value)} placeholder="새 암호 입력 (4자리 이상)" autoFocus onKeyDown={e => e.key === 'Enter' && saveNewPassword()} style={{width:'100%', background:'var(--bg)', border:'1px solid var(--a1)', borderRadius:'10px', padding:'14px', fontSize:'16px', color:'var(--text)', textAlign:'center', marginBottom:'12px', outline:'none', letterSpacing:'2px'}} />
            {pwError && <div style={{color:'#f87171', fontSize:'12px', marginBottom:'16px'}}>{pwError}</div>}
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={() => setShowSetPwModal(false)} style={{flex:1, background:'var(--s1)', border:'1px solid var(--border)', color:'var(--muted)', padding:'12px', borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>취소</button>
              <button onClick={saveNewPassword} style={{flex:1, background:'#10b981', color:'white', border:'none', padding:'12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}>설정 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
