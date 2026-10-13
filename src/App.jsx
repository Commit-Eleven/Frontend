import { useEffect, useState } from 'react';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/home/HomePage/HomePage';
import IncorrectNotesPage from './pages/notes/IncorrectNotesPage/IncorrectNotesPage';
import LearningPage from './pages/problem/LearningPage/LearningPage';
import './styles/Quiz.css';

/** 현재 URL 해시에서 활성 메뉴를 반환합니다. */
function getCurrentPage() {
  return window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0] || 'home';
}

function App() {
  const [activeItem, setActiveItem] = useState(getCurrentPage);
  const isLearningPage = activeItem === 'learn';
  const isNotesPage = activeItem === 'notes';
  const isIncorrectReview = isLearningPage && window.location.hash.includes('mode=incorrect');

  useEffect(() => {
    const handleHashChange = () => setActiveItem(getCurrentPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /** 홈 화면으로 이동합니다. */
  const handleLeaveLearning = () => {
    window.location.hash = isIncorrectReview ? '#/notes' : '#/';
  };

  return (
    <Layout
      activeItem={activeItem}
      contentClassName={isLearningPage ? 'app-content--learning' : 'app-content--home'}
      contentLabel={isLearningPage ? '문제 풀이' : isNotesPage ? '오답 노트' : '홈'}
    >
      {isLearningPage ? <LearningPage onGoHome={handleLeaveLearning} isIncorrectReview={isIncorrectReview} /> : isNotesPage ? <IncorrectNotesPage /> : <HomePage />}
    </Layout>
  );
}

export default App;
