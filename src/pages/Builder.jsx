import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getForm, saveForm } from '../lib/supabase'
import { generateFormHTML } from '../lib/generateHTML'
import s from './Builder.module.css'

// ── 상수 ──
const TYPE_LABELS = { short:'단답형', long:'장문형', multiple:'객관식', single:'단일선택', phone:'전화번호', email:'이메일', legal:'동의' }
const THEMES = [
  { c1:'#7c6cfc', c2:'#c084fc' }, { c1:'#EE4037', c2:'#ff7043' },
  { c1:'#0ea5e9', c2:'#38bdf8' }, { c1:'#10b981', c2:'#34d399' },
  { c1:'#f59e0b', c2:'#fbbf24' }, { c1:'#ec4899', c2:'#f472b6' },
  { c1:'#8b5cf6', c2:'#06b6d4' }, { c1:'#64748b', c2:'#94a3b8' },
  { c1:'#f97316', c2:'#fb923c' }, { c1:'#6366f1', c2:'#a78bfa' },
]
const FONTS = [
  { label:'Noto Sans KR (기본)', value:"'Noto Sans KR',sans-serif" },
  { label:'Gmarket Sans', value:"'Gmarket Sans',sans-serif" },
  { label:'Gowun Dodum', value:"'Gowun Dodum',sans-serif" },
]
let UID = 0
const nid = () => ++UID

// ── 기본 설정 ──
const DEFAULT_SETTINGS = {
  animType: 0,
  fontFamily: "'Noto Sans KR',sans-serif",
  useStart: true,
  useLoading: true,
  loadingDelay: 1800,
  loadingText: '로딩 중',
  allowBack: true,
  autoNext: false,
  useConfetti: true,
  useKb: true,
  startTag: '✦ Form',
  startBtnText: '시작하기',
  startDesc: '',
  doneTitle: '제출 완료!',
  doneDesc: '응답해주셔서 감사합니다 🎉',
  doneCta: '',
  doneUrl: '',
  scriptUrl: '',
}

export default function Builder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formId } = useParams()

  const [title, setTitle] = useState('이벤트 참가 신청서')
  const [questions, setQuestions] = useState([])
  const [theme, setTheme] = useState(THEMES[0])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [coverImgData, setCoverImgData] = useState(null)
  const [qImgData, setQImgData] = useState({})
  const [saving, setSaving] = useState(false)
  const [currentFormId, setCurrentFormId] = useState(null)
  const [toast, setToast] = useState(null)
  const [dragSrc, setDragSrc] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0=질문 1=디자인 2=설정
  const pvRef = useRef(null)
  const pvTimer = useRef(null)

  // 폼 불러오기
  useEffect(() => {
    if (!formId) return
    getForm(formId).then(form => {
      setTitle(form.title)
      setTheme({ c1: form.theme_c1, c2: form.theme_c2 })
      setQuestions(form.questions || [])
      setSettings(prev => ({ ...prev, ...(form.settings || {}) }))
      setCurrentFormId(form.id)
    }).catch(() => showToast('폼을 불러올 수 없습니다.', 'fail'))
  }, [formId])

  // 미리보기
  const updatePreview = useCallback(() => {
    if (!pvRef.current) return
    pvRef.current.srcdoc = generateFormHTML(title, questions, theme, settings, { coverImgData, qImgData })
  }, [title, questions, theme, settings, coverImgData, qImgData])

  useEffect(() => {
    clearTimeout(pvTimer.current)
    pvTimer.current = setTimeout(updatePreview, 300)
  }, [updatePreview])

  // 저장
  async function handleSave() {
    setSaving(true)
    try {
      const saved = await saveForm(user.id, {
        id: currentFormId, title, theme, questions, settings,
      })
      setCurrentFormId(saved.id)
      showToast('✅ 저장되었습니다!', 'ok')
      if (!formId) navigate(`/builder/${saved.id}`, { replace: true })
    } catch {
      showToast('저장 중 오류가 발생했습니다.', 'fail')
    } finally {
      setSaving(false)
    }
  }

  // 질문 CRUD
  function addQ(type) {
    const q = {
      id: nid(), type, label: '', hint: '', required: true, other: false,
      options: (type === 'multiple' || type === 'single') ? ['옵션 1', '옵션 2'] : [],
      legalText: type === 'legal' ? '[개인정보 수집 및 이용 안내]\n\n수집 항목: 성명, 연락처\n수집 목적: 서비스 안내\n보유 기간: 30일' : '',
    }
    setQuestions(prev => [...prev, q])
  }

  function updQ(id, key, val) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [key]: val } : q))
  }

  function delQ(id) {
    setQuestions(prev => prev.filter(q => q.id !== id))
    setQImgData(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function moveQ(id, dir) {
    setQuestions(prev => {
      const arr = [...prev]
      const i = arr.findIndex(q => q.id === id)
      const ni = i + dir
      if (ni < 0 || ni >= arr.length) return arr
      ;[arr[i], arr[ni]] = [arr[ni], arr[i]]
      return arr
    })
  }

  function addOpt(id) {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, options: [...q.options, `옵션 ${q.options.length + 1}`] } : q
    ))
  }

  function updOpt(id, oi, val) {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, options: q.options.map((o, i) => i === oi ? val : o) } : q
    ))
  }

  function delOpt(id, oi) {
    setQuestions(prev => prev.map(q =>
      q.id === id && q.options.length > 1 ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q
    ))
  }

  // 드래그
  function onDrop(targetId) {
    if (!dragSrc || dragSrc === targetId) return
    setQuestions(prev => {
      const arr = [...prev]
      const fi = arr.findIndex(q => q.id === dragSrc)
      const ti = arr.findIndex(q => q.id === targetId)
      const [item] = arr.splice(fi, 1)
      arr.splice(ti, 0, item)
      return arr
    })
    setDragSrc(null)
  }

  // 이미지
  function onCoverImg(e) {
    const f = e.target.files[0]; if (!f) return
    const r = new FileReader()
    r.onload = ev => setCoverImgData(ev.target.result)
    r.readAsDataURL(f)
  }

  function onQImg(e, id) {
    const f = e.target.files[0]; if (!f) return
    const r = new FileReader()
    r.onload = ev => setQImgData(prev => ({ ...prev, [id]: ev.target.result }))
    r.readAsDataURL(f)
  }

  function setSetting(key, val) {
    setSettings(prev => ({ ...prev, [key]: val }))
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const genHTML = () => generateFormHTML(title, questions, theme, settings, { coverImgData, qImgData })

  return (
    <div className={s.wrap}>

      {/* ── 상단바 ── */}
      <div className={s.topbar}>
        <div className={s.tbLogo} onClick={() => navigate('/dashboard')}>
          <div className={s.tbMark}>✦</div>
          <span className={s.tbText}>폼 빌더</span>
        </div>
        <input
          className={s.titleInp}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="폼 제목"
        />
        <div className={s.tbRight}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>← 대시보드</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { const w = window.open('','_blank'); w.document.write(genHTML()); w.document.close() }}>미리보기</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowExport(true)}>HTML 받기</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '💾 저장'}
          </button>
        </div>
      </div>

      <div className={s.workspace}>

        {/* ── 왼쪽 패널 ── */}
        <div className={s.lpanel}>
          {/* 탭 */}
          <div className={s.tabs}>
            {['질문', '디자인', '설정'].map((t, i) => (
              <button key={t} className={`${s.tab} ${activeTab === i ? s.tabOn : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
            ))}
          </div>

          <div className={s.lbody}>

            {/* 탭 0: 질문 추가 */}
            {activeTab === 0 && (
              <>
                <div className={s.lsec}>질문 추가</div>
                {[
                  { type:'short', ico:'📝', label:'단답형', sub:'짧은 텍스트' },
                  { type:'long', ico:'📄', label:'장문형', sub:'긴 텍스트' },
                  { type:'multiple', ico:'☑️', label:'객관식', sub:'복수 선택' },
                  { type:'single', ico:'🔘', label:'단일 선택', sub:'하나만' },
                  { type:'phone', ico:'📱', label:'전화번호', sub:'번호 입력' },
                  { type:'email', ico:'✉️', label:'이메일', sub:'이메일 입력' },
                  { type:'legal', ico:'✅', label:'동의', sub:'개인정보 등' },
                ].map(t => (
                  <div key={t.type} className={s.typeRow} onClick={() => addQ(t.type)}>
                    <div className={s.typeIco}>{t.ico}</div>
                    <div><strong>{t.label}</strong><span>{t.sub}</span></div>
                  </div>
                ))}
              </>
            )}

            {/* 탭 1: 디자인 */}
            {activeTab === 1 && (
              <>
                <div className={s.lsec}>테마 색상</div>
                <div className={s.themeGrid}>
                  {THEMES.map((t, i) => (
                    <div
                      key={i}
                      className={`${s.tdot} ${theme.c1 === t.c1 ? s.tdotOn : ''}`}
                      style={{ background: `linear-gradient(135deg,${t.c1},${t.c2})` }}
                      onClick={() => setTheme(t)}
                    />
                  ))}
                </div>

                <div className={s.lsep} />
                <div className={s.lsec}>전환 애니메이션</div>
                <div className={s.animBtns}>
                  {['슬라이드', '페이드', '플립'].map((label, i) => (
                    <button
                      key={i}
                      className={`${s.animBtn} ${settings.animType === i ? s.animBtnOn : ''}`}
                      onClick={() => setSetting('animType', i)}
                    >{label}</button>
                  ))}
                </div>

                <div className={s.lsep} />
                <div className={s.lsec}>폰트</div>
                <select className={s.sel} value={settings.fontFamily} onChange={e => setSetting('fontFamily', e.target.value)}>
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </>
            )}

            {/* 탭 2: 설정 */}
            {activeTab === 2 && (
              <>
                <div className={s.lsec}>시작 화면</div>
                <ToggleRow label="시작 화면 사용" val={settings.useStart} onChange={v => setSetting('useStart', v)} />
                {settings.useStart && (
                  <>
                    <SetRow label="태그 텍스트">
                      <input className={s.inp} value={settings.startTag} onChange={e => setSetting('startTag', e.target.value)} placeholder="✦ Form" />
                    </SetRow>
                    <SetRow label="소개 설명">
                      <input className={s.inp} value={settings.startDesc} onChange={e => setSetting('startDesc', e.target.value)} placeholder="폼 소개..." />
                    </SetRow>
                    <SetRow label="시작 버튼 텍스트">
                      <input className={s.inp} value={settings.startBtnText} onChange={e => setSetting('startBtnText', e.target.value)} placeholder="시작하기" />
                    </SetRow>
                    <SetRow label="커버 이미지">
                      <label className={s.fileBtn}>
                        {coverImgData ? '✅ 이미지 등록됨' : '🖼️ 이미지 업로드'}
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverImg} />
                      </label>
                      {coverImgData && <button className={s.delImgBtn} onClick={() => setCoverImgData(null)}>제거</button>}
                    </SetRow>
                  </>
                )}

                <div className={s.lsep} />
                <div className={s.lsec}>로딩 화면</div>
                <ToggleRow label="로딩 화면 사용" val={settings.useLoading} onChange={v => setSetting('useLoading', v)} />
                {settings.useLoading && (
                  <>
                    <SetRow label="로딩 텍스트">
                      <input className={s.inp} value={settings.loadingText} onChange={e => setSetting('loadingText', e.target.value)} />
                    </SetRow>
                    <SetRow label="로딩 시간">
                      <select className={s.sel} value={settings.loadingDelay} onChange={e => setSetting('loadingDelay', Number(e.target.value))}>
                        <option value={1000}>1초</option>
                        <option value={1800}>1.8초</option>
                        <option value={2500}>2.5초</option>
                        <option value={3500}>3.5초</option>
                      </select>
                    </SetRow>
                  </>
                )}

                <div className={s.lsep} />
                <div className={s.lsec}>폼 동작</div>
                <ToggleRow label="이전 버튼 허용" val={settings.allowBack} onChange={v => setSetting('allowBack', v)} />
                <ToggleRow label="자동 다음 이동" val={settings.autoNext} onChange={v => setSetting('autoNext', v)} />
                <ToggleRow label="Confetti 효과" val={settings.useConfetti} onChange={v => setSetting('useConfetti', v)} />
                <ToggleRow label="키보드 단축키" val={settings.useKb} onChange={v => setSetting('useKb', v)} />

                <div className={s.lsep} />
                <div className={s.lsec}>완료 화면</div>
                <SetRow label="완료 제목">
                  <input className={s.inp} value={settings.doneTitle} onChange={e => setSetting('doneTitle', e.target.value)} />
                </SetRow>
                <SetRow label="완료 설명">
                  <textarea className={`${s.inp} ${s.ta}`} value={settings.doneDesc} onChange={e => setSetting('doneDesc', e.target.value)} />
                </SetRow>
                <SetRow label="CTA 버튼 텍스트">
                  <input className={s.inp} value={settings.doneCta} onChange={e => setSetting('doneCta', e.target.value)} placeholder="예) 홈으로" />
                </SetRow>
                <SetRow label="CTA URL">
                  <input className={s.inp} value={settings.doneUrl} onChange={e => setSetting('doneUrl', e.target.value)} placeholder="https://" />
                </SetRow>

                <div className={s.lsep} />
                <div className={s.lsec}>구글 시트 연동</div>
                <SetRow label="Apps Script URL">
                  <input className={s.inp} value={settings.scriptUrl} onChange={e => setSetting('scriptUrl', e.target.value)} placeholder="https://script.google.com/..." />
                </SetRow>
              </>
            )}

          </div>
        </div>

        {/* ── 에디터 ── */}
        <div className={s.editor}>

          {/* 시작화면 카드 */}
          {settings.useStart && (
            <div className={s.startCard}>
              {coverImgData && (
                <img src={coverImgData} className={s.startCoverImg} alt="" />
              )}
              {!coverImgData && (
                <label className={s.startCoverPlaceholder}>
                  🖼️ 커버 이미지 업로드 (선택)
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverImg} />
                </label>
              )}
              <div className={s.startBody}>
                <div className={s.startTag}>{settings.startTag || '✦ Form'}</div>
                <div className={s.startTitle}>{title || '폼 제목'}</div>
                {settings.startDesc && <div className={s.startDesc}>{settings.startDesc}</div>}
                <div className={s.startBtn}>
                  {settings.startBtnText || '시작하기'}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>
              </div>
            </div>
          )}

          {/* 빈 상태 */}
          {questions.length === 0 && (
            <div className={s.empty}>
              <div className={s.emptyIco}>✦</div>
              <p>왼쪽 <strong>질문</strong> 탭에서 타입을 클릭해 추가하세요.</p>
            </div>
          )}

          {/* 질문 카드들 */}
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`${s.qcard} ${dragSrc === q.id ? s.dragging : ''}`}
              draggable
              onDragStart={() => setDragSrc(q.id)}
              onDragEnd={() => setDragSrc(null)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(q.id)}
            >
              {/* 질문 이미지 */}
              {qImgData[q.id] && (
                <div className={s.qImgWrap}>
                  <img src={qImgData[q.id]} className={s.qImgEl} alt="" />
                  <button className={s.qImgDel} onClick={() => setQImgData(prev => { const n={...prev}; delete n[q.id]; return n })}>✕</button>
                </div>
              )}

              {/* 상단 행 */}
              <div className={s.qTop}>
                <div className={s.dragH}>⠿</div>
                <span className={s.qBadge}>Q{idx + 1}</span>
                <span className={s.qTag}>{TYPE_LABELS[q.type]}</span>
                <div className={s.qActs}>
                  {idx > 0 && <button className={s.ib} onClick={() => moveQ(q.id, -1)}>↑</button>}
                  {idx < questions.length - 1 && <button className={s.ib} onClick={() => moveQ(q.id, 1)}>↓</button>}
                  <button className={`${s.ib} ${s.ibDel}`} onClick={() => delQ(q.id)}>✕</button>
                </div>
              </div>

              {/* 질문 텍스트 */}
              <input
                className={s.qLabelInp}
                value={q.label}
                placeholder="질문을 입력하세요..."
                onChange={e => updQ(q.id, 'label', e.target.value)}
              />
              <input
                className={s.qHintInp}
                value={q.hint}
                placeholder="설명 추가 (선택)"
                onChange={e => updQ(q.id, 'hint', e.target.value)}
              />

              {/* 타입별 프리뷰 */}
              <div className={s.qPrev}>
                {(q.type === 'short') && <div className={s.fk}>답변을 입력하세요...</div>}
                {(q.type === 'long') && <div className={s.fk} style={{ height: 64, lineHeight: '1.6' }}>장문 답변...</div>}
                {(q.type === 'phone') && <div className={s.fk}>🇰🇷 +82 &nbsp; 010-0000-0000</div>}
                {(q.type === 'email') && <div className={s.fk}>example@email.com</div>}
                {(q.type === 'multiple' || q.type === 'single') && (
                  <div className={s.optsList}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={s.optRow}>
                        <div className={`${s.optCb} ${q.type === 'single' ? s.optCbRound : ''}`} />
                        <input
                          className={s.optInp}
                          value={opt}
                          placeholder={`옵션 ${oi + 1}`}
                          onChange={e => updOpt(q.id, oi, e.target.value)}
                        />
                        <button className={s.optDel} onClick={() => delOpt(q.id, oi)}>✕</button>
                      </div>
                    ))}
                    {q.other && (
                      <div className={s.optRow}>
                        <div className={`${s.optCb} ${q.type === 'single' ? s.optCbRound : ''}`} />
                        <div className={s.fk} style={{ flex: 1, padding: '6px 10px', fontSize: 13 }}>기타...</div>
                      </div>
                    )}
                    <button className={s.addOptBtn} onClick={() => addOpt(q.id)}>+ 옵션 추가</button>
                  </div>
                )}
                {q.type === 'legal' && (
                  <>
                    <textarea
                      className={s.legalTa}
                      value={q.legalText}
                      placeholder="동의 내용 입력..."
                      onChange={e => updQ(q.id, 'legalText', e.target.value)}
                    />
                    <div className={s.fk} style={{ fontSize: 12, display:'flex', alignItems:'center', gap: 8 }}>
                      <div style={{ width:15, height:15, borderRadius:4, border:'1.5px solid rgba(255,255,255,.15)', flexShrink:0 }}></div>
                      위 내용에 동의합니다.
                    </div>
                  </>
                )}
              </div>

              {/* 하단 설정 행 */}
              <div className={s.qFoot}>
                <ToggleInline label="필수" val={q.required} onChange={v => updQ(q.id, 'required', v)} />
                {(q.type === 'multiple' || q.type === 'single') && (
                  <ToggleInline label="기타 입력" val={q.other} onChange={v => updQ(q.id, 'other', v)} />
                )}
                <label className={s.qImgAdd}>
                  🖼️ 이미지
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => onQImg(e, q.id)} />
                </label>
              </div>
            </div>
          ))}

          {questions.length > 0 && (
            <button className={s.addCard} onClick={() => addQ('short')}>+ 질문 추가</button>
          )}
        </div>

        {/* ── 미리보기 ── */}
        <div className={s.rpanel}>
          <div className={s.rpHead}>
            <span>실시간 미리보기</span>
          </div>
          <div className={s.pvWrap}>
            <iframe ref={pvRef} className={s.pvIframe} sandbox="allow-scripts" />
          </div>
        </div>

      </div>

      {/* ── 내보내기 모달 ── */}
      {showExport && (
        <div className={s.modalBg} onClick={() => setShowExport(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <h3>🎉 HTML 내보내기</h3>
            <p>코드를 복사하거나 파일로 다운로드하세요.<br />Apps Script URL을 입력하면 구글 시트 연동까지!</p>
            <pre className={s.codeBox}>{genHTML().slice(0, 600)}...</pre>
            <div className={s.mFoot}>
              <button className="btn btn-ghost" onClick={() => setShowExport(false)}>닫기</button>
              <button className="btn btn-ghost" onClick={() => {
                navigator.clipboard.writeText(genHTML())
                showToast('✅ 복사 완료!', 'ok')
              }}>코드 복사</button>
              <button className="btn btn-primary" onClick={() => {
                const a = document.createElement('a')
                a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(genHTML())
                a.download = title.replace(/\s+/g, '-') + '.html'
                a.click()
                showToast('✅ 다운로드 완료!', 'ok')
              }}>HTML 다운로드</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

// ── 서브 컴포넌트 ──
function ToggleRow({ label, val, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 2px' }}>
      <span style={{ fontSize:12, color:'#9997ab' }}>{label}</span>
      <button
        onClick={() => onChange(!val)}
        style={{ position:'relative', width:26, height:15, background:val?'#7c6cfc':'rgba(255,255,255,.1)', borderRadius:99, border:'none', cursor:'pointer', transition:'background .2s', flexShrink:0 }}
      >
        <div style={{ position:'absolute', top:2, left: val?11:2, width:11, height:11, background:'#fff', borderRadius:'50%', transition:'left .2s' }} />
      </button>
    </div>
  )
}

function ToggleInline({ label, val, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }} onClick={() => onChange(!val)}>
      <button
        style={{ position:'relative', width:24, height:14, background:val?'#7c6cfc':'rgba(255,255,255,.1)', borderRadius:99, border:'none', cursor:'pointer', transition:'background .2s', flexShrink:0 }}
      >
        <div style={{ position:'absolute', top:1.5, left: val?10:1.5, width:11, height:11, background:'#fff', borderRadius:'50%', transition:'left .2s' }} />
      </button>
      <span style={{ fontSize:11, color:'#7a788f', fontWeight:300 }}>{label}</span>
    </div>
  )
}

function SetRow({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, padding:'2px 0' }}>
      <span style={{ fontSize:11, color:'#7a788f' }}>{label}</span>
      {children}
    </div>
  )
}
