import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Landing.module.css'
import { useTheme } from '../lib/themeContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const go = () => navigate(user ? '/dashboard' : '/login')
  const { theme, toggle } = useTheme()

  return (
    <div className={styles.wrap}>
      {/* 네비 */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.mark}>✦</div>
          <span>폼 빌더</span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.themeToggle} onClick={toggle} title="테마 전환">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <span className={styles.madeBy}>by <strong>정석</strong></span>
          <div className={styles.navBtns}>
            {user
              ? <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>대시보드 →</button>
              : <>
                  <button className="btn btn-ghost" onClick={() => navigate('/login')}>로그인</button>
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>무료로 시작하기</button>
                </>
            }
          </div>
        </div>
      </nav>

      {/* 히어로 */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>✦ 정석's 폼 빌더</div>
        <h1 className={styles.heroTitle}>
          클릭 몇 번으로<br />
          <em>완성되는 참가신청</em>
        </h1>
        <p className={styles.heroDesc}>
          드래그&드롭으로 질문을 쌓고,<br />
          완성된 폼을 구글 시트와 바로 연결하세요.
        </p>
        <div className={styles.heroBtns}>
          <button className="btn btn-primary btn-xl" onClick={go}>
            지금 바로 만들기 →
          </button>
        </div>
        <p className={styles.heroNote}>구글 계정 로그인 · 무료 · 구글 시트 자동 연동</p>
      </section>

      {/* 기능 카드 */}
      <section className={styles.features}>
        <h2>왜 이 폼 빌더인가요?</h2>
        <p className={styles.featSub}>복잡한 설정 없이 5분이면 완성</p>
        <div className={styles.featGrid}>
          {[
            { ico:'🎨', title:'30가지 컨셉 테마', desc:'말랑말랑, 사이버, 크립토, 블룸버그 등 폼 분위기를 완전히 다르게.' },
            { ico:'📊', title:'구글 시트 자동 연동', desc:'버튼 하나로 시트 생성 · 응답이 실시간으로 자동 저장.' },
            { ico:'📱', title:'스모어 스타일 UX', desc:'한 화면에 질문 하나. 모바일 최적화된 세련된 폼.' },
            { ico:'🔔', title:'신규 응답 알림', desc:'새 응답이 오면 브라우저 알림으로 즉시 알려줘요.' },
            { ico:'💾', title:'클라우드 저장', desc:'구글 계정으로 로그인하면 모든 폼이 자동 저장.' },
            { ico:'📥', title:'HTML 내보내기', desc:'완성된 폼을 HTML 파일로 다운로드해서 어디서든 사용.' },
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
        <div className={styles.ctaBadge}>✦ 정석's 폼 빌더</div>
        <h2>지금 바로 만들어보세요</h2>
        <p>구글 계정으로 로그인 · 완전 무료</p>
        <button className="btn btn-primary btn-xl" style={{ marginTop:'16px' }} onClick={go}>
          무료로 시작하기 →
        </button>
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <div className={styles.mark} style={{width:20,height:20,fontSize:9}}>✦</div>
            <span>정석's 폼 빌더</span>
          </div>
          <span className={styles.footerMade}>Developed by <strong>정석</strong></span>
        </div>

        {/* 면책조항 */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerTitle}>⚠️ 투자 면책조항 (Investment Disclaimer)</p>
          <p>본 서비스를 통해 수집되는 정보 및 제공되는 내용은 투자 권유, 매매 권고, 재무 조언을 목적으로 하지 않습니다.
          코인·주식·파생상품 등 모든 금융 투자는 원금 손실 위험이 있으며, 투자 결과에 대한 책임은 전적으로 투자자 본인에게 있습니다.
          과거의 수익률이 미래의 수익을 보장하지 않습니다. 투자 전 반드시 본인의 재무 상태 및 투자 성향을 충분히 검토하시기 바랍니다.</p>
          <p style={{marginTop:6}}>본 폼 빌더 서비스는 정보 수집 도구로서만 기능하며, 투자 손익에 대해 어떠한 법적 책임도 지지 않습니다.</p>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2025 정석's 폼 빌더. All rights reserved.</span>
          <span>Made with ♥ by 정석</span>
        </div>
      </footer>
    </div>
  )
}
