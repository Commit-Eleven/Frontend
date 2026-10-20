import { useEffect, useState } from 'react'
import { HtmlEditor } from './HtmlEditor.jsx'
import { TestPanel } from './TestPanel.jsx'
import { PreviewPane } from './PreviewPane.jsx'
import { PanelEdgeToggle } from './PanelEdgeToggle.jsx'

/** 코드 편집기, 미리보기, 테스트 결과 패널을 조합합니다. */
export function CodeWorkspace({ code, onCodeChange, onRun, checks, tests }) {
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [testTab, setTestTab] = useState('tests')
  const [testOpen, setTestOpen] = useState(true)

  /** 웹 미리보기 패널을 닫습니다. */
  const handlePreviewCollapse = () => {
    if (window.matchMedia('(max-width: 980px)').matches) setMobilePreviewOpen(false)
    else setPreviewOpen(false)
  }

  /** 코드 실행을 요청하고 테스트 패널을 엽니다. */
  const handleRunCode = () => {
    setTestTab('tests')
    setTestOpen(true)
    onRun()
  }

  useEffect(() => {
    /** 키보드 단축키로 코드를 실행합니다. */
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        setTestTab('tests')
        setTestOpen(true)
        onRun()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRun])

  return (
    <div className={'coding-workspace' + (mobilePreviewOpen ? ' show-mobile-preview' : '') + (previewOpen ? '' : ' preview-collapsed')}>
      <div className="code-pane">
        <div className="code-toolbar">
          <span className="code-language" title="Emmet 약어는 Tab 키로 확장합니다">HTML</span>
          <div>
            <button type="button" className="mobile-preview-trigger" aria-label="웹 뷰 미리보기 열기" title="웹 뷰 미리보기 열기" onClick={() => { setPreviewOpen(true); setMobilePreviewOpen(true) }}>›</button>
          </div>
        </div>
        <div className="editor-region">
          <HtmlEditor value={code} onChange={onCodeChange} />
        </div>
        <div className="editor-actions"><button type="button" className="handleRunCode-button" onClick={handleRunCode}>▶ 코드 실행</button></div>
        <TestPanel checks={checks} tests={tests} tab={testTab} onTabChange={setTestTab} open={testOpen} onToggle={() => setTestOpen(!testOpen)} />
      </div>
      {previewOpen && <PreviewPane code={code} onClose={handlePreviewCollapse} />}
      {!previewOpen && <PanelEdgeToggle open={false} onToggle={() => setPreviewOpen(true)} />}
    </div>
  )
}
