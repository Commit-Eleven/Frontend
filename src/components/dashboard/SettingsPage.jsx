import { useEffect, useState } from 'react'
import { authorizationHeaders, clearAccessToken } from '../../api/auth.js'
import { deleteMyAccount, fetchLearningSettings, updateLearningSettings } from '../../api/learning.js'
import { readStudyLevel, saveStudyLevel, studyLevels } from '../../lib/studyLevel.js'
import { codingLanguages } from '../../data/navigation.js'
import { selectCodingLanguage } from '../../hooks/useCodingLanguage.js'
import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './SettingsPage.css'

export function SettingsPage({ language, onNavigate, onLogout }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [notice, setNotice] = useState('')
  const [level, setLevel] = useState(readStudyLevel)
  const [learningNotice, setLearningNotice] = useState('')
  const loggedIn = Boolean(authorizationHeaders().Authorization)

  // 로그인 상태면 서버에 저장된 학습 등급을 불러옵니다.
  useEffect(() => {
    if (!loggedIn) return undefined
    const controller = new AbortController()
    fetchLearningSettings({ signal: controller.signal })
      .then((settings) => {
        if (!settings?.studyLevel) return
        setLevel(settings.studyLevel)
        saveStudyLevel(settings.studyLevel)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [loggedIn])

  const saveLearning = async (change) => {
    if (!loggedIn) return
    setLearningNotice('')
    try {
      await updateLearningSettings(change)
    } catch (requestError) {
      setLearningNotice(requestError.message || '학습 설정을 저장하지 못했어요.')
    }
  }

  const chooseLanguage = (option) => {
    selectCodingLanguage(option)
    saveLearning({ language: option.code })
  }

  const chooseLevel = (code) => {
    setLevel(code)
    saveStudyLevel(code)
    saveLearning({ level: code })
  }

  const deleteAccount = async () => {
    setDeleting(true)
    setNotice('')
    try {
      await deleteMyAccount()
      clearAccessToken()
      localStorage.clear()
      location.replace('/')
    } catch (requestError) {
      setNotice(requestError.status === 401
        ? '로그인한 뒤에 탈퇴할 수 있어요.'
        : requestError.message || '탈퇴하지 못했어요.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <section className="settings-page">
      <DashboardPageHeader
        eyebrow="환경 설정"
        title="설정"
        description="나에게 맞는 학습 환경을 선택해 보세요."
      />

      <article className="settings-section-card">
        <div className="settings-section-heading">
          <span className="settings-section-symbol" aria-hidden="true">⌘</span>
          <div><h2>학습 언어</h2><p>언어를 바꾸면 해당 과정과 문제가 열려요.</p></div>
        </div>
        <div className="settings-language-list" role="group" aria-label="학습 언어 선택">
          {codingLanguages.map((option) => {
            const selected = language.code === option.code
            return (
              <button
                type="button"
                key={option.code}
                className={'settings-language-option' + (selected ? ' is-selected' : '')}
                aria-pressed={selected}
                onClick={() => chooseLanguage(option)}
              >
                <img src={option.icon} alt="" />
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
                {selected && <b aria-hidden="true">✓</b>}
              </button>
            )
          })}
        </div>
      </article>

      <article className="settings-section-card">
        <div className="settings-section-heading">
          <span className="settings-section-symbol" aria-hidden="true">▲</span>
          <div><h2>학습 등급</h2><p>내 수준에 맞는 난이도를 골라요.</p></div>
        </div>
        <div className="settings-language-list" role="group" aria-label="학습 등급 선택">
          {studyLevels.map((option) => {
            const selected = level === option.code
            return (
              <button
                type="button"
                key={option.code}
                className={'settings-language-option' + (selected ? ' is-selected' : '')}
                aria-pressed={selected}
                onClick={() => chooseLevel(option.code)}
              >
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
                {selected && <b aria-hidden="true">✓</b>}
              </button>
            )
          })}
        </div>
        {learningNotice && <p className="settings-delete-notice" role="alert">{learningNotice}</p>}
        {!loggedIn && <p className="settings-learning-hint">로그인하면 학습 언어와 등급이 계정에 저장돼요.</p>}
      </article>

      <article className="settings-section-card settings-account-card">
        <div className="settings-section-heading">
          <span className="settings-section-symbol account" aria-hidden="true">◎</span>
          <div><h2>계정</h2><p>학습 기록을 계정에 안전하게 저장하세요.</p></div>
        </div>
        <div className="settings-action-list">
          <button type="button" onClick={() => onNavigate('프로필')}>
            <span><strong>프로필 보기</strong><small>닉네임과 학습 통계를 확인해요.</small></span><b aria-hidden="true">→</b>
          </button>
          <button type="button" onClick={() => onNavigate('도움말')}>
            <span><strong>도움말</strong><small>자주 묻는 질문과 문제 해결 방법</small></span><b aria-hidden="true">→</b>
          </button>
        </div>
      </article>

      <button type="button" className="settings-logout-button" onClick={onLogout}>로그아웃</button>

      <article className="settings-section-card settings-danger-card">
        <div className="settings-section-heading">
          <span className="settings-section-symbol account" aria-hidden="true">!</span>
          <div><h2>회원 탈퇴</h2><p>탈퇴하면 계정과 학습 기록이 삭제돼요.</p></div>
        </div>
        {confirmDelete ? (
          <div className="settings-delete-confirm" role="alertdialog" aria-label="회원 탈퇴 확인">
            <p>정말 탈퇴할까요? 이 작업은 되돌릴 수 없어요.</p>
            <div>
              <button type="button" onClick={() => setConfirmDelete(false)} disabled={deleting}>취소</button>
              <button type="button" className="is-danger" onClick={deleteAccount} disabled={deleting}>{deleting ? '처리 중…' : '탈퇴하기'}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="settings-delete-button" onClick={() => setConfirmDelete(true)}>회원 탈퇴</button>
        )}
        {notice && <p className="settings-delete-notice" role="alert">{notice}</p>}
      </article>
    </section>
  )
}
