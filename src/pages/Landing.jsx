import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const go = () => navigate(user ? '/dashboard' : '/login')

  return (
    <div className={styles.wrap}>
      {/* 네비 */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.mark}>✦</div>
          <span>폼 빌더</span>
        </div>
        <div className={styles.navBtns}>
          {user
            ? <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>대시보드 →</button>
            : <>
                <button className="btn btn-ghost" onClick={() => navigate('/login')}>로그인</button>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>무료로 시작하기</button>
              </>
          }
        </div>
      </nav>

      {/* 히어로 */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>✦ 무료 폼 빌더</div>
        <h1 className={styles.heroTitle}>
          클릭 몇 번으로<br />
          <em>완성되는 참가신청</em>
        </h1>
        <p className={styles.heroDesc}>
          드래그&드롭으로 질문을 쌓고,<br />
          완성된 HTML을 구글 시트와 바로 연결하세요.
        </p>
        <div className={styles.heroBtns}>
          <button className="btn btn-primary" style={{ padding:'14px 32px', fontSize:'15px', borderRadius:'12px' }} onClick={go}>
            지금 바로 만들기 →
          </button>
        </div>
        <p className={styles.heroNote}>구글 계정으로 로그인 · 무료 · HTML 다운로드 · 구글 시트 연동</p>
      </section>

      {/* 기능 카드 */}
      <section className={styles.features}>
        <h2>왜 이 폼 빌더인가요?</h2>
        <p className={styles.featSub}>복잡한 설정 없이 5분이면 완성</p>
        <div className={styles.featGrid}>
          {[
            { ico:'🎨', title:'카드형 UX', desc:'한 화면에 질문 하나. 스모어처럼 세련된 폼을 자동 생성해요.' },
            { ico:'🔗', title:'구글 시트 연동', desc:'Apps Script URL만 넣으면 답변이 시트에 자동으로 쌓여요.' },
            { ico:'🖱️', title:'드래그&드롭', desc:'질문 순서를 드래그로 바꾸고, 클릭으로 추가·삭제해요.' },
            { ico:'💾', title:'내 폼 저장', desc:'구글 계정으로 로그인하면 만든 폼이 자동으로 저장돼요.' },
            { ico:'🎨', title:'테마 색상', desc:'10가지 컬러로 브랜드에 맞는 색상을 원클릭으로 바꿔요.' },
            { ico:'📱', title:'모바일 최적화', desc:'생성된 폼은 모바일에서도 완벽하게 동작해요.' },
          ].map(f => (
            <div key={f.title} className={styles.featCard}>
              <div className={styles.featIco}>{f.ico}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>지금 바로 만들어보세요</h2>
        <p>구글 계정으로 로그인 · 무료 · HTML 다운로드</p>
        <button className="btn btn-primary" style={{ padding:'14px 32px', fontSize:'15px', borderRadius:'12px', marginTop:'8px' }} onClick={go}>
          무료로 시작하기 →
        </button>
      </section>

      <footer className={styles.footer}>
        <span>✦ 폼 빌더 — Made with ♥</span>
        <span>구글 계정으로 무료 사용</span>
      </footer>
    </div>
  )
}
