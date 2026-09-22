import { useEffect, useState } from 'react';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/home/HomePage/HomePage';

/** 현재 URL 해시에서 활성 메뉴를 반환합니다. */
function getCurrentPage() {
  return window.location.hash.replace(/^#\/?/, '').split('/')[0] || 'home';
}

/** 공통 레이아웃 안에 홈 화면을 렌더링합니다. */
function App() {
  const [activeItem, setActiveItem] = useState(getCurrentPage);

  useEffect(() => {
    const handleHashChange = () => setActiveItem(getCurrentPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Layout activeItem={activeItem} contentClassName="app-content--home" contentLabel="홈">
      <HomePage />
    </Layout>
  );
}

export default App;
