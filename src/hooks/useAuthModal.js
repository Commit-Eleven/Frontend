import { useState } from 'react';

/** 시작 화면의 Google 로그인 모달 표시 상태를 관리합니다. */
export function useAuthModal() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  /** Google 로그인 모달을 엽니다. */
  const handleOpenAuthModal = () => setIsAuthModalOpen(true);

  /** Google 로그인 모달을 닫습니다. */
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  return { isAuthModalOpen, handleOpenAuthModal, handleCloseAuthModal };
}
