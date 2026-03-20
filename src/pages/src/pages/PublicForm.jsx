import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getFormBySlug, submitResponse } from '../lib/supabase'
import { generateFormHTML } from '../lib/generateHTML'
import styles from './PublicForm.module.css'

export default function PublicForm() {
  const { slug } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    getFormBySlug(slug)
      .then(setForm)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  // iframe에서 postMessage 수신 → Supabase 저장
  useEffect(() => {
    if (!form) return
    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          await submitResponse(form.id, event.data.answers)
        } catch (err) {
          console.error('응답 저장 실패:', err)
          // 실패 알림을 iframe에 전달
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*')
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [form])

  if (loading) return (
    <div className={styles.center}>
      <div className={styles.spinner}></div>
    </div>
  )

  if (notFound) return (
    <div className={styles.center}>
      <div className={styles.notFound}>
        <div className={styles.ico}>✦</div>
        <h2>폼을 찾을 수 없습니다</h2>
        <p>링크가 잘못되었거나 비공개 상태예요.</p>
      </div>
    </div>
  )

  // HTML 생성 후 fetch → postMessage 로 교체
  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    form.settings || {},
    {}
  )
  html = html.replace(
    `await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});`,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  )

  return (
    <div className={styles.wrap}>
      <iframe
        ref={iframeRef}
        className={styles.iframe}
        srcDoc={html}
        sandbox="allow-scripts"
        title={form.title}
      />
    </div>
  )
}
