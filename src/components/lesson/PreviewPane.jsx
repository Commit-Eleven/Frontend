import { PanelEdgeToggle } from './PanelEdgeToggle.jsx'

/** 작성한 코드를 브라우저 미리보기로 표시합니다. */
export function PreviewPane({ code, onClose }) {
  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <div className="preview-label"><span className="preview-indicator" aria-hidden="true" />웹 뷰 미리보기</div>
      </div>
      <iframe title="웹 뷰 미리보기" sandbox="" srcDoc={code} />
      <PanelEdgeToggle open onToggle={onClose} />
    </div>
  )
}
