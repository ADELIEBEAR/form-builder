import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, submitResponse } from '../lib/supabase'; // 설정 경로 확인 필수!
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // 조회수 올리는 함수
  const incrementViewCount = async (targetSlug) => {
    try {
      await supabase.rpc('increment_views', { target_slug: targetSlug });
      console.log("📈 조회수 +1");
    } catch (err) {
      console.error("❌ 조회수 업데이트 실패:", err.message);
    }
  };

  // 데이터 가져오기 로직
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

        console.log("✅ 데이터 로드 성공:", data);
        setForm(data);
        
        // 조회수 올리기
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

  // --- [스타일 개선의 핵심] ---
  // 정프로님이 만드신 generateFormHTML 함수에 배경과 커버 URL을 넘겨줍니다.
  // 🔍 함수 정의 부분을 확인해서 인자 순서를 맞추셔야 합니다!
  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { 
      c1: form.theme_c1, 
      c2: form.theme_c2, 
      // 👇 [중요] 배경 이미지와 커버 이미지 URL을 HTML 생성 엔진에 던집니다.
      bgUrl: form.background_url, 
      coverUrl: form.cover_url 
    },
    form.settings || {},
    {}
  );

  // fetch 요청을 postMessage로 교체 (기존 로직 유지)
  html = html.replace(
    `await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});`,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  );

  return (
    // 예시 이미지(`image_4b4fa3.jpg`)처럼 깔끔하게 보이도록 스타일을 적용했습니다.
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
