import { useEffect, useRef, useState } from 'react';
import { HtmlEditor } from './HtmlEditor.jsx';
import { TextCodeEditor } from './TextCodeEditor.jsx';
import { TestPanel } from './TestPanel.jsx';
import { PreviewPane } from './PreviewPane.jsx';
import { PanelEdgeToggle } from './PanelEdgeToggle.jsx';
import { PanelResizeHandle } from './PanelResizeHandle.jsx';
import './CodeWorkspace.css';

const languageLabels = { html: 'HTML', javascript: 'JavaScript', python: 'Python', java: 'Java' };

export function CodeWorkspace({ code, onCodeChange, onRun, checks, tests, language = 'html', answer }) {
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(language === 'html');
  const [testTab, setTestTab] = useState('tests');
  const [testOpen, setTestOpen] = useState(true);
  const [previewWidth, setPreviewWidth] = useState(null);
  const [workspaceWidth, setWorkspaceWidth] = useState(() => window.innerWidth * 0.5);
  const [isResizingPreview, setIsResizingPreview] = useState(false);
  const workspaceRef = useRef(null);
  const isHtml = language === 'html';
  const previewMinWidth = 280;
  const previewMaxWidth = Math.max(
    previewMinWidth,
    Math.min(720, workspaceWidth - 320 - 10),
  );
  const defaultPreviewWidth = Math.max(previewMinWidth, (workspaceWidth - 10) / 2);
  const boundedPreviewWidth = previewWidth === null
    ? defaultPreviewWidth
    : Math.max(previewMinWidth, Math.min(previewMaxWidth, previewWidth));

  useEffect(() => {
    const element = workspaceRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setWorkspaceWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const resizePreview = (width) =>
    setPreviewWidth(Math.max(previewMinWidth, Math.min(previewMaxWidth, width)));
  const previewWidthFromPointer = (clientX) => {
    const bounds = workspaceRef.current?.getBoundingClientRect();
    return bounds ? bounds.right - clientX - 5 : boundedPreviewWidth;
  };

  const closePreview = () => {
    if (window.matchMedia('(max-width: 980px)').matches) setMobilePreviewOpen(false);
    else setPreviewOpen(false);
  };

  const run = () => {
    setTestTab('tests');
    setTestOpen(true);
    onRun();
  };

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        setTestTab('tests');
        setTestOpen(true);
        onRun();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRun]);

  return (
    <div
      ref={workspaceRef}
      className={
        'coding-workspace' +
        (!isHtml ? ' no-preview' : '') +
        (mobilePreviewOpen ? ' show-mobile-preview' : '') +
        (previewOpen ? '' : ' preview-collapsed') +
        (isResizingPreview ? ' is-resizing' : '')
      }
      style={{ '--preview-pane-width': `${boundedPreviewWidth}px` }}
    >
      <div className="code-pane">
        <div className="code-toolbar">
          <span
            className="code-language"
            title={isHtml
              ? '추천 코드는 입력 중 자동 표시됩니다. Ctrl+Space로 목록을 열 수 있습니다. Mac에서는 Option+`을 사용하세요. Emmet 약어는 Tab 키로 확장합니다.'
              : '추천 코드는 입력 중 자동 표시됩니다. Ctrl+Space로 목록을 열 수 있습니다. Mac에서는 Option+`을 사용하세요.'}
          >
            {languageLabels[language] || language}
          </span>
          <div>
            <span className="code-suggestion-hint">추천 코드 · Ctrl+Space / Mac ⌥+`</span>
            {isHtml && (
              <button
                type="button"
                className="mobile-preview-trigger"
                aria-label="웹 뷰 미리보기 열기"
                title="웹 뷰 미리보기 열기"
                onClick={() => {
                  setPreviewOpen(true);
                  setMobilePreviewOpen(true);
                }}
              >
                ›
              </button>
            )}
          </div>
        </div>
        <div className="editor-region">
          {isHtml ? (
            <HtmlEditor value={code} onChange={onCodeChange} />
          ) : (
            <TextCodeEditor value={code} onChange={onCodeChange} language={language} />
          )}
        </div>
        <div className="editor-actions">
          <button type="button" className="run-button" onClick={run}>
            ▶ 코드 실행
          </button>
        </div>
        <TestPanel
          checks={checks}
          tests={tests}
          tab={testTab}
          onTabChange={setTestTab}
          open={testOpen}
          onToggle={() => setTestOpen(!testOpen)}
          answerText={answer}
        />
      </div>
      {isHtml && previewOpen && (
        <>
          <PanelResizeHandle
            className="preview-resizer"
            label="웹 미리보기 너비 조절"
            value={boundedPreviewWidth}
            min={previewMinWidth}
            max={previewMaxWidth}
            onResize={resizePreview}
            getPointerValue={previewWidthFromPointer}
            onDragChange={setIsResizingPreview}
          />
          <PreviewPane code={code} onClose={closePreview} />
        </>
      )}
      {isHtml && !previewOpen && (
        <PanelEdgeToggle open={false} onToggle={() => setPreviewOpen(true)} />
      )}
    </div>
  );
}
