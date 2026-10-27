import { useEffect, useState } from 'react';
import { readWrongNotes, wrongNotesChangeEvent } from '../../lib/wrongNotes.js';
import { WrongNotesPractice } from './WrongNotesPractice.jsx';
import './WrongNotes.css';

const typeLabels = {
  mcq: '선택형',
  blank: '빈칸 채우기',
  parsons: '순서 맞추기',
  short: '단답형',
  code: '코드 작성',
};

const conceptTypes = new Set(['mcq', 'blank', 'parsons', 'short']);

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric' }).format(date);
}

function useWrongNotes() {
  const [notes, setNotes] = useState(readWrongNotes);
  useEffect(() => {
    const refresh = () => setNotes(readWrongNotes());
    window.addEventListener(wrongNotesChangeEvent, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(wrongNotesChangeEvent, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return notes;
}

export function WrongNotes({ language, onOpen }) {
  const allNotes = useWrongNotes();
  const languageNotes = allNotes
    .filter((note) => note.language === language.code)
    .sort((first, second) => new Date(second.lastWrongAt) - new Date(first.lastWrongAt));
  const [filter, setFilter] = useState('unresolved');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sessionNotes, setSessionNotes] = useState(null);
  const unresolved = languageNotes.filter((note) => note.status !== 'resolved');
  const resolved = languageNotes.filter((note) => note.status === 'resolved');
  const conceptNotes = unresolved.filter((note) => conceptTypes.has(note.type));
  const statusNotes = filter === 'unresolved' ? unresolved : resolved;
  const availableTypes = [...new Set(statusNotes.map((note) => note.type))];
  const visibleNotes = typeFilter === 'all'
    ? statusNotes
    : statusNotes.filter((note) => note.type === typeFilter);

  if (sessionNotes) {
    return (
      <WrongNotesPractice
        notes={sessionNotes}
        language={language}
        onExit={() => setSessionNotes(null)}
      />
    );
  }

  return (
    <section className="wrong-notes-page" aria-label="오답 노트">
      <div className="wrong-notes-intro">
        <p className="wrong-notes-eyebrow">{language.label} · 학습 기록</p>
        <h2>오답 노트</h2>
        <p>틀렸던 문제를 다시 풀고, 이해한 개념을 확인해 보세요.</p>
      </div>

      <div className="wrong-notes-feature">
        <div className="wrong-notes-feature-copy">
          <span className="wrong-notes-feature-label">맞춤형 복습</span>
          <h3>실수한 개념부터 다시 연습해요</h3>
          <p>
            {conceptNotes.length > 0
              ? '개념 오답 ' + conceptNotes.length + '개를 한 문제씩 풀어볼 수 있어요.'
              : '복습할 개념 오답이 생기면 여기서 시작할 수 있어요.'}
          </p>
          <button
            type="button"
            disabled={conceptNotes.length === 0}
            onClick={() => setSessionNotes([...conceptNotes])}
          >
            복습 시작 <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="wrong-notes-feature-art" aria-hidden="true">
          <span className="wrong-notes-feature-card is-back" />
          <span className="wrong-notes-feature-card is-front">✓</span>
        </div>
      </div>

      <div className="wrong-notes-list-heading">
        <h3>문제 기록</h3>
        <span>코드 오답은 원래 문제에서 다시 풀 수 있어요.</span>
      </div>
      <div className="wrong-notes-tabs" role="tablist" aria-label="오답 노트 보기">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'unresolved'}
          className={filter === 'unresolved' ? 'is-active' : ''}
          onClick={() => { setFilter('unresolved'); setTypeFilter('all'); }}
        >
          다시 풀 문제 <span>{unresolved.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'resolved'}
          className={filter === 'resolved' ? 'is-active' : ''}
          onClick={() => { setFilter('resolved'); setTypeFilter('all'); }}
        >
          복습 완료 <span>{resolved.length}</span>
        </button>
      </div>

      {availableTypes.length > 1 && (
        <div className="wrong-notes-type-filters" role="group" aria-label="문제 유형">
          {['all', ...availableTypes].map((type) => (
            <button
              key={type}
              type="button"
              className={typeFilter === type ? 'is-active' : ''}
              aria-pressed={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? '전체' : typeLabels[type] || '문제'}
            </button>
          ))}
        </div>
      )}

      {visibleNotes.length ? (
        <div className="wrong-notes-list">
          {visibleNotes.map((note) => {
            const codeNote = note.type === 'code';
            return (
              <article className="wrong-note-card" key={note.id}>
                <div className="wrong-note-card-meta">
                  <span className="wrong-note-type">{typeLabels[note.type] || '문제'}</span>
                  <span>{note.lessonTitle || language.label}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(note.lastWrongAt)}</span>
                </div>
                <h4>{note.problem.title}</h4>
                <p>{note.problem.description || '이 문제를 다시 풀어보세요.'}</p>
                <div className="wrong-note-card-bottom">
                  <span>{note.status === 'resolved' ? '복습 완료' : note.wrongCount + '회 오답'}</span>
                  <button
                    type="button"
                    onClick={() => codeNote ? onOpen(note.lessonId) : setSessionNotes([note])}
                  >
                    {codeNote ? '코드 문제로 이동' : '다시 풀기'} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="wrong-notes-empty">
          <span className="wrong-notes-empty-icon" aria-hidden="true">✓</span>
          <h3>{filter === 'unresolved' ? '다시 풀 문제가 없어요' : '아직 완료한 복습이 없어요'}</h3>
          <p>{filter === 'unresolved'
            ? '학습 중 틀린 문제는 여기에 모아둘게요.'
            : '오답 문제를 맞히면 이곳에서 다시 볼 수 있어요.'}</p>
        </div>
      )}
    </section>
  );
}
