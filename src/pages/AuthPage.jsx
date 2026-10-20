import { AuthLanguageList } from '../components/auth/AuthLanguageList.jsx';
import { AuthFeatures } from '../components/auth/AuthFeatures.jsx';
import { useEffect } from 'react';
import { AuthIllustration } from '../components/auth/AuthIllustration.jsx';
import { GoogleLoginModal } from '../components/auth/GoogleLoginModal.jsx';
import { useAuthModal } from '../hooks/useAuthModal.js';
import '../styles/AuthPage.css';

/** 서비스 시작 화면과 Google 전용 로그인 진입점을 표시합니다. */
export function AuthPage() {
  const { isAuthModalOpen, handleOpenAuthModal, handleCloseAuthModal } =
    useAuthModal();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = '시작하기 | Codegram';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="auth-page">
      <header className="auth-header">
        <img src="/coddy/sidebar/logo.svg" alt="Codegram" />
      </header>
      <section className="auth-hero" aria-labelledby="auth-title">
        <AuthIllustration />
        <div className="auth-intro">
          <h1 id="auth-title">
            코딩을 가장 재미있게
            <br />
            배우는 방법!
          </h1>
          <p>
            HTML, CSS, JavaScript, Java, Python까지.
            <br />
            문제를 풀고 직접 코딩하며 나만의 실력을 키워요.
          </p>
          <button
            type="button"
            className="auth-start"
            onClick={handleOpenAuthModal}
          >
            시작하기
          </button>
        </div>
      </section>
      <AuthLanguageList />
      <AuthFeatures />
      <section className="auth-final-cta" aria-labelledby="auth-final-title">
        <span aria-hidden="true">&lt;/&gt;</span>
        <h2 id="auth-final-title">
          나의 첫 코딩 여정,
          <br />
          지금 시작해 볼까요?
        </h2>
        <button
          type="button"
          className="auth-start"
          onClick={handleOpenAuthModal}
        >
          시작하기
        </button>
      </section>
      <footer className="auth-footer">
        <img src="/coddy/sidebar/logo.svg" alt="Codegram" />
        <p>작은 도전이 모여, 큰 가능성이 되는 곳.</p>
      </footer>
      {/* 로그인 진입 버튼을 누른 경우에만 모달을 표시합니다. */}
      {isAuthModalOpen && <GoogleLoginModal onClose={handleCloseAuthModal} />}
    </main>
  );
}
