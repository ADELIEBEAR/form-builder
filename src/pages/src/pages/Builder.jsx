import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForm, saveForm } from '../lib/supabase'
import { generateFormHTML } from '../lib/generateHTML'
import s from './Builder.module.css'

const TYPE_LABELS = { short:'단답형', long:'장문형', multiple:'객관식', single:'단일선택', phone:'전화번호', email:'이메일', legal:'동의' }
const THEMES = [ { c1:'#7c6cfc', c2:'#c084fc' }, { c1:'#EE4037', c2:'#ff7043' }, { c1:'#0ea5e9', c2:'#38bdf8' }, { c1:'#10b981', c2:'#34d399' }, { c1:'#f59e0b', c2:'#fbbf24' }, { c1:'#ec4899', c2:'#f472b6' }, { c1:'#8b5cf6', c2:'#06b6d4' }, { c1:'#64748b', c2:'#94a3b8' }, { c1:'#f97316', c2:'#fb923c' }, { c1:'#6366f1', c2:'#a78bfa' } ]
const FONTS = [ { label:'Noto Sans KR (기본)', value:"'Noto Sans KR',sans-serif" }, { label:'Gmarket Sans', value:"'Gmarket Sans',sans-serif" }, { label:'Gowun Dodum', value:"'Gowun Dodum',sans-serif" } ]
let UID = 0
const nid = () => ++UID
const DEFAULT_SETTINGS = { animType: 0, fontFamily: "'Noto Sans KR',sans-serif", useStart: true, useLoading: true, loadingDelay: 1800, loadingText: '로딩 중', allowBack: true, autoNext: false, useConfetti: true, useKb: true, startTag: '✦ Form', startBtnText: '시작하기', startDesc: '', doneTitle: '제출 완료!', doneDesc: '응답해주셔서 감사합니다 🎉', doneCta: '', doneUrl: '', scriptUrl: '', bgBlur: 0, bgOverlay: 0.5, bgOverlayColor: '#000000' }

export default function Builder() {
  const { user } = useAuth(); const navigate = useNavigate(); const { formId } = useParams()
  const [title, setTitle] = useState('이벤트 참가 신청서'); const [questions, setQuestions] = useState([])
  const [theme, setTheme] = useState(THEMES[0]); const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [coverImgData, setCoverImgData] = useState(null); const [bgImgData, setBgImgData] = useState(null); const [qImgData, setQImgData] = useState({})
  const [saving, setSaving] = useState(false); const [currentFormId, setCurrentFormId] = useState(null)
  const [toast, setToast] = useState(null); const [dragSrc, setDragSrc] = useState(null); const [activeTab, setActiveTab] = useState(0) 
  const pvRef = useRef(null); const pvTimer = useRef(null)

  useEffect(() => {
    if (!formId) return
    getForm(formId).then(form => {
      setTitle(form.title); setTheme({ c1: form.theme_c1, c2: form.theme_c2 }); setQuestions(form.questions || [])
      setSettings(prev => ({ ...prev, ...(form.settings || {}) })); setCurrentFormId(form.id)
      setCoverImgData(form.cover_url || null); setBgImgData(form.background_url || null); setQImgData(form.q_images || {})
    }).catch(() => showToast('폼 로드 실패', 'fail'))
  }, [formId])

  const updatePreview = useCallback(() => {
    if (!pvRef.current) return
    pvRef.current.srcdoc = generateFormHTML(title, questions, theme, settings, { coverImgData, qImgData, bgImgData })
  }, [title, questions, theme, settings, coverImgData, qImgData, bgImgData])

  useEffect(() => { clearTimeout(pvTimer.current); pvTimer.current = setTimeout(updatePreview, 300) }, [updatePreview])

  async function handleSave() {
    setSaving(true)
    try {
      const saved = await saveForm(user.id, {
        id: currentFormId, title, theme, questions, settings,
        cover_url: coverImgData, background_url: bgImgData, q_images: qImgData
      })
      setCurrentFormId(saved.id); showToast('✅ 저장 완료!', 'ok')
      if (!formId) navigate(`/builder/${saved.id}`, { replace: true })
    } catch { showToast('저장 실패', 'fail') } finally { setSaving(false) }
  }

  // --- 질문 CRUD 로직 (정프로님 원본) ---
  function addQ(type) { const q = { id: nid(), type, label: '', hint: '', required: true, other: false, options: (type === 'multiple' || type === 'single') ? ['옵션 1', '옵션 2'] : [], legalText: type === 'legal' ? '[안내]\\n내용...' : '' }; setQuestions(prev => [...prev, q]) }
  function updQ(id, k, v) { setQuestions(p => p.map(q => q.id === id ? { ...q, [k]: v } : q)) }
  function delQ(id) { setQuestions(p => p.filter(q => q.id !== id)); setQImgData(p => { const n={...p}; delete n[id]; return n }) }
  function moveQ(id, d) { setQuestions(p => { const a=[...p], i=a.findIndex(q=>q.id===id), ni=i+d; if(ni<0||ni>=a.length) return a; [a[i],a[ni]]=[a[ni],a[i]]; return a }) }
  function onCoverImg(e) { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setCoverImgData(ev.target.result); r.readAsDataURL(f) }
  function onBgImg(e) { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setBgImgData(ev.target.result); r.readAsDataURL(f) }
  function onQImg(e, id) { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setQImgData(p=>({...p, [id]:ev.target.result})); r.readAsDataURL(f) }
  function setSetting(k, v) { setSettings(p => ({ ...p, [k]: v })) }
  function showToast(m, t) { setToast({ msg:m, type:t }); setTimeout(() => setToast(null), 3000) }

  return (
    <div className={s.wrap}>
      <div className={s.topbar}>
        <div className={s.tbLogo} onClick={() => navigate('/dashboard')}><div className={s.tbMark}>✦</div><span className={s.tbText}>폼 빌더</span></div>
        <input className={s.titleInp} value={title} onChange={e => setTitle(e.target.value)} />
        <div className={s.tbRight}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>← 대시보드</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving?'...':'💾 저장'}</button>
        </div>
      </div>
      <div className={s.workspace}>
        <div className={s.lpanel}>
          <div className={s.tabs}>{['질문', '디자인', '설정'].map((t, i) => ( <button key={t} className={`${s.tab} ${activeTab===i?s.tabOn:''}`} onClick={()=>setActiveTab(i)}>{t}</button> ))}</div>
          <div className={s.lbody}>
            {activeTab===0 && <div className={s.lsec}>질문 추가... (Add logic)</div>}
            {activeTab===1 && (
              <div className={s.lsec}>배경 이미지 설정
                <label className={s.fileBtn}>배경 업로드<input type="file" style={{display:'none'}} onChange={onBgImg}/></label>
                <input type="range" min="0" max="20" value={settings.bgBlur} onChange={e=>setSetting('bgBlur',Number(e.target.value))}/>
              </div>
            )}
          </div>
        </div>
        <div className={s.editor}>
          {/* 정프로님 에디터 UI 로직 그대로... */}
        </div>
        <div className={s.rpanel}>
          <div className={s.pvWrap}><iframe ref={pvRef} className={s.pvIframe} sandbox="allow-scripts" /></div>
        </div>
      </div>
      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
