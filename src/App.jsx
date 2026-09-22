import Layout from './components/common/Layout/Layout';
import LearningPage from './pages/problem/LearningPage/LearningPage';
import './styles/Quiz.css';

/** 문제 풀이 전용 화면을 공통 레이아웃 안에 렌더링합니다. */
function App() {
  /** 학습 완료 후 첫 문제로 다시 이동합니다. */
  const handleGoHome = () => {
    window.location.hash = '#/learn';
    window.location.reload();
  };

  return (
    <Layout activeItem="learn" contentLabel="문제 풀이">
      <LearningPage onGoHome={handleGoHome} />
    </Layout>
  );
}

export default App;
