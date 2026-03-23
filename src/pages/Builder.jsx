import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForm, saveForm, publishForm } from '../lib/supabase'
import { generateFormHTML } from '../lib/generateHTML'
import s from './Builder.module.css'
import { CONCEPT_THEMES, COLOR_THEMES, FONTS } from '../lib/themes'
import { useTheme } from '../lib/themeContext'
import { supabase as sb } from '../lib/supabase'
import { createAndConnectSheet } from '../lib/googleSheets'

const TYPE_LABELS = { short:'단답형', long:'장문형', multiple:'객관식', single:'단일선택', phone:'전화번호', email:'이메일', legal:'동의' }
const TYPE_ICONS  = { short:'✏️', long:'📝', multiple:'☑️', single:'🔘', phone:'📱', email:'📧', legal:'📋' }
let UID = 0
const nid = () => ++UID

const DEFAULT_SETTINGS = {
  animType: 0, conceptTheme: 'default', fontFamily: "'Noto Sans KR',sans-serif",
  useStart: true,
  allowBack: true, autoNext: false, useConfetti: true, useKb: true,
  startTag: '✦ Form', startBtnText: '시작하기', startDesc: '',
  doneTitle: '제출 완료!', doneDesc: '응답해주셔서 감사합니다 🎉',
  doneCta: '', doneUrl: '', scriptUrl: '',
}

export default function Builder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formId } = useParams()

  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([])
  const [theme, setTheme] = useState(COLOR_THEMES[0])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [coverImgData, setCoverImgData] = useState(null)
  const [qImgData, setQImgData] = useState({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [currentFormId, setCurrentFormId] = useState(null)
  const [currentSlug, setCurrentSlug] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const [toast, setToast] = useState(null)
  const [dragSrc, setDragSrc] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [designTab, setDesignTab] = useState(0)
  const [pvMode, setPvMode] = useState('mobile')
  const [showSheetModal, setShowSheetModal] = useState(false)
  const [sheetConnecting, setSheetConnecting] = useState(false)
  const { theme: appTheme, toggle: toggleAppTheme } = useTheme()
  const pvRef = useRef(null)
  const pvTimer = useRef(null)
  const autoSaveTimer = useRef(null)

  useEffect(() => {
    if (!formId) return
    getForm(formId).then(form => {
      setTitle(form.title)
      setTheme({ c1: form.theme_c1, c2: form.theme_c2 })
      setQuestions(form.questions || [])
      setSettings(prev => ({ ...DEFAULT_SETTINGS, ...(form.settings || {}) }))
      setCurrentFormId(form.id)
      setCurrentSlug(form.slug)
      setIsPublished(form.is_published)
    }).catch(() => showToast('폼을 불러올 수 없습니다.', 'fail'))
  }, [formId])

  // 미리보기
  const updatePreview = useCallback(() => {
    if (!pvRef.current) return
    pvRef.current.srcdoc = generateFormHTML(title, questions, theme, settings, { coverImgData, qImgData })
  }, [title, questions, theme, settings, coverImgData, qImgData])

  useEffect(() => {
    clearTimeout(pvTimer.current)
    pvTimer.current = setTimeout(updatePreview, 400)
  }, [updatePreview])

  // 자동 저장 (3분마다)
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (title && questions.length > 0) handleSave(true)
    }, 180000)
    return () => clearInterval(autoSaveTimer.current)
  }, [title, questions, theme, settings])

  async function handleSave(silent = false) {
    if (!title.trim()) { if (!silent) showToast('폼 제목을 입력해주세요.', 'fail'); return }
    setSaving(true)
    try {
      const saved = await saveForm(user.id, { id: currentFormId, title, theme, questions, settings })
      setCurrentFormId(saved.id)
      if (!silent) showToast('✅ 저장되었습니다!', 'ok')
      if (!formId) {
        navigate(`/builder/${saved.id}`, { replace: true })
        // 새 폼이면 시트 연동 모달 표시
        if (!silent) setTimeout(() => setShowSheetModal(true), 500)
      }
    } catch {
      if (!silent) showToast('저장 중 오류가 발생했습니다.', 'fail')
    } finally {
      setSaving(false)
    }
  }

  async function handleSheetConnect() {
    setSheetConnecting(true)
    try {
      const { data: { session } } = await sb.auth.getSession()
      const accessToken = session?.provider_token
      if (!accessToken) {
        showToast('구글 시트 권한이 필요해요. 로그아웃 후 다시 로그인해주세요.', 'fail')
        setShowSheetModal(false)
        return
      }
      const { sheetUrl, sheetId } = await createAndConnectSheet(currentFormId, title)
      await sb.from('forms').update({ sheet_id: sheetId, sheet_url: sheetUrl }).eq('id', currentFormId)
      showToast('✅ 구글 시트 연결 완료!', 'ok')
      window.open(sheetUrl, '_blank')
    } catch (err) {
      if (err.message !== 'popup_closed_by_user') showToast('시트 연결 실패: ' + err.message, 'fail')
    } finally {
      setSheetConnecting(false)
      setShowSheetModal(false)
    }
  }

  async function handlePublish() {
    if (!title.trim()) { showToast('폼 제목을 입력해주세요.', 'fail'); return }
    setPublishing(true)
    try {
      const saved = await saveForm(user.id, { id: currentFormId, title, theme, questions, settings })
      setCurrentFormId(saved.id)
      const published = await publishForm(saved.id, title)
      setCurrentSlug(published.slug)
      setIsPublished(true)
      setShowPublishModal(true)
    } catch {
      showToast('발행 중 오류가 발생했습니다.', 'fail')
    } finally {
      setPublishing(false)
    }
  }

  function addQ(type) {
    const q = {
      id: nid(), type, label: '', hint: '', required: true, other: false,
      options: (type === 'multiple' || type === 'single') ? ['옵션 1', '옵션 2'] : [],
      legalText: type === 'legal' ? '[개인정보 수집 및 이용 안내]\n\n수집 항목: 성명, 연락처\n수집 목적: 서비스 안내\n보유 기간: 30일' : '',
    }
    setQuestions(prev => [...prev, q])
    setTimeout(() => {
      document.querySelector(`[data-qid="${q.id}"] input`)?.focus()
    }, 100)
  }

  function updQ(id, key, val) { setQuestions(prev => prev.map(q => q.id === id ? { ...q, [key]: val } : q)) }
  function delQ(id) { setQuestions(prev => prev.filter(q => q.id !== id)); setQImgData(prev => { const n = { ...prev }; delete n[id]; return n }) }
  function moveQ(id, dir) {
    setQuestions(prev => {
      const arr = [...prev]; const i = arr.findIndex(q => q.id === id); const ni = i + dir
      if (ni < 0 || ni >= arr.length) return arr
      ;[arr[i], arr[ni]] = [arr[ni], arr[i]]; return arr
    })
  }
  function addOpt(id) { setQuestions(prev => prev.map(q => q.id === id ? { ...q, options: [...q.options, `옵션 ${q.options.length + 1}`] } : q)) }
  function updOpt(id, oi, val) { setQuestions(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, i) => i === oi ? val : o) } : q)) }
  function delOpt(id, oi) { setQuestions(prev => prev.map(q => q.id === id && q.options.length > 1 ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q)) }

  function onDrop(targetId) {
    if (!dragSrc || dragSrc === targetId) return
    setQuestions(prev => {
      const arr = [...prev]; const fi = arr.findIndex(q => q.id === dragSrc); const ti = arr.findIndex(q => q.id === targetId)
      const [item] = arr.splice(fi, 1); arr.splice(ti, 0, item); return arr
    })
    setDragSrc(null)
  }

  function onCoverImg(e) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setCoverImgData(ev.target.result); r.readAsDataURL(f) }
  function onQImg(e, id) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setQImgData(prev => ({ ...prev, [id]: ev.target.result })); r.readAsDataURL(f) }
  function setSetting(key, val) { setSettings(prev => ({ ...prev, [key]: val })) }
  function showToast(msg, type) { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }
  const genHTML = () => generateFormHTML(title, questions, theme, settings, { coverImgData, qImgData })
  const shareUrl = currentSlug ? `${window.location.origin}/f/${currentSlug}` : ''

  const isLight = appTheme === 'light'

  return (
    <div className={`${s.wrap} ${isLight ? s.wrapLight : ''}`}>

      {/* ── 상단바 ── */}
      <div className={s.topbar}>
        <div className={s.tbLeft}>
          <div className={s.tbLogo} onClick={() => navigate('/dashboard')}>
            <div className={s.tbMark}>✦</div>
            <span className={s.tbText}>폼 빌더</span>
          </div>
          <div className={s.titleWrap}>
            <input className={s.titleInp} value={title} onChange={e => setTitle(e.target.value)} placeholder="폼 제목 입력..." />
            <span className={s.titleEditHint}>✏️</span>
          </div>
        </div>
        <div className={s.tbRight}>
          {/* 다크/라이트 토글 */}
          <button className={s.themeToggle} onClick={toggleAppTheme} title="테마 전환">
            {isLight ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>← 나가기</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { const w = window.open('','_blank'); w.document.write(genHTML()); w.document.close() }}>👁 미리보기</button>
          <button className="btn btn-ghost btn-sm" onClick={() => handleSave()} disabled={saving}>
            {saving ? '⏳' : '💾'} {saving ? '저장중' : '저장'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePublish} disabled={publishing}>
            {publishing ? '⏳ 발행중...' : isPublished ? '🔄 재발행' : '🚀 저장 & 발행'}
          </button>
        </div>
      </div>

      <div className={s.workspace}>

        {/* ── 왼쪽 패널 ── */}
        <div className={s.lpanel}>
          <div className={s.tabs}>
            {['질문', '디자인', '설정'].map((t, i) => (
              <button key={i} className={`${s.tab} ${activeTab === i ? s.tabOn : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
            ))}
          </div>

          <div className={s.lbody}>
            {/* ── 탭 0: 질문 ── */}
            {activeTab === 0 && (
              <>
                <div className={s.lsec}>질문 추가</div>
                <div className={s.typeGrid}>
                  {Object.entries(TYPE_LABELS).map(([type, label]) => (
                    <button key={type} className={s.typeBtn} onClick={() => { addQ(type); setActiveTab(0) }}>
                      <span className={s.typeBtnIco}>{TYPE_ICONS[type]}</span>
                      <span className={s.typeBtnLabel}>{label}</span>
                    </button>
                  ))}
                </div>

                {questions.length > 0 && (
                  <>
                    <div className={s.lsep} />
                    <div className={s.lsec}>질문 목록 ({questions.length})</div>
                    <div className={s.qList}>
                      {questions.map((q, i) => (
                        <div key={q.id} className={s.qListItem}>
                          <span className={s.qListNum}>Q{i+1}</span>
                          <span className={s.qListLabel}>{q.label || '(제목 없음)'}</span>
                          <span className={s.qListType}>{TYPE_ICONS[q.type]}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── 탭 1: 디자인 ── */}
            {activeTab === 1 && (
              <>
                <div className={s.subTabs}>
                  <button className={`${s.subTab} ${designTab===0?s.subTabOn:''}`} onClick={()=>setDesignTab(0)}>🎨 테마</button>
                  <button className={`${s.subTab} ${designTab===1?s.subTabOn:''}`} onClick={()=>setDesignTab(1)}>🔤 폰트</button>
                </div>

                {designTab === 0 && <>
                  <div className={s.lsec}>컨셉 테마</div>
                  <div className={s.conceptGrid}>
                    {CONCEPT_THEMES.map(ct => (
                      <div key={ct.id} className={`${s.conceptCard} ${settings.conceptTheme===ct.id?s.conceptCardOn:''}`} onClick={()=>setSetting('conceptTheme',ct.id)} title={ct.desc}>
                        <div className={s.conceptEmoji}>{ct.emoji}</div>
                        <div className={s.conceptName}>{ct.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className={s.lsep}/>
                  <div className={s.lsec}>색상</div>
                  <div className={s.themeGrid}>
                    {COLOR_THEMES.map((t,i) => (
                      <div key={i} className={`${s.tdot} ${theme.c1===t.c1?s.tdotOn:''}`} style={{background:`linear-gradient(135deg,${t.c1},${t.c2})`}} title={t.name} onClick={()=>setTheme(t)}/>
                    ))}
                  </div>
                  <div className={s.lsep}/>
                  <div className={s.lsec}>애니메이션</div>
                  <div className={s.animGrid}>
                    {[
                      {i:0, label:'↑ 슬라이드', emoji:'⬆️'},
                      {i:1, label:'◎ 블러페이드', emoji:'🌫️'},
                      {i:2, label:'⟲ 플립X', emoji:'🔄'},
                      {i:3, label:'↔ 플립Y', emoji:'🃏'},
                      {i:4, label:'⊕ 줌인', emoji:'🔍'},
                      {i:5, label:'→ 슬라이드LR', emoji:'➡️'},
                      {i:6, label:'↗ 바운스', emoji:'🏀'},
                      {i:7, label:'↺ 회전줌', emoji:'🌀'},
                      {i:8, label:'⚡ 글리치', emoji:'⚡'},
                      {i:9, label:'▽ 언폴드', emoji:'📂'},
                    ].map(({i, label, emoji})=>(
                      <button key={i} className={`${s.animCard} ${settings.animType===i?s.animCardOn:''}`} onClick={()=>setSetting('animType',i)}>
                        <span className={s.animEmoji}>{emoji}</span>
                        <span className={s.animLabel}>{label}</span>
                      </button>
                    ))}
                  </div>
                </>}

                {designTab === 1 && <>
                  <div className={s.lsec}>폰트 선택</div>
                  <div className={s.fontGrid}>
                    {FONTS.map(f=>(
                      <div key={f.value} className={`${s.fontCard} ${settings.fontFamily===f.value?s.fontCardOn:''}`} onClick={()=>setSetting('fontFamily',f.value)}>
                        <span style={{fontFamily:f.value,fontSize:20}}>{f.preview||'가나다'}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </>}
              </>
            )}

            {/* ── 탭 2: 설정 ── */}
            {activeTab === 2 && (
              <>
                <div className={s.lsec}>시작 화면</div>
                <ToggleRow label="시작 화면 사용" val={settings.useStart} onChange={v => setSetting('useStart', v)} light={isLight} />
                {settings.useStart && (
                  <>
                    <SetRow label="태그 텍스트" light={isLight}>
                      <input className={s.inp} value={settings.startTag} onChange={e => setSetting('startTag', e.target.value)} placeholder="✦ Form" />
                    </SetRow>
                    <SetRow label="소개 설명" light={isLight}>
                      <input className={s.inp} value={settings.startDesc} onChange={e => setSetting('startDesc', e.target.value)} placeholder="폼 소개..." />
                    </SetRow>
                    <SetRow label="시작 버튼 텍스트" light={isLight}>
                      <input className={s.inp} value={settings.startBtnText} onChange={e => setSetting('startBtnText', e.target.value)} placeholder="시작하기" />
                    </SetRow>
                    <SetRow label="커버 이미지" light={isLight}>
                      <label className={s.fileBtn}>📷 이미지 선택<input type="file" accept="image/*" style={{display:'none'}} onChange={onCoverImg}/></label>
                      {coverImgData && <button className={s.fileDelBtn} onClick={()=>setCoverImgData(null)}>✕ 제거</button>}
                    </SetRow>
                  </>
                )}

                <div className={s.lsep}/>
                <div className={s.lsec}>폼 동작</div>
                <ToggleRow label="이전 버튼" val={settings.allowBack} onChange={v => setSetting('allowBack', v)} light={isLight} />
                <ToggleRow label="자동 다음" val={settings.autoNext} onChange={v => setSetting('autoNext', v)} light={isLight} />
                <ToggleRow label="Confetti 효과" val={settings.useConfetti} onChange={v => setSetting('useConfetti', v)} light={isLight} />
                <ToggleRow label="키보드 단축키" val={settings.useKb} onChange={v => setSetting('useKb', v)} light={isLight} />
                <div className={s.lsep}/>
                <div className={s.lsec}>완료 화면</div>
                <SetRow label="완료 제목" light={isLight}>
                  <input className={s.inp} value={settings.doneTitle} onChange={e => setSetting('doneTitle', e.target.value)} placeholder="제출 완료!" />
                </SetRow>
                <SetRow label="완료 설명" light={isLight}>
                  <input className={s.inp} value={settings.doneDesc} onChange={e => setSetting('doneDesc', e.target.value)} placeholder="감사합니다" />
                </SetRow>
                <SetRow label="CTA 버튼" light={isLight}>
                  <input className={s.inp} value={settings.doneCta} onChange={e => setSetting('doneCta', e.target.value)} placeholder="버튼 텍스트" />
                </SetRow>
                <SetRow label="CTA URL" light={isLight}>
                  <input className={s.inp} value={settings.doneUrl} onChange={e => setSetting('doneUrl', e.target.value)} placeholder="https://" />
                </SetRow>
                <div className={s.lsep}/>
                <div className={s.lsec}>구글 시트 연동</div>
                <SetRow label="Apps Script URL" light={isLight}>
                  <input className={s.inp} value={settings.scriptUrl} onChange={e => setSetting('scriptUrl', e.target.value)} placeholder="https://script.google.com/..." />
                </SetRow>
                <div className={s.lsep}/>
                <button className="btn btn-ghost btn-sm" style={{width:'100%', marginTop:4}} onClick={() => setShowExport(true)}>📥 HTML 내보내기</button>
              </>
            )}
          </div>
        </div>

        {/* ── 에디터 영역 ── */}
        <div className={s.editor}>
          <div className={s.editorInner}>

            {/* 시작화면 카드 */}
            {settings.useStart && (
              <div className={s.startCard}>
                {coverImgData
                  ? <div className={s.startCoverWrap}><img src={coverImgData} className={s.startCoverImg} alt="" /><button className={s.startCoverDel} onClick={() => setCoverImgData(null)}>✕ 제거</button></div>
                  : <label className={s.startCoverPlaceholder}>🖼️ 커버 이미지 업로드 (선택)<input type="file" accept="image/*" style={{display:'none'}} onChange={onCoverImg}/></label>
                }
                <div className={s.startBody}>
                  <input className={s.startTagEdit} value={settings.startTag} onChange={e => setSetting('startTag', e.target.value)} placeholder="✦ Form" />
                  <div className={s.startTitlePreview}>{title || '폼 제목'}</div>
                  <input className={s.startDescEdit} value={settings.startDesc} onChange={e => setSetting('startDesc', e.target.value)} placeholder="소개 문구 입력 (선택)..." />
                  <div className={s.startBtnWrap}>
                    <input className={s.startBtnEdit} value={settings.startBtnText} onChange={e => setSetting('startBtnText', e.target.value)} placeholder="시작하기" />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </div>
                </div>
              </div>
            )}

            {questions.length === 0 && (
              <div className={s.empty}>
                <div className={s.emptyIco}>✦</div>
                <p>왼쪽 <strong>질문</strong> 탭에서 타입을 클릭해 추가하세요.</p>
                <div className={s.quickAdd}>
                  {Object.entries(TYPE_LABELS).map(([type, label]) => (
                    <button key={type} className={s.quickAddBtn} onClick={() => addQ(type)}>{TYPE_ICONS[type]} {label}</button>
                  ))}
                </div>
              </div>
            )}

            {questions.map((q, idx) => (
              <div key={q.id} data-qid={q.id} className={`${s.qcard} ${dragSrc === q.id ? s.dragging : ''}`}
                draggable onDragStart={() => setDragSrc(q.id)} onDragEnd={() => setDragSrc(null)}
                onDragOver={e => e.preventDefault()} onDrop={() => onDrop(q.id)}
              >
                {qImgData[q.id] && (
                  <div className={s.qImgWrap}>
                    <img src={qImgData[q.id]} className={s.qImgEl} alt="" />
                    <button className={s.qImgDel} onClick={() => setQImgData(prev => { const n={...prev}; delete n[q.id]; return n })}>✕</button>
                  </div>
                )}

                <div className={s.qTop}>
                  <div className={s.dragH} title="드래그해서 순서 변경">⠿</div>
                  <span className={s.qBadge}>Q{idx + 1}</span>
                  <span className={s.qTag}>{TYPE_ICONS[q.type]} {TYPE_LABELS[q.type]}</span>
                  <div className={s.qActs}>
                    {idx > 0 && <button className={s.ib} onClick={() => moveQ(q.id, -1)} title="위로">↑</button>}
                    {idx < questions.length - 1 && <button className={s.ib} onClick={() => moveQ(q.id, 1)} title="아래로">↓</button>}
                    <button className={`${s.ib} ${s.ibDup}`} onClick={() => { const nq = { ...q, id: nid() }; setQuestions(prev => { const arr = [...prev]; arr.splice(idx+1, 0, nq); return arr }) }} title="복제">⧉</button>
                    <button className={`${s.ib} ${s.ibDel}`} onClick={() => delQ(q.id)} title="삭제">✕</button>
                  </div>
                </div>

                <input className={s.qLabelInp} value={q.label} placeholder="질문을 입력하세요..." onChange={e => updQ(q.id, 'label', e.target.value)} />
                <input className={s.qHintInp} value={q.hint} placeholder="설명 추가 (선택)" onChange={e => updQ(q.id, 'hint', e.target.value)} />

                <div className={s.qPrev}>
                  {q.type === 'short' && <div className={s.fk}>답변을 입력하세요...</div>}
                  {q.type === 'long' && <div className={s.fk} style={{height:64,lineHeight:'1.6'}}>장문 답변...</div>}
                  {q.type === 'phone' && <div className={s.fk}>🇰🇷 +82 &nbsp; 010-0000-0000</div>}
                  {q.type === 'email' && <div className={s.fk}>example@email.com</div>}
                  {(q.type === 'multiple' || q.type === 'single') && (
                    <div className={s.optsList}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={s.optRow}>
                          <div className={`${s.optCb} ${q.type === 'single' ? s.optCbRound : ''}`} />
                          <input className={s.optInp} value={opt} placeholder={`옵션 ${oi + 1}`} onChange={e => updOpt(q.id, oi, e.target.value)} />
                          <button className={s.optDel} onClick={() => delOpt(q.id, oi)}>✕</button>
                        </div>
                      ))}
                      {q.other && (
                        <div className={s.optRow}>
                          <div className={`${s.optCb} ${q.type === 'single' ? s.optCbRound : ''}`} />
                          <div className={s.fk} style={{flex:1,padding:'6px 10px',fontSize:13}}>기타...</div>
                        </div>
                      )}
                      <button className={s.addOptBtn} onClick={() => addOpt(q.id)}>+ 옵션 추가</button>
                    </div>
                  )}
                  {q.type === 'legal' && (
                    <>
                      <textarea className={s.legalTa} value={q.legalText} placeholder="동의 내용 입력..." onChange={e => updQ(q.id, 'legalText', e.target.value)} />
                      <div className={s.fk} style={{fontSize:12,display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:15,height:15,borderRadius:4,border:'1.5px solid rgba(255,255,255,.15)',flexShrink:0}}></div>
                        위 내용에 동의합니다.
                      </div>
                    </>
                  )}
                </div>

                <div className={s.qFoot}>
                  <ToggleInline label="필수" val={q.required} onChange={v => updQ(q.id, 'required', v)} light={isLight} />
                  {(q.type === 'multiple' || q.type === 'single') && (
                    <ToggleInline label="기타 입력" val={q.other} onChange={v => updQ(q.id, 'other', v)} light={isLight} />
                  )}
                  <label className={s.qImgAdd}>🖼️ 이미지<input type="file" accept="image/*" style={{display:'none'}} onChange={e => onQImg(e, q.id)} /></label>
                </div>
              </div>
            ))}

            {questions.length > 0 && (
              <div className={s.addCardRow}>
                {Object.entries(TYPE_LABELS).map(([type, label]) => (
                  <button key={type} className={s.addTypeBtn} onClick={() => addQ(type)}>{TYPE_ICONS[type]} {label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 미리보기 패널 ── */}
        <div className={s.rpanel}>
          <div className={s.rpHead}>
            <span className={s.rpTitle}>미리보기</span>
            <div className={s.pvModeToggle}>
              <button className={`${s.pvModeBtn} ${pvMode==='mobile'?s.pvModeBtnOn:''}`} onClick={()=>setPvMode('mobile')}>📱</button>
              <button className={`${s.pvModeBtn} ${pvMode==='desktop'?s.pvModeBtnOn:''}`} onClick={()=>setPvMode('desktop')}>🖥️</button>
            </div>
            <button className={s.pvOpenBtn} onClick={() => { const w = window.open('','_blank'); w.document.write(genHTML()); w.document.close() }} title="새 탭에서 열기">↗</button>
          </div>
          <div className={s.pvWrap}>
            <div className={`${s.pvFrame} ${pvMode==='mobile'?s.pvFrameMobile:s.pvFrameDesktop}`}>
              <iframe ref={pvRef} className={s.pvIframe} sandbox="allow-scripts" title="미리보기" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 발행 완료 모달 ── */}
      {showPublishModal && (
        <div className={s.modalBg} onClick={() => setShowPublishModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalIco}>🎉</div>
            <h3>발행 완료!</h3>
            <p>폼이 공개되었어요. 아래 링크로 공유하세요!</p>
            <div className={s.shareBox}>
              <input className={s.shareInp} value={shareUrl} readOnly />
              <button className="btn btn-primary btn-sm" onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('✅ 링크 복사!', 'ok') }}>복사</button>
            </div>
            <div className={s.mFoot}>
              <button className="btn btn-ghost" onClick={() => setShowPublishModal(false)}>닫기</button>
              <button className="btn btn-ghost" onClick={() => window.open(shareUrl, '_blank')}>🔗 링크 열기</button>
              <button className="btn btn-primary" onClick={() => { navigate(`/responses/${currentFormId}`) }}>📊 응답 보기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 구글 시트 연동 모달 ── */}
      {showSheetModal && (
        <div className={s.modalBg} onClick={() => setShowSheetModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalIco}>📗</div>
            <h3>구글 시트 연동하시겠어요?</h3>
            <p>지금 연결하면 응답이 제출될 때마다<br/>구글 시트에 자동으로 저장돼요!</p>
            <div className={s.sheetModalBenefits}>
              <div className={s.sheetBenefit}>✅ 응답 자동 저장</div>
              <div className={s.sheetBenefit}>✅ 실시간 데이터 확인</div>
              <div className={s.sheetBenefit}>✅ 시트 공유 가능</div>
            </div>
            <div className={s.mFoot}>
              <button className="btn btn-ghost" onClick={() => setShowSheetModal(false)}>나중에</button>
              <button className="btn btn-primary" onClick={handleSheetConnect} disabled={sheetConnecting}>
                {sheetConnecting ? '⏳ 연결 중...' : '📗 구글 시트 연결하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HTML 내보내기 모달 ── */}}
      {showExport && (
        <div className={s.modalBg} onClick={() => setShowExport(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <h3>📥 HTML 내보내기</h3>
            <p>코드를 복사하거나 파일로 다운로드하세요.</p>
            <pre className={s.codeBox}>{genHTML().slice(0, 500)}...</pre>
            <div className={s.mFoot}>
              <button className="btn btn-ghost" onClick={() => setShowExport(false)}>닫기</button>
              <button className="btn btn-ghost" onClick={() => { navigator.clipboard.writeText(genHTML()); showToast('✅ 복사!', 'ok') }}>코드 복사</button>
              <button className="btn btn-primary" onClick={() => { const a = document.createElement('a'); a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(genHTML()); a.download = (title||'form') + '.html'; a.click() }}>⬇ 다운로드</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

function ToggleRow({ label, val, onChange, light }) {
  const muted = light ? '#6b7280' : '#9997ab'
  const bg = val ? '#7c6cfc' : (light ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)')
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 2px'}}>
      <span style={{fontSize:12,color:muted}}>{label}</span>
      <button onClick={() => onChange(!val)} style={{position:'relative',width:28,height:16,background:bg,borderRadius:99,border:'none',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
        <div style={{position:'absolute',top:2.5,left:val?12:2.5,width:11,height:11,background:'#fff',borderRadius:'50%',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}} />
      </button>
    </div>
  )
}

function ToggleInline({ label, val, onChange, light }) {
  const bg = val ? '#7c6cfc' : (light ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)')
  const color = light ? '#6b7280' : '#7a788f'
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}} onClick={() => onChange(!val)}>
      <button style={{position:'relative',width:24,height:14,background:bg,borderRadius:99,border:'none',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
        <div style={{position:'absolute',top:1.5,left:val?10:1.5,width:11,height:11,background:'#fff',borderRadius:'50%',transition:'left .2s'}} />
      </button>
      <span style={{fontSize:11,color,fontWeight:300}}>{label}</span>
    </div>
  )
}

function SetRow({ label, children, light }) {
  const color = light ? '#6b7280' : '#7a788f'
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4,padding:'3px 0'}}>
      <span style={{fontSize:11,color,fontWeight:500}}>{label}</span>
      {children}
    </div>
  )
}
