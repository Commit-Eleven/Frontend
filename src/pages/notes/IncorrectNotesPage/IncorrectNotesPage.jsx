import { useMemo, useState } from 'react';
import IncorrectProblemCard from '../../../components/notes/IncorrectProblemCard/IncorrectProblemCard';
import NotesSummary from '../../../components/notes/NotesSummary/NotesSummary';
import WeakConceptList from '../../../components/notes/WeakConceptList/WeakConceptList';
import { dummyIncorrectProblems, dummyIncorrectSummary, dummyWeakConcepts } from '../../../constants/dummy/dummyIncorrectNotes';
import './IncorrectNotesPage.css';

const filters = ['전체', '객관식', '빈칸 채우기', '코드 작성'];

/** 오답 문제를 유형별로 확인하고 다시 학습할 수 있는 화면입니다. */
function IncorrectNotesPage() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const visibleProblems = useMemo(() => (activeFilter === '전체' ? dummyIncorrectProblems : dummyIncorrectProblems.filter((problem) => problem.type === activeFilter)), [activeFilter]);

  return (
    <div className="incorrect-notes-page">
      <header className="incorrect-notes-page__header">
        <div><p>오답 노트</p><h1>틀린 문제를 다시 풀며<br />실력을 단단하게 만들어요.</h1></div>
        <div className="incorrect-notes-page__icon" aria-hidden="true">!</div>
      </header>
      <NotesSummary items={dummyIncorrectSummary} />
      <div className="incorrect-notes-page__content">
        <section className="incorrect-notes-page__problems" aria-labelledby="incorrect-problems-title">
          <header><div><p>다시 풀어보기</p><h2 id="incorrect-problems-title">최근 오답 문제</h2></div><span>{visibleProblems.length}문제</span></header>
          <div className="incorrect-notes-page__filters" role="group" aria-label="문제 유형 필터">
            {filters.map((filter) => <button key={filter} type="button" className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
          <div className="incorrect-notes-page__grid">
            {visibleProblems.map((problem) => <IncorrectProblemCard key={problem.id} problem={problem} />)}
          </div>
        </section>
        <WeakConceptList concepts={dummyWeakConcepts} />
      </div>
    </div>
  );
}

export default IncorrectNotesPage;
