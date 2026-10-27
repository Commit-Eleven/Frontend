import './QuestionHeader.css';

/** 문제 진행 단계와 유형을 표시합니다. */
export function QuestionHeader({ step, label }) {
  return (
    <div className="precheck-eyebrow">
      <span>{step}</span> {label}
    </div>
  );
}
