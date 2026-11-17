import { useEffect, useMemo, useState } from 'react';
import { journeyFor } from '../data/curricula.js';
import { statusFor } from '../data/journey.js';
import { readSaved, saveProgress } from '../lib/progress.js';
import { completeLesson as saveLessonCompletion } from '../api/learning.js';
import { readStudyLevel } from '../lib/studyLevel.js';

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
  const [levelTick, setLevelTick] = useState(0);
  useEffect(() => {
    const onLevel = () => setLevelTick((tick) => tick + 1);
    window.addEventListener('codegram-level-change', onLevel);
    return () => window.removeEventListener('codegram-level-change', onLevel);
  }, []);
  const level = useMemo(() => readStudyLevel(language), [language, levelTick]);
  const [progress, setProgress] = useState(() => initialSession(language));
  const journey = useMemo(
    () => journeyFor(language, level, progress.completed),
    [language, level, progress.completed],
  );
  // 낮은 섹션은 완료된 것으로 열어 두고, 현재 위치가 그 안에 있으면 등급의 시작 지점으로 옮깁니다.
  const completed = useMemo(
    () => [...new Set([...progress.completed, ...journey.preCompleted])],
    [progress.completed, journey],
  );
  const active =
    journey.allNodes.some((node) => node.id === progress.active) &&
    !journey.preCompleted.includes(progress.active)
      ? progress.active
      : journey.defaultActive;
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
      // 방금 섹션을 모두 풀었다면 새로 열린 섹션까지 포함해 다음 레슨을 찾습니다.
      const nextJourney = journeyFor(language, level, nextCompleted);
      const doneIds = new Set([...nextCompleted, ...nextJourney.preCompleted]);
      const index = nextJourney.allMainLessons.findIndex((lesson) => lesson.id === id);
      const next = nextJourney.allMainLessons
        .slice(index + 1)
        .find((lesson) => !doneIds.has(lesson.id) && lesson.initial !== 'special');
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
