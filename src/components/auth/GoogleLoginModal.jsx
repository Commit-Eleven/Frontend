import { startGoogleLogin } from '../../api/auth.js';
import { useEffect, useRef, useState } from 'react';

/** Google 로그인 진입 버튼과 모달 키보드 동작을 제공합니다. */
export function GoogleLoginModal({ onClose }) {
  const dialogRef = useRef(null);
  const [notice, setNotice] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();

    /** Google 화면에서 뒤로 돌아오면 로그인 버튼을 다시 활성화합니다. */
    const handlePageShow = () => setIsRedirecting(false);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      dialog.close();
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  /** 백엔드의 Google 로그인 시작 API로 이동합니다. */
  const handleGoogleLogin = () => {
    if (isRedirecting) return;
    setNotice('');
    setIsRedirecting(true);
    try {
      startGoogleLogin();
    } catch {
      setIsRedirecting(false);
      setNotice('로그인을 시작할 수 없어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  /** 기본 취소 동작 대신 부모의 모달 상태를 정리합니다. */
  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  /** 모달 영역 바깥의 배경을 선택하면 닫습니다. */
  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const isOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (isOutside) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="auth-dialog"
      aria-labelledby="auth-dialog-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className="auth-close"
        aria-label="닫기"
        onClick={onClose}
      >
        ×
      </button>
      <div className="auth-dialog-icon" aria-hidden="true">
        &lt;/&gt;
      </div>
      <h2 id="auth-dialog-title">코딩 여정을 시작해요</h2>
      <button
        type="button"
        className="auth-google"
        onClick={handleGoogleLogin}
        disabled={isRedirecting}
        aria-busy={isRedirecting}
      >
        <svg aria-hidden="true" viewBox="0 0 48 48">
          <path
            fill="#4285F4"
            d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.9 6-15.1Z"
          />
          <path
            fill="#34A853"
            d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.8-3.6-11.4-8.4H5.7v5.4A20.4 20.4 0 0 0 24 44Z"
          />
          <path
            fill="#FBBC05"
            d="M12.6 27.4a12.2 12.2 0 0 1 0-7.8v-5.4H5.7a20.4 20.4 0 0 0 0 18.6l6.9-5.4Z"
          />
          <path
            fill="#EA4335"
            d="M24 11.2c3 0 5.6 1 7.7 3l5.8-5.8A19.5 19.5 0 0 0 24 3a20.4 20.4 0 0 0-18.3 11.2l6.9 5.4c1.6-4.8 6.1-8.4 11.4-8.4Z"
          />
        </svg>
        {isRedirecting ? 'Google로 이동 중…' : '구글로 로그인하기'}
      </button>
      <div className="auth-status" role="status">
        {notice}
      </div>
    </dialog>
  );
}
