import { useEffect, useState } from 'react'
import { authorizationHeaders } from '../../api/auth.js'
import { completeOnboarding, fetchOnboarding } from '../../api/learning.js'
import { codingLanguages } from '../../data/navigation.js'
import { selectCodingLanguage } from '../../hooks/useCodingLanguage.js'
import { saveStudyLevel } from '../../lib/studyLevel.js'
import { ModalBackdrop } from '../common/ModalBackdrop.jsx'
import './OnboardingModal.css'

/** 첫 로그인 때 학습 언어와 등급을 고르게 합니다. (GET·POST /users/onboarding) */
export function OnboardingModal() {
  const loggedIn = Boolean(authorizationHeaders().Authorization)
  const [options, setOptions] = useState(null)
  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loggedIn) return undefined
    const controller = new AbortController()
    fetchOnboarding({ signal: controller.signal })
      .then((data) => { if (data?.required) setOptions(data) })
      .catch(() => {})
    return () => controller.abort()
  }, [loggedIn])

  if (!options) return null

  const languages = Array.isArray(options.languages) ? options.languages : []
  const levels = Array.isArray(options.levels) ? options.levels : []

  async function submit(event) {
    event.preventDefault()
    if (!language || !level || saving) return
    setSaving(true); setError('')
    try {
      await completeOnboarding({ language, level })
      saveStudyLevel(level)
      setOptions(null)
      const option = codingLanguages.find((item) => item.code === language)
      if (option) selectCodingLanguage(option)
    } catch (requestError) {
      if (requestError.status === 409) { setOptions(null); return }
      setError(requestError.message || '저장하지 못했어요.')
      setSaving(false)
    }
  }

  return (
    <ModalBackdrop onClose={() => {}}>
      <form className="onboarding-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
        <p className="onboarding-eyebrow">처음 오셨네요</p>
        <h2 id="onboarding-title">어떤 언어부터 배워 볼까요?</h2>
        <p className="onboarding-copy">고른 언어와 수준에 맞춰 문제를 보여 드려요. 나중에 설정에서 바꿀 수 있어요.</p>

        <fieldset className="onboarding-group">
          <legend>학습 언어</legend>
          <div className="onboarding-options">
            {languages.map((item) => {
              const option = codingLanguages.find((entry) => entry.code === item.id)
              return (
                <label key={item.id} className={language === item.id ? 'is-selected' : ''}>
                  <input type="radio" name="language" value={item.id} checked={language === item.id} onChange={() => setLanguage(item.id)} />
                  {option?.icon && <img src={option.icon} alt="" />}
                  <strong>{item.label}</strong>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="onboarding-group">
          <legend>내 수준</legend>
          <div className="onboarding-options is-levels">
            {levels.map((item) => (
              <label key={item.id} className={level === item.id ? 'is-selected' : ''}>
                <input type="radio" name="level" value={item.id} checked={level === item.id} onChange={() => setLevel(item.id)} />
                <strong>{item.label}</strong>
                {item.description && <small>{item.description}</small>}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="onboarding-error" role="alert">{error}</p>}
        <button type="submit" className="onboarding-submit" disabled={!language || !level || saving}>{saving ? '저장 중…' : '학습 시작하기'}</button>
      </form>
    </ModalBackdrop>
  )
}
