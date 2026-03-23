import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, submitResponse } from '../lib/supabase'; 
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // 🔍 조회수를 올리는 기능을 별도로 분리했습니다.
  const incrementViewCount = async (targetSlug) => {
    try {
      // 아까 SQL로 만든 increment_views 함수를 호출합니다.
      const { error } = await supabase.rpc('increment_views', { target_slug: targetSlug });
      if (error) throw error;
      console.log("📈 조회수가 1 증가했습니다.");
    } catch (err) {
      console.error("❌ 조회수 업데이트 실패:", err.message);
    }
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        const decodedSlug = decodeURIComponent(slug);
        console.log("🔍 조회 중인 Slug:", decodedSlug);

        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true)
          .single();

        if (supabaseError || !data) {
          throw new Error("폼을 찾을 수 없거나 비공개 상태입니다.");
        }

        setForm(data);
        
        // ✅ 데이터를 성공적으로 가져왔다면, 조회수를 올립니다!
        incrementViewCount(decodedSlug);

      } catch (err) {
        console.error("🚨 에러 상세:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchForm();
  }, [slug]);

  // iframe 응답 제출 로직 (기존 유지)
  useEffect(() => {
    if (!form) return;

    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          await submitResponse(form.id, event.data.answers);
          console.log("✅ 응답 저장 완료!");
        } catch (err) {
          console.error('❌ 응답 저장 실패:', err);
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*');
        }
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className={styles.center}>
        <div className={styles.notFound}>
          <div className={styles.ico}>✦</div>
          <h2>폼을 찾을 수 없습니다</h2>
          <p>{error || '링크가 잘못되었거나 비공개 상태예요.'}</p>
          <button onClick={() => window.location.reload()} className={styles.retryBtn}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    form.settings || {},
    {}
  );

  html = html.replace(
    `await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});`,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  );

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
  );
};

export default PublicForm;
