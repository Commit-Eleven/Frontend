import { useEffect, useRef, useState } from 'react'
import { codingLanguages } from '../../data/navigation.js'
import { icon } from '../../lib/assets.js'
import { selectCodingLanguage, useCodingLanguage } from '../../hooks/useCodingLanguage.js'
import './Stats.css'

export function Stats({ compact = false }) {
  const language = useCodingLanguage()
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef(null)

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

  const selectLanguage = (nextLanguage) => {
    selectCodingLanguage(nextLanguage)
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
      <span className="stat stat-fire"><b>0</b><img src={icon('fire')} alt="연속 학습" /></span>
      <span className="stat stat-gem"><b>19</b><span className="gem-shape" /></span>
      <span className="stat stat-energy"><b>6</b><span className="energy-shape">ϟ</span></span>
    </div>
  )
}
