import { lazy, Suspense, useEffect, useState } from 'react';
import { useJourneyController } from '../hooks/useJourneyController.js';
import { Groups } from '../components/groups/Groups.jsx';
import { Home } from '../components/home/Home.jsx';
import { SearchModal } from '../components/home/SearchModal.jsx';
import { SyllabusModal } from '../components/home/SyllabusModal.jsx';
import { useCodingLanguage } from '../hooks/useCodingLanguage.js';
import { getViewFromPath } from './routes.js';
import { AuthPage } from '../pages/AuthPage.jsx';
import { logoutFromApp } from '../api/authSession.js';
import './App.css';

const Lesson = lazy(() =>
  import('../components/lesson/Lesson.jsx').then(({ Lesson: Screen }) => ({ default: Screen })),
);

export default function App() {
  const language = useCodingLanguage();
  const [activeHomeItem, setActiveHomeItem] = useState('학습');
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
      key={language.code}
      language={language}
      activeHomeItem={activeHomeItem}
      onHomeItemChange={setActiveHomeItem}
    />
  );
}

function JourneyApp({ language, activeHomeItem, onHomeItemChange }) {
  const journey = useJourneyController(language.code);
  useEffect(() => {
    document.title = `${journey.journey.title} | Coddy`;
  }, [journey.journey.title]);

  return (
    <>
      {journey.view === 'home' && activeHomeItem === '그룹' ? (
        <Groups onNavigate={onHomeItemChange} onLogout={logoutFromApp} />
      ) : journey.view === 'home' ? (
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
            onBack={journey.goHome}
            onSuccess={journey.completeLesson}
          />
        </Suspense>
      )}
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
