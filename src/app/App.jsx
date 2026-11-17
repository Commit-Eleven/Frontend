import { lazy, Suspense, useEffect, useState } from 'react';
import { useJourneyController } from '../hooks/useJourneyController.js';
import { Home } from '../components/home/Home.jsx';
import { SearchModal } from '../components/home/SearchModal.jsx';
import { SyllabusModal } from '../components/home/SyllabusModal.jsx';
import { useCodingLanguage } from '../hooks/useCodingLanguage.js';
import { getViewFromPath } from './routes.js';
import { AuthPage } from '../pages/AuthPage.jsx';
import { logoutFromApp } from '../api/authSession.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { OnboardingModal } from '../components/onboarding/OnboardingModal.jsx';
import './App.css';

const Lesson = lazy(() =>
  import('../components/lesson/Lesson.jsx').then(({ Lesson: Screen }) => ({ default: Screen })),
);

const homeItemKey = 'codegram-home-item';

export default function App() {
  const language = useCodingLanguage();
  // 프로필·랭킹 같은 화면은 주소가 바뀌지 않으므로, 새로고침해도 같은 화면에 머물도록 기억합니다.
  const [activeHomeItem, setActiveHomeItemState] = useState(() => {
    try {
      return sessionStorage.getItem(homeItemKey) || '학습';
    } catch {
      return '학습';
    }
  });
  const setActiveHomeItem = (item) => {
    setActiveHomeItemState(item);
    try {
      if (item && item !== '학습') sessionStorage.setItem(homeItemKey, item);
      else sessionStorage.removeItem(homeItemKey);
    } catch {
      /* 저장소를 쓸 수 없으면 기억하지 않습니다. */
    }
  };
  const [isAuthPage, setIsAuthPage] = useState(
    () => getViewFromPath(window.location.pathname) === 'auth',
  );

  useEffect(() => {
    const syncRoute = () => setIsAuthPage(getViewFromPath(window.location.pathname) === 'auth');
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  if (isAuthPage) return <AuthPage />;

  return (
    <JourneyApp
      language={language}
      activeHomeItem={activeHomeItem}
      onHomeItemChange={setActiveHomeItem}
    />
  );
}

function JourneyApp({ language, activeHomeItem, onHomeItemChange }) {
  const journey = useJourneyController(language.code);
  useEffect(() => {
    document.title = 'Codegram';
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
        <Suspense fallback={<LoadingSkeleton variant="lesson" label="문제 화면을 불러오는 중" />}>
          <Lesson
            key={language.code + '-' + journey.lessonId}
            lessonId={journey.lessonId}
            language={language.code}
            journey={journey.journey}
            onBack={journey.goHome}
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
