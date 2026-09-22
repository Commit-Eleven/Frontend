import Layout from './components/common/Layout/Layout';
import IncorrectNotesPage from './pages/notes/IncorrectNotesPage/IncorrectNotesPage';

/** 오답 노트 화면을 렌더링합니다. */
function App() {
  return (
    <Layout activeItem="notes" contentClassName="app-content--home" contentLabel="오답 노트">
      <IncorrectNotesPage />
    </Layout>
  );
}

export default App;
