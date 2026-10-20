import { lazy, Suspense } from 'react';
import { useJourneyController } from '../hooks/useJourneyController.js';
import { HomePage } from '../pages/HomePage.jsx';
import { SearchModal } from '../components/home/SearchModal.jsx';
import { SyllabusModal } from '../components/home/SyllabusModal.jsx';
import '../styles/App.css';

const Lesson = lazy(() =>
  import('../pages/LessonPage.jsx').then(({ LessonPage: Screen }) => ({ default: Screen })),
);

/** 화면 상태에 따라 홈·레슨 페이지와 모달을 연결합니다. */
export default function App() {
  const journey = useJourneyController();

  return (
    <>
      {journey.view === 'home' ? (
        <HomePage
          completed={journey.completed}
          active={journey.active}
          selectedId={journey.selectedId}
          onSelect={journey.setSelectedId}
          onOpen={journey.handleOpenLesson}
          onSearch={() => journey.setSearchOpen(true)}
          onSyllabus={() => journey.setSyllabusOpen(true)}
          jumpTo={journey.jumpTo}
        />
      ) : (
        <Suspense fallback={<div className="lesson-loading">문제 화면을 불러오는 중...</div>}>
          <Lesson
            key={journey.lessonId}
            lessonId={journey.lessonId}
            onBack={journey.handleGoHome}
            onSuccess={journey.handleLessonComplete}
          />
        </Suspense>
      )}
      {journey.searchOpen && (
        <SearchModal onClose={() => journey.setSearchOpen(false)} onPick={journey.handleSearchPick} />
      )}
      {journey.syllabusOpen && (
        <SyllabusModal
          onClose={() => journey.setSyllabusOpen(false)}
          completedCount={journey.completed.length}
          onJump={(index) => {
            journey.setSyllabusOpen(false);
            journey.setJumpTo({ chapter: index });
          }}
        />
      )}
    </>
  );
}
