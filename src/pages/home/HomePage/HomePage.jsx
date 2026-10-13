import HomeHero from '../../../components/home/HomeHero/HomeHero';
import LearningOverview from '../../../components/home/LearningOverview/LearningOverview';
import RecentLearning from '../../../components/home/RecentLearning/RecentLearning';
import StudySummary from '../../../components/home/StudySummary/StudySummary';
import WeakConcepts from '../../../components/home/WeakConcepts/WeakConcepts';
import { dummyHomeHero, dummyRecentRecords, dummyStudyCategories, dummyStudySummary, dummyWeakConcepts } from '../../../constants/dummy/dummyHome';
import './HomePage.css';

/** 홈 화면의 세부 학습 컴포넌트를 조합합니다. */
function HomePage() {
  return (
    <div className="home-page">
      <HomeHero hero={dummyHomeHero} />
      <StudySummary items={dummyStudySummary} />
      <div className="home-grid">
        <LearningOverview categories={dummyStudyCategories} />
        <WeakConcepts concepts={dummyWeakConcepts} />
      </div>
      <RecentLearning records={dummyRecentRecords} />
    </div>
  );
}

export default HomePage;
