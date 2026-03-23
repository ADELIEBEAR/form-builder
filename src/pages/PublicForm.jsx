import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getFormBySlug, submitResponse, supabase } from '../lib/supabase'
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
      .then(f => {
        setForm(f)
        // 조회수 증가
        supabase.rpc('increment_view_count', { form_id: f.id }).catch(() => {})
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  // iframe → postMessage → Supabase 저장 + 시트 싱크
  useEffect(() => {
    if (!form) return
    const handler = async (event) => {
      if (event.data?.type !== 'FORM_SUBMIT') return
      try {
        // 1. Supabase responses 테이블에 저장
        await submitResponse(form.id, event.data.answers)

        // 2. 구글 시트 싱크 (sheet_id 있을 때만)
        if (form.sheet_id) {
          fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sheet-sync`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                form_id: form.id,
                answers: event.data.answers,
              }),
            }
          ).catch(e => console.error('시트 싱크 실패:', e))
        }
      } catch (err) {
        console.error('응답 저장 실패:', err)
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

  // 제출 방식을 postMessage로 교체
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
