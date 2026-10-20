import { useEffect, useState } from 'react'
import { allMainLessons, allNodes, statusFor } from '../constants/dummy/journey.js'
import { readSaved } from '../utils/progress.js'
import { getLessonIdFromPath, getLessonPath, journeyPath } from '../app/routes.js'


/** 홈과 레슨 간 이동, 진행 상태, 검색·강의 계획 상태를 관리합니다. */
export function useJourneyController() {
  const [saved] = useState(readSaved)
  const [completed, setCompleted] = useState(saved.completed)
  const [active, setActive] = useState(saved.active)
  const [selectedId, setSelectedId] = useState(saved.active)
  const [lessonId, setLessonId] = useState(getLessonIdFromPath() || 'paragraphs')
  const [view, setView] = useState(getLessonIdFromPath() ? 'lesson' : 'home')
  const [searchOpen, setSearchOpen] = useState(false)
  const [syllabusOpen, setSyllabusOpen] = useState(false)
  const [jumpTo, setJumpTo] = useState(null)

  useEffect(() => {
    localStorage.setItem('coddy-demo-progress', JSON.stringify({ completed, active }))
  }, [completed, active])

  useEffect(() => {
    /** 브라우저 뒤로 가기와 앞으로 가기에 맞춰 화면을 전환합니다. */
    const handlePopState = () => {
      const id = getLessonIdFromPath()
      if (id) setLessonId(id)
      else setJumpTo(null)
      setView(id ? 'lesson' : 'home')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    /** 전역 단축키로 검색창과 모달을 제어합니다. */
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setSyllabusOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  /** 잠금 여부를 확인한 뒤 선택한 레슨으로 이동합니다. */
  const handleOpenLesson = (id) => {
    const node = allNodes.find((item) => item.id === id)
    if (!node || statusFor(node, completed, active) === 'locked') return
    setLessonId(id)
    setView('lesson')
    window.history.pushState({}, '', getLessonPath(id))
  }

  /** 여정 홈으로 돌아가고 주소를 갱신합니다. */
  const handleGoHome = () => {
    setView('home')
    setSelectedId(active)
    setJumpTo(null)
    window.history.pushState({}, '', journeyPath)
  }

  /** 레슨 완료 내역과 다음 활성 레슨을 갱신합니다. */
  const handleLessonComplete = (id) => {
    if (completed.includes(id)) return
    const nextCompleted = [...completed, id]
    setCompleted(nextCompleted)
    const index = allMainLessons.findIndex((lesson) => lesson.id === id)
    const next = allMainLessons.slice(index + 1).find((lesson) => !nextCompleted.includes(lesson.id) && lesson.initial !== 'special')
    if (next) {
      setActive(next.id)
      setSelectedId(next.id)
    }
  }

  /** 검색 결과에 해당하는 챕터와 레슨을 선택합니다. */
  const handleSearchPick = (item) => {
    setSearchOpen(false)
    setView('home')
    window.history.pushState({}, '', journeyPath)
    if (item.id) setSelectedId(item.id)
    setJumpTo({ chapter: item.chapter })
  }

  return {
    view, lessonId, completed, active, selectedId, searchOpen, syllabusOpen, jumpTo,
    setSelectedId, setSearchOpen, setSyllabusOpen, setJumpTo,
    handleOpenLesson, handleGoHome, handleLessonComplete, handleSearchPick,
  }
}
