import { useEffect, useState } from 'react';
import { authorizationHeaders } from '../../api/auth.js';
import { fetchCurriculum } from '../../api/learning.js';
import { ModalBackdrop } from '../common/ModalBackdrop.jsx';
import './SyllabusModal.css';

export function SyllabusModal({ journey, onClose, onJump, completedCount }) {
  const { chapterData } = journey;
  const [courses, setCourses] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!authorizationHeaders().Authorization) return undefined;
    const controller = new AbortController();
    fetchCurriculum({ signal: controller.signal })
      .then((data) => setCourses(Array.isArray(data?.curriculum) ? data.curriculum : []))
      .catch(() => { if (!controller.signal.aborted) setLoadError('서버 강의 계획을 불러오지 못했어요.'); });
    return () => controller.abort();
  }, []);
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
        {loadError && <p role="status">{loadError}</p>}
        {courses.length > 0 && (
          <div className="syllabus-list" aria-label="서버 강의 계획">
            {courses.map((course) => (
              <section key={course.courseId}>
                <h3>{course.title}</h3>
                {(course.units || []).map((unit) => (
                  <p key={unit.unitId}>{unit.order}. {unit.title}</p>
                ))}
              </section>
            ))}
          </div>
        )}
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
