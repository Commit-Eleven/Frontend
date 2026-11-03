/** 웹 뷰 미리보기 영역 안쪽 가장자리에서 여닫는 버튼입니다. */
import './PanelEdgeToggle.css';

export function PanelEdgeToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      className="panel-edge-toggle--preview"
      aria-label={`웹 뷰 미리보기 ${open ? '접기' : '열기'}`}
      aria-expanded={open}
      title={`웹 뷰 미리보기 ${open ? '접기' : '열기'}`}
      onClick={onToggle}
    >
      <span aria-hidden="true">{open ? '‹' : '›'}</span>
    </button>
  );
}
