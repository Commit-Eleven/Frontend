import { useEffect, useMemo, useState } from 'react';
import { journeyFor } from '../data/curricula.js';
import { statusFor } from '../data/journey.js';
import { readSaved, saveProgress } from '../lib/progress.js';
import { completeLesson as saveLessonCompletion } from '../api/learning.js';

function journeyPath(language) {
  return `/journeys/${language}/fundamentals`;
}

function lessonFromPath(language, journey) {
  const prefix = journeyPath(language) + '/';
  if (!location.pathname.startsWith(prefix)) return null;
  const id = location.pathname.slice(prefix.length);
  return journey.allNodes.some((node) => node.id === id) ? id : null;
}

function initialSession(language) {
  return { language, ...readSaved(language) };
}

export function useJourneyController(language) {
  const journey = useMemo(() => journeyFor(language), [language]);
  const [progress, setProgress] = useState(() => initialSession(language));
  const { completed, active } = progress;
  const [selectedId, setSelectedId] = useState(active);
  const initialLesson = lessonFromPath(language, journey) || active;
  const [lessonId, setLessonId] = useState(initialLesson);
  const [view, setView] = useState(lessonFromPath(language, journey) ? 'lesson' : 'home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [jumpTo, setJumpTo] = useState(null);

  // 언어별 학습 상태만 초기화하고 공통 레이아웃은 그대로 유지합니다.
  if (progress.language !== language) {
    const nextProgress = initialSession(language);
    const nextLesson = lessonFromPath(language, journey);
    setProgress(nextProgress);
    setSelectedId(nextProgress.active);
    setLessonId(nextLesson || nextProgress.active);
    setView(nextLesson ? 'lesson' : 'home');
    setSearchOpen(false);
    setSyllabusOpen(false);
    setJumpTo(null);
  }

  useEffect(() => {
    saveProgress(language, { completed: progress.completed, active: progress.active });
  }, [language, progress]);

  useEffect(() => {
    const isJourneyRoute = /^\/journeys\/(?:html|javascript|python|java)\/fundamentals(?:\/|$)/.test(
      window.location.pathname,
    );
    const selectedPath = journeyPath(language);
    if (isJourneyRoute && !window.location.pathname.startsWith(selectedPath)) {
      window.history.replaceState({}, '', selectedPath);
    }
  }, [language]);

  useEffect(() => {
    const onPop = () => {
      const id = lessonFromPath(language, journey);
      if (id) setLessonId(id);
      else setJumpTo(null);
      setView(id ? 'lesson' : 'home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [language, journey]);

  useEffect(() => {
    const onKeys = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSyllabusOpen(false);
      }
    };
    window.addEventListener('keydown', onKeys);
    return () => window.removeEventListener('keydown', onKeys);
  }, []);

  const openLesson = (id) => {
    const node = journey.allNodes.find((item) => item.id === id);
    if (!node || statusFor(node, completed, active) === 'locked') return;
    setLessonId(id);
    setView('lesson');
    window.history.pushState({}, '', journeyPath(language) + '/' + id);
  };

  const goHome = () => {
    setView('home');
    setSelectedId(active);
    setJumpTo(null);
    window.history.pushState({}, '', journeyPath(language));
  };

  const completeLesson = async (id, options) => {
    await saveLessonCompletion(id, language, options);
    setProgress((current) => {
      if (current.language !== language || current.completed.includes(id)) return current;
      const nextCompleted = [...current.completed, id];
      const index = journey.allMainLessons.findIndex((lesson) => lesson.id === id);
      const next = journey.allMainLessons
        .slice(index + 1)
        .find((lesson) => !nextCompleted.includes(lesson.id) && lesson.initial !== 'special');
      return { ...current, completed: nextCompleted, active: next?.id ?? current.active };
    });
  };

  const pickSearch = (item) => {
    setSearchOpen(false);
    setView('home');
    window.history.pushState({}, '', journeyPath(language));
    if (item.id) setSelectedId(item.id);
    setJumpTo({ chapter: item.chapter });
  };

  return {
    journey,
    view,
    lessonId,
    completed,
    active,
    selectedId,
    searchOpen,
    syllabusOpen,
    jumpTo,
    setSelectedId,
    setSearchOpen,
    setSyllabusOpen,
    setJumpTo,
    openLesson,
    goHome,
    completeLesson,
    pickSearch,
  };
}
