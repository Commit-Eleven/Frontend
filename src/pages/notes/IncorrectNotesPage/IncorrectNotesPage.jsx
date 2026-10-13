import IncorrectProblemCard from '../../../components/notes/IncorrectProblemCard/IncorrectProblemCard';
import NotesHero from '../../../components/notes/NotesHero/NotesHero';
import WeakConceptList from '../../../components/notes/WeakConceptList/WeakConceptList';
import { dummyIncorrectProblems, dummyIncorrectSummary, dummyWeakConcepts } from '../../../constants/dummy/dummyIncorrectNotes';
import './IncorrectNotesPage.css';

/** 오답을 유형별로 확인하고 다시 학습할 수 있는 페이지입니다. */
function IncorrectNotesPage() {
  return (
    <div className="incorrect-notes-page">
      <NotesHero />
      <div className="incorrect-notes-page__content">
        <section className="incorrect-notes-page__problems" aria-labelledby="incorrect-problems-title">
          <header>
            <h2 id="incorrect-problems-title">틀린 문제</h2>
          </header>
          {dummyIncorrectProblems.length ? (
            <div className="incorrect-notes-page__list">
              {dummyIncorrectProblems.map((problem) => <IncorrectProblemCard key={problem.id} problem={problem} />)}
            </div>
          ) : (
            <div className="incorrect-notes-page__empty"><b>✓</b><strong>해당 유형의 오답이 없어요.</strong><span>다른 유형의 문제를 선택해보세요.</span></div>
          )}
        </section>
        <WeakConceptList concepts={dummyWeakConcepts} summary={dummyIncorrectSummary} />
      </div>
    </div>
  );
}

export default IncorrectNotesPage;
