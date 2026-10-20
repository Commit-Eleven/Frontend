import { chapterData } from '../../constants/dummy/journey.js'

/** 챕터 목록과 학습 진행률을 모달로 표시합니다. */
export function SyllabusModal({ onClose, onJump, completedCount }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="syllabus-modal" role="dialog" aria-modal="true" aria-label="강의 계획" onMouseDown={(e) => e.stopPropagation()}>
        <div className="syllabus-heading"><div><small>섹션 1</small><h2>HTML 기초</h2><p>웹 페이지를 처음부터 만드는 핵심 구조와 구문을 배워보세요</p></div><button onClick={onClose} aria-label="닫기">×</button></div>
        <div className="syllabus-progress"><span>{completedCount}/60 레슨 완료</span><div><i style={{ width: Math.min(100, completedCount / 60 * 100) + '%' }} /></div></div>
        <div className="syllabus-list">{chapterData.map((chapter, index) => <button key={chapter.title} onClick={() => onJump(index)}><span className="syllabus-number">{index + 1}</span><span><b>{chapter.title}</b><small>{chapter.rows.length}개 레슨</small></span><span>›</span></button>)}</div>
      </div>
    </div>
  )
}
