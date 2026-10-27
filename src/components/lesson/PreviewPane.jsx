import { PanelEdgeToggle } from './PanelEdgeToggle.jsx';
import './PreviewPane.css';

export function PreviewPane({ code, onClose }) {
  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <div className="preview-label">
          <span className="preview-indicator" aria-hidden="true" />웹 뷰 미리보기
        </div>
      </div>
      <iframe title="웹 뷰 미리보기" sandbox="" srcDoc={code} />
      <PanelEdgeToggle open onToggle={onClose} />
    </div>
  );
}
