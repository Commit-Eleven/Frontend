import { icon } from '../../lib/assets.js';
import { Stats } from '../common/Stats.jsx';
import './RightRail.css';

export function RightRail({ completedCount, initialCompletedCount = 0 }) {
  const earned = Math.max(0, completedCount - initialCompletedCount);
  const earnedXp = earned * 20;
  return (
    <aside className="right-rail">
      <Stats />
      <div className="rail-card level-card">
        <div className="level-avatar">⋯</div>
        <div className="level-info">
          <div className="level-top">
            <strong>레벨 2</strong>
            <div className="level-progress">
              <span style={{ width: Math.min(100, 72 + earnedXp * 0.54) + '%' }} />
            </div>
          </div>
          <small>킬로 {Math.max(0, 52 - earnedXp)} XP 남음</small>
        </div>
      </div>
      <div className="rail-card leaderboard-card">
        <div className="rail-heading">
          <strong>리더보드</strong>
          <span>보기</span>
        </div>
        <div className="leaderboard-inner">
          <img src={icon('leaderboard/locked')} alt="" />
          <p>학습을 시작하여 XP를 획득하고 이번 주 리더보드에 참여하세요!</p>
        </div>
      </div>
    </aside>
  );
}
