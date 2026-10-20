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
        <span>사이트 언어: 한국어</span>
      </header>
      <section className="auth-hero" aria-labelledby="auth-title">
        <AuthIllustration />
        <div className="auth-intro">
          <h1 id="auth-title">
            코딩을 가장 재미있게
            <br />
            배우는 방법!
          </h1>
          <p>매일 작은 도전으로, 나만의 가능성을 키워요.</p>
          <button
            type="button"
            className="auth-start"
            onClick={handleOpenAuthModal}
          >
            시작하기
          </button>
          <button
            type="button"
            className="auth-existing"
            onClick={handleOpenAuthModal}
          >
            계정이 이미 있습니다
          </button>
        </div>
      </section>
      {/* 로그인 진입 버튼을 누른 경우에만 모달을 표시합니다. */}
      {isAuthModalOpen && <GoogleLoginModal onClose={handleCloseAuthModal} />}
    </main>
  );
}
