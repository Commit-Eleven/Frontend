import { useEffect, useMemo, useState } from 'react';
import { journeyFor } from '../data/curricula.js';
import { statusFor } from '../data/journey.js';
import { readSaved, saveProgress } from '../lib/progress.js';

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

  const updateProgress = (updater) => {
    setProgress((current) => ({ ...current, ...updater(current) }));
  };

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

  const completeLesson = (id) => {
    if (completed.includes(id)) return;
    const nextCompleted = [...completed, id];
    const index = journey.allMainLessons.findIndex((lesson) => lesson.id === id);
    const next = journey.allMainLessons
      .slice(index + 1)
      .find((lesson) => !nextCompleted.includes(lesson.id) && lesson.initial !== 'special');
    updateProgress(() => ({ completed: nextCompleted, active: next?.id ?? active }));
    if (next) setSelectedId(next.id);
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
