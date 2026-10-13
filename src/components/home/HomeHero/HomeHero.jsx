import './HomeHero.css';

/** 홈의 인사말과 학습 시작 버튼을 표시합니다. */
function HomeHero({ hero }) {
  return <section className="home-hero"><div><p className="home-eyebrow">{hero.eyebrow}</p><h1>{hero.title[0]}<br />{hero.title[1]}</h1><p className="home-hero__description">{hero.description}</p><a className="home-hero__button" href="#/learn">학습 시작하기 <span>→</span></a></div><div className="home-hero__visual" aria-hidden="true"><span className="home-hero__spark home-hero__spark--one">&lt;/&gt;</span><span className="home-hero__spark home-hero__spark--two">{ }</span><div className="home-hero__circle"><span>{hero.streak}</span><small>day<br />streak</small></div></div></section>;
}

export default HomeHero;
