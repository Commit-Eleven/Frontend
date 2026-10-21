import { useEffect, useMemo, useRef, useState } from 'react';
import { ModalBackdrop } from '../common/ModalBackdrop.jsx';
import './SearchModal.css';

export function SearchModal({ journey, onClose, onPick }) {
  const { allMainLessons, chapterData } = journey;
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  useEffect(() => {
    searchRef.current?.focus();
  }, []);
  const matches = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q)
      return [
        { label: journey.title, subtitle: '섹션 1 · 현재', chapter: 0 },
        {
          label: chapterData[1]?.title ?? chapterData[0]?.title,
          subtitle: '섹션 1 · 챕터 2',
          chapter: 1,
        },
        { label: journey.nextSectionTitle, subtitle: '다음 섹션', chapter: chapterData.length - 1 },
      ];
    return [
      ...chapterData.map((c, index) => ({
        label: c.title,
        subtitle: '섹션 1 · 챕터 ' + (index + 1),
        chapter: index,
      })),
      ...allMainLessons.map((lesson) => ({
        label: lesson.title,
        subtitle: journey.title + ' · 레슨',
        id: lesson.id,
        chapter: chapterData.findIndex((c) => c.rows.some((r) => r.main.id === lesson.id)),
      })),
    ]
      .filter((item) => item.label.toLocaleLowerCase().includes(q))
      .slice(0, 12);
  }, [query, journey, allMainLessons, chapterData]);
  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="모든 콘텐츠 검색"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="search-input-row">
          <span>⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches[0]) onPick(matches[0]);
              if (e.key === 'Escape') onClose();
            }}
            placeholder="여정, 섹션, 코스, 학습 경로 검색"
            aria-label="모든 콘텐츠 검색"
          />
          <button aria-label="검색 닫기" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="search-results">
          {matches.length ? (
            matches.map((item, index) => (
              <button type="button" key={item.label + index} onClick={() => onPick(item)}>
                <span>{item.label}</span>
                <small>{item.subtitle}</small>
              </button>
            ))
          ) : (
            <p>
              검색 결과 없음: <b>{query}</b>
            </p>
          )}
        </div>
        <div className="search-help">
          <span>↑ ↓ 이동</span>
          <span>↵ 열기</span>
          <span>esc 닫기</span>
        </div>
      </div>
    </ModalBackdrop>
  );
}
