/** 작성한 코드를 브라우저 미리보기로 표시합니다. */
export function PreviewPane({ code, onCollapse }) {
  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <div className="preview-label"><span className="preview-indicator" aria-hidden="true" />웹 뷰 미리보기</div>
        <button type="button" className="panel-toggle preview-collapse" aria-label="웹 뷰 미리보기 닫기" title="웹 뷰 미리보기 닫기" onClick={onCollapse}>‹</button>
      </div>
      <iframe title="웹 뷰 미리보기" sandbox="" srcDoc={code} />
    </div>
  )
}
