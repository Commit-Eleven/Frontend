import { useMemo, useState } from 'react';
import IncorrectProblemCard from '../../../components/notes/IncorrectProblemCard/IncorrectProblemCard';
import NotesHero from '../../../components/notes/NotesHero/NotesHero';
import NotesSummary from '../../../components/notes/NotesSummary/NotesSummary';
import WeakConceptList from '../../../components/notes/WeakConceptList/WeakConceptList';
import { dummyIncorrectProblems, dummyIncorrectSummary, dummyWeakConcepts } from '../../../constants/dummy/dummyIncorrectNotes';
import './IncorrectNotesPage.css';

const filters = ['전체', '객관식', '빈칸 채우기', '코드 작성'];

/** 오답을 유형별로 확인하고 다시 학습할 수 있는 페이지입니다. */
function IncorrectNotesPage() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const visibleProblems = useMemo(
    () => (activeFilter === '전체' ? dummyIncorrectProblems : dummyIncorrectProblems.filter((problem) => problem.type === activeFilter)),
    [activeFilter],
  );

  return (
    <div className="incorrect-notes-page">
      <NotesHero reviewCount={dummyIncorrectSummary[1].value} />
      <NotesSummary items={dummyIncorrectSummary} />
      <div className="incorrect-notes-page__content">
        <section className="incorrect-notes-page__problems" aria-labelledby="incorrect-problems-title">
          <header>
            <div><p>다시 풀어보기</p><h2 id="incorrect-problems-title">최근 오답 문제</h2></div>
            <span>{visibleProblems.length}문제</span>
          </header>
          <div className="incorrect-notes-page__filters" role="group" aria-label="문제 유형 필터">
            {filters.map((filter) => (
              <button key={filter} type="button" className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
          {visibleProblems.length ? (
            <div className="incorrect-notes-page__list">
              {visibleProblems.map((problem, index) => <IncorrectProblemCard key={problem.id} problem={problem} index={index} />)}
            </div>
          ) : (
            <div className="incorrect-notes-page__empty"><b>✓</b><strong>해당 유형의 오답이 없어요.</strong><span>다른 유형의 문제를 선택해보세요.</span></div>
          )}
        </section>
        <WeakConceptList concepts={dummyWeakConcepts} />
      </div>
    </div>
  );
}

export default IncorrectNotesPage;
