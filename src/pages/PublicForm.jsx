import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 설정 경로 확인 필수!
import { getFormBySlug, submitResponse } from '../lib/supabase';
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  // 1. URL에서 :slug를 가져옵니다. (예: ai-t0v2s)
  const { slug } = useParams();
  
  // 2. 상태 관리 (데이터, 로딩, 에러 여부)
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. iframe을 제어하기 위한 참조(Ref)
  const iframeRef = useRef(null);

  // --- [데이터 가져오기 로직] ---
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        // [중요] 한글이나 특수문자가 섞인 slug를 위해 디코딩을 합니다.
        const decodedSlug = decodeURIComponent(slug);
        console.log("🔍 현재 조회 중인 Slug:", decodedSlug);

        // Supabase에서 해당 slug를 가진 발행된(is_published: true) 폼을 찾습니다.
        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true)
          .single(); // 배열이 아닌 '객체' 하나로 가져오기!

        if (supabaseError || !data) {
          console.error("❌ 폼을 찾지 못했습니다:", supabaseError?.message);
          throw new Error("폼을 찾을 수 없거나 비공개 상태입니다.");
        }

        console.log("✅ 데이터 로드 성공:", data);
        setForm(data);

      } catch (err) {
        console.error("🚨 에러 상세:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchForm();
    }
  }, [slug]);

  // --- [iframe 제출 메시지 처리 로직] ---
  useEffect(() => {
    if (!form) return;

    // iframe 내부에서 발생한 'FORM_SUBMIT' 메시지를 수신합니다.
    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          console.log("📥 응답 수신:", event.data.answers);
          // Supabase에 응답 저장
          await submitResponse(form.id, event.data.answers);
          console.log("✅ 응답 저장 완료!");
        } catch (err) {
          console.error('❌ 응답 저장 실패:', err);
          // 실패 시 iframe 내부에 에러 알림 전송
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*');
        }
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  // 4. 화면 렌더링 - 로딩 중
  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner}></div>
        <p>폼을 불러오는 중입니다...</p>
      </div>
    );
  }

  // 5. 화면 렌더링 - 에러 발생 또는 데이터 없음
  if (error || !form) {
    return (
      <div className={styles.center}>
        <div className={styles.notFound}>
          <div className={styles.ico}>✦</div>
          <h2>폼을 찾을 수 없습니다</h2>
          <p>링크가 잘못되었거나 비공개 상태예요.</p>
          <button onClick={() => window.location.reload()} className={styles.retryBtn}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 6. iframe에 넣을 HTML 생성
  // 정프로님이 만든 generateFormHTML 함수를 활용합니다.
  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    form.settings || {},
    {}
  );

  // [중요] HTML 내부의 fetch 로직을 postMessage 방식으로 강제 교체합니다.
  // 이렇게 해야 리액트 컴포넌트에서 수신하여 Supabase에 저장할 수 있습니다.
  html = html.replace(
    `await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});`,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  );

  // 7. 최종 결과물 (iframe 출력)
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
