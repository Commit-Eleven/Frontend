import './LearningOverview.css';

/** 학습 중인 과목과 과목별 진척도를 표시합니다. */
function LearningOverview({ categories }) {
  return <section className="home-section"><div className="home-section__header"><div><p className="home-section__eyebrow">학습 현황</p><h2>계속 학습하기</h2></div><a href="#/learn">전체 보기</a></div><div className="home-categories">{categories.map((category) => <a href="#/learn" className="home-category" key={category.title}><span className="home-category__icon">{category.icon}</span><div className="home-category__content"><strong>{category.title}</strong><p>{category.detail}</p><div className="home-category__progress"><i style={{ width: `${category.progress}%` }} /></div></div><b>{category.progress}%</b></a>)}</div></section>;
}

export default LearningOverview;
