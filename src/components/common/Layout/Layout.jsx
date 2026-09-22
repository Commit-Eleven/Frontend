import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

/** 사이드바와 중앙 콘텐츠 영역으로 구성된 공통 화면 레이아웃입니다. */
function Layout({ activeItem, children, contentClassName = '', contentLabel }) {
  return (
    <div className="app-layout">
      <Sidebar activeItem={activeItem} />
      <main className={`app-content ${contentClassName}`.trim()} aria-label={contentLabel}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
