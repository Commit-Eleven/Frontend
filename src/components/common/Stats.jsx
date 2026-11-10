import { useEffect, useRef, useState } from 'react'
import { authorizationHeaders } from '../../api/auth.js'
import { fetchHome, fetchTags, toLanguageCode } from '../../api/learning.js'
import { updateStudyLanguage } from '../../api/community.js'
import { codingLanguages } from '../../data/navigation.js'
import { icon } from '../../lib/assets.js'
import { hasSolvedToday as readHasSolvedToday, solvedProblemEvent } from '../../lib/studyActivity.js'
import { selectCodingLanguage, useCodingLanguage } from '../../hooks/useCodingLanguage.js'
import './Stats.css'

export function Stats({ compact = false, hasSolvedToday = false }) {
  const language = useCodingLanguage()
  const [languageOpen, setLanguageOpen] = useState(false)
  const [languageError, setLanguageError] = useState('')
  const [savingLanguage, setSavingLanguage] = useState(false)
  const [availableLanguages, setAvailableLanguages] = useState(codingLanguages)
  const languageRef = useRef(null)
  const [streak, setStreak] = useState(0)
  const [solvedToday, setSolvedToday] = useState(readHasSolvedToday)
  const loggedIn = Boolean(authorizationHeaders().Authorization)
  const flameActive = solvedToday || hasSolvedToday

  useEffect(() => {
    const handleSolved = () => setSolvedToday(true)
    window.addEventListener(solvedProblemEvent, handleSolved)
    return () => window.removeEventListener(solvedProblemEvent, handleSolved)
  }, [])

  // GET /users/me/home 의 연속 학습 일수
  useEffect(() => {
    if (!loggedIn) return undefined
    const controller = new AbortController()
    fetchHome({ signal: controller.signal }).then((home) => setStreak(home.stats.streakDays)).catch(() => {})
    return () => controller.abort()
  }, [loggedIn])

  useEffect(() => {
    if (!languageOpen || !loggedIn) return undefined
    const controller = new AbortController()
    fetchTags({ signal: controller.signal })
      .then((tags) => {
        const codes = tags.map(toLanguageCode)
        setAvailableLanguages(codingLanguages.filter((option) => codes.includes(option.code)))
      })
      .catch(() => {
        if (!controller.signal.aborted) setLanguageError('사용 가능한 언어를 불러오지 못했어요.')
      })
    return () => controller.abort()
  }, [languageOpen, loggedIn])

  useEffect(() => {
    if (!languageOpen) return undefined

    const handlePointerDown = (event) => {
      if (!languageRef.current?.contains(event.target)) setLanguageOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLanguageOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [languageOpen])

  const selectLanguage = async (nextLanguage) => {
    if (savingLanguage) return
    setLanguageError('')
    setSavingLanguage(true)
    try {
      if (loggedIn) await updateStudyLanguage(nextLanguage.code)
      selectCodingLanguage(nextLanguage)
      setLanguageOpen(false)
    } catch (error) {
      setLanguageError(error.message || '언어를 변경하지 못했어요.')
    } finally {
      setSavingLanguage(false)
    }
  }

  return (
    <div className={'stats ' + (compact ? 'stats-compact' : '')}>
      <div className="language-picker" ref={languageRef}>
        <button
          type="button"
          className="language-picker-trigger"
          aria-label={`현재 언어 ${language.label}, 언어 선택`}
          aria-expanded={languageOpen}
          aria-haspopup="menu"
          title={`${language.label} 언어 선택`}
          onClick={() => setLanguageOpen((open) => !open)}
        >
          <img className="html-badge" src={language.icon} alt="" />
          <span>{language.label}</span>
        </button>
        {languageOpen && (
          <div className="language-menu" role="menu" aria-label="코딩 언어 선택">
            <div className="language-menu-title">언어 선택</div>
            {languageError && <p role="alert">{languageError}</p>}
            {[...new Set(availableLanguages.map((option) => option.category))].map((category) => (
              <section className="language-menu-group" key={category} aria-label={category}>
                <h3>{category}</h3>
                {availableLanguages.filter((option) => option.category === category).map((option) => {
                  const isSelected = language.code === option.code
                  return (
                    <button
                      key={option.code}
                      type="button"
                      className={'language-menu-item' + (isSelected ? ' is-selected' : '')}
                      role="menuitemradio"
                      disabled={savingLanguage}
                      aria-checked={isSelected}
                      onClick={() => selectLanguage(option)}
                    >
                      <img src={option.icon} alt="" />
                      <span>{option.label}</span>
                      {isSelected && <span className="language-menu-check" aria-hidden="true">✓</span>}
                    </button>
                  )
                })}
              </section>
            ))}
          </div>
        )}
      </div>
      <span className={'stat stat-fire' + (flameActive ? ' is-active' : '')} aria-label={`연속 학습 ${streak}일${flameActive ? ', 오늘 문제 풀이 완료' : ''}`}>
        <img src={icon(flameActive ? 'fire-active' : 'fire')} alt="" />
        <b>{streak}일</b>
      </span>
    </div>
  )
}
