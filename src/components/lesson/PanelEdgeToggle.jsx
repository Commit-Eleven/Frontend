/** 패널 가장자리에 붙는 열기/닫기 핸들입니다. */
export function PanelEdgeToggle({ panel, open, onToggle }) {
  const label = panel === 'theory' ? '이론' : '웹 뷰 미리보기'

  return (
    <button
      type="button"
      className={`panel-edge-toggle panel-edge-toggle--${panel}${open ? ' is-open' : ''}`}
      aria-label={`${label} ${open ? '접기' : '열기'}`}
      aria-expanded={open}
      title={`${label} ${open ? '접기' : '열기'}`}
      onClick={onToggle}
    >
      <span className="panel-edge-toggle-arrow" aria-hidden="true">{open ? '‹' : '›'}</span>
      <span className="panel-edge-toggle-grip" aria-hidden="true" />
    </button>
  )
}
