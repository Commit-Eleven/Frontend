import { useState } from 'react'
import { icon } from '../../utils/assets.js'
import { initialCompleted } from '../../constants/dummy/journey.js'
import { Stats } from '../common/Stats.jsx'

/** 홈의 학습 통계와 추가 학습 카드를 표시합니다. */
export function RightRail({ completedCount }) {
  const [flipped, setFlipped] = useState(false)
  const earned = Math.max(0, completedCount - initialCompleted.length)
  const earnedXp = earned * 20
  return (
    <aside className="right-rail">
      <Stats />
      <div className="rail-card level-card">
        <div className="level-avatar">⋯</div>
        <div className="level-info"><div className="level-top"><strong>레벨 2</strong><div className="level-progress"><span style={{ width: Math.min(100, 72 + earnedXp * 0.54) + '%' }} /></div></div><small>킬로  {Math.max(0, 52 - earnedXp)} XP 남음</small></div>
      </div>
      <div className="rail-card daily-card">
        <div className="rail-heading"><strong>오늘의 HTML 카드</strong><button onClick={() => setFlipped(!flipped)}>{flipped ? '다시 보기' : '뒤집기'}</button></div>
        <p>{flipped ? 'HTML은 1989년 팀 버너스리가 웹 문서를 공유하기 위해 고안했어요.' : '1989 · 상사는 이 제안서를 어떻게 생각했을까요?'}</p>
        <div className="card-watermark">⌁</div>
      </div>
      <div className="rail-card leaderboard-card">
        <div className="rail-heading"><strong>리더보드</strong><span>보기</span></div>
        <div className="leaderboard-inner"><img src={icon('leaderboard/locked')} alt="" /><p>학습을 시작하여 XP를 획득하고 이번 주 리더보드에 참여하세요!</p></div>
      </div>
    </aside>
  )
}
