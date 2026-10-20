import { useEffect, useRef, useState } from 'react'
import { codingLanguages } from '../../constants/dummy/navigation.js'
import { icon } from '../../utils/assets.js'

/** 브라우저에 저장된 선택 언어를 읽습니다. */
function readLanguage() {
  const saved = localStorage.getItem('codegram-language')
  return codingLanguages.find((language) => language.code === saved) || codingLanguages[0]
}

/** 학습 언어 선택 메뉴와 사용자 학습 통계를 표시합니다. */
export function Stats({ compact = false }) {
  const [language, setLanguage] = useState(readLanguage)
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef(null)

  useEffect(() => {
    /** 다른 탭의 언어 선택 변경을 현재 화면에 반영합니다. */
    const syncLanguage = () => setLanguage(readLanguage())
    window.addEventListener('codegram-language-change', syncLanguage)
    window.addEventListener('storage', syncLanguage)
    return () => {
      window.removeEventListener('codegram-language-change', syncLanguage)
      window.removeEventListener('storage', syncLanguage)
    }
  }, [])

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

  /** 선택한 코딩 언어를 저장하고 메뉴를 닫습니다. */
  const handleLanguageSelect = (nextLanguage) => {
    localStorage.setItem('codegram-language', nextLanguage.code)
    setLanguage(nextLanguage)
    window.dispatchEvent(new Event('codegram-language-change'))
    setLanguageOpen(false)
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
        </button>
        {languageOpen && (
          <div className="language-menu" role="menu" aria-label="코딩 언어 선택">
            <div className="language-menu-title">언어 선택</div>
            {[...new Set(codingLanguages.map((option) => option.category))].map((category) => (
              <section className="language-menu-group" key={category} aria-label={category}>
                <h3>{category}</h3>
                {codingLanguages.filter((option) => option.category === category).map((option) => {
                  const isSelected = language.code === option.code
                  return (
                    <button
                      key={option.code}
                      type="button"
                      className={'language-menu-item' + (isSelected ? ' is-selected' : '')}
                      role="menuitemradio"
                      aria-checked={isSelected}
                      onClick={() => handleLanguageSelect(option)}
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
      <span className="stat stat-fire"><b>0</b><img src={icon('fire')} alt="연속 학습" /></span>
      <span className="stat stat-gem"><b>19</b><span className="gem-shape" /></span>
      <span className="stat stat-energy"><b>6</b><span className="energy-shape">ϟ</span></span>
    </div>
  )
}
