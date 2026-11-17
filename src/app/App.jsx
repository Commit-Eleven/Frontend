import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useJourneyController } from '../hooks/useJourneyController.js';
import { Home } from '../components/home/Home.jsx';
import { SearchModal } from '../components/home/SearchModal.jsx';
import { SyllabusModal } from '../components/home/SyllabusModal.jsx';
import { useCodingLanguage } from '../hooks/useCodingLanguage.js';
import { getViewFromPath, homeItemFromSearch, searchForHomeItem } from './routes.js';
import { AuthPage } from '../pages/AuthPage.jsx';
import { logoutFromApp } from '../api/authSession.js';
import { OnboardingModal } from '../components/onboarding/OnboardingModal.jsx';
import './App.css';

const Lesson = lazy(() =>
  import('../components/lesson/Lesson.jsx').then(({ Lesson: Screen }) => ({ default: Screen })),
);

export default function App() {
  const language = useCodingLanguage();
  const [activeHomeItem, setActiveHomeItem] = useState(() => homeItemFromSearch(window.location.search));
  const [isAuthPage, setIsAuthPage] = useState(
    () => getViewFromPath(window.location.pathname) === 'auth',
  );

  useEffect(() => {
    const syncRoute = () => {
      setIsAuthPage(getViewFromPath(window.location.pathname) === 'auth');
      setActiveHomeItem(homeItemFromSearch(window.location.search));
    };
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  // 메뉴를 바꿀 때마다 주소(?tab=)에 남겨 새로고침·공유·뒤로가기가 같은 화면을 보여 주게 합니다.
  const changeHomeItem = useCallback((label) => {
    setActiveHomeItem(label);
    const nextSearch = searchForHomeItem(label);
    if (window.location.search === nextSearch) return;
    window.history.pushState({}, '', window.location.pathname + nextSearch);
  }, []);

  if (isAuthPage) return <AuthPage />;

  return (
    <JourneyApp
      language={language}
      activeHomeItem={activeHomeItem}
      onHomeItemChange={changeHomeItem}
    />
  );
}

function JourneyApp({ language, activeHomeItem, onHomeItemChange }) {
  const journey = useJourneyController(language.code);
  useEffect(() => {
    document.title = `${journey.journey.title} | Codegram`;
  }, [journey.journey.title]);

  return (
    <>
      {journey.view === 'home' ? (
        <Home
          language={language}
          activeItem={activeHomeItem}
          onActiveItemChange={onHomeItemChange}
          journey={journey.journey}
          completed={journey.completed}
          active={journey.active}
          selectedId={journey.selectedId}
          onSelect={journey.setSelectedId}
          onOpen={journey.openLesson}
          onLogout={logoutFromApp}
          onSearch={() => journey.setSearchOpen(true)}
          onSyllabus={() => journey.setSyllabusOpen(true)}
          jumpTo={journey.jumpTo}
        />
      ) : (
        <Suspense fallback={<div className="lesson-loading">문제 화면을 불러오는 중...</div>}>
          <Lesson
            key={language.code + '-' + journey.lessonId}
            lessonId={journey.lessonId}
            language={language.code}
            journey={journey.journey}
            onBack={() => journey.goHome(searchForHomeItem(activeHomeItem))}
            onSuccess={journey.completeLesson}
          />
        </Suspense>
      )}
      <OnboardingModal />
      {journey.searchOpen && (
        <SearchModal
          journey={journey.journey}
          onClose={() => journey.setSearchOpen(false)}
          onPick={journey.pickSearch}
        />
      )}
      {journey.syllabusOpen && (
        <SyllabusModal
          onClose={() => journey.setSyllabusOpen(false)}
          completedCount={journey.completed.length}
          journey={journey.journey}
          onJump={(index) => {
            journey.setSyllabusOpen(false);
            journey.setJumpTo({ chapter: index });
          }}
        />
      )}
    </>
  );
}
