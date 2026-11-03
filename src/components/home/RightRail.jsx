import { useEffect, useState } from 'react';
import { fetchMyExp, fetchRanking, levelSummary } from '../../api/learning.js';
import { icon } from '../../lib/assets.js';
import { Stats } from '../common/Stats.jsx';
import './RightRail.css';

export function RightRail({ completedCount, initialCompletedCount = 0 }) {
  const [exp, setExp] = useState(null);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchMyExp({ signal: controller.signal }).then(setExp).catch(() => {});
    fetchRanking({ signal: controller.signal }).then(setRanking).catch(() => {});
    return () => controller.abort();
  }, []);

  const earned = Math.max(0, completedCount - initialCompletedCount);
  const earnedXp = earned * 20;
  const server = levelSummary(exp);
  const level = server?.level ?? 2;
  const percent = server?.percent ?? Math.min(100, 72 + earnedXp * 0.54);
  const remaining = server?.remaining ?? Math.max(0, 52 - earnedXp);
  const topRanks = ranking.slice(0, 3);
  return (
    <aside className="right-rail">
      <Stats />
      <div className="rail-card level-card">
        <div className="level-avatar">⋯</div>
        <div className="level-info">
          <div className="level-top">
            <strong>레벨 {level}</strong>
            <div className="level-progress">
              <span style={{ width: percent + '%' }} />
            </div>
          </div>
          <small>킬로 {remaining} XP 남음</small>
        </div>
      </div>
      <div className="rail-card leaderboard-card">
        <div className="rail-heading">
          <strong>리더보드</strong>
          <span>보기</span>
        </div>
        {topRanks.length ? (
          <ol className="rail-rank-list">
            {topRanks.map((user, index) => (
              <li className={'rail-rank-row' + (user.isMe ? ' is-me' : '')} key={user.id}>
                <span className="rail-rank-number">{user.rank || index + 1}</span>
                <span className="rail-rank-name">{user.nickname || '학습자'}</span>
                <b>{user.totalExp.toLocaleString()} XP</b>
              </li>
            ))}
          </ol>
        ) : (
          <div className="leaderboard-inner">
            <img src={icon('leaderboard/locked')} alt="" />
            <p>학습을 시작하여 XP를 획득하고 이번 주 리더보드에 참여하세요!</p>
          </div>
        )}
      </div>
    </aside>
  );
}
