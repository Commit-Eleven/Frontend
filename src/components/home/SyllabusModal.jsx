import { ModalBackdrop } from '../common/ModalBackdrop.jsx';
import './SyllabusModal.css';

export function SyllabusModal({ journey, onClose, onJump, completedCount }) {
  const { chapterData } = journey;
  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="syllabus-modal"
        role="dialog"
        aria-modal="true"
        aria-label="강의 계획"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="syllabus-heading">
          <div>
            <small>섹션 1</small>
            <h2>{journey.title}</h2>
            <p>각 단계를 따라가며 핵심 개념을 배우고 직접 코드를 작성해 보세요.</p>
          </div>
          <button onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <div className="syllabus-progress">
          <span>{completedCount}/{journey.allMainLessons.length} 레슨 완료</span>
          <div>
            <i
              style={{
                width:
                  Math.min(100, (completedCount / Math.max(1, journey.allMainLessons.length)) * 100) +
                  '%',
              }}
            />
          </div>
        </div>
        <div className="syllabus-list">
          {chapterData.map((chapter, index) => (
            <button key={chapter.title} onClick={() => onJump(index)}>
              <span className="syllabus-number">{index + 1}</span>
              <span>
                <b>{chapter.title}</b>
                <small>{chapter.rows.length}개 레슨</small>
              </span>
              <span>›</span>
            </button>
          ))}
        </div>
      </div>
    </ModalBackdrop>
  );
}
