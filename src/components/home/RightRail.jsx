import { useEffect, useState } from 'react';
import { authorizationHeaders } from '../../api/auth.js';
import { expSummary, fetchHome, fetchMyExp, fetchRanking } from '../../api/learning.js';
import { icon } from '../../lib/assets.js';
import { wasSolvedOnDate } from '../../lib/studyActivity.js';
import { Stats } from '../common/Stats.jsx';
import { UnitDetailModal } from './UnitDetailModal.jsx';
import './RightRail.css';

const tierNames = { normal: '학습자', creator: '크리에이터', admin: '관리자' };

export function RightRail({ onNavigate }) {
  const loggedIn = Boolean(authorizationHeaders().Authorization);
  const [exp, setExp] = useState(null);
  const [home, setHome] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [unitOpen, setUnitOpen] = useState(false);

  useEffect(() => {
    if (!loggedIn) return undefined;
    const controller = new AbortController();
    const { signal } = controller;
    fetchMyExp({ signal }).then((data) => setExp(expSummary(data))).catch(() => {});
    fetchHome({ signal }).then(setHome).catch(() => {});
    fetchRanking({ page: 1, size: 3 }, { signal }).then(setRanking).catch(() => {});
    return () => controller.abort();
  }, [loggedIn]);

  const latest = exp?.recent[0];
  const unit = home?.currentUnit;
  const recommendations = home?.recommendations.slice(0, 2) ?? [];
  const topRanks = ranking?.items.slice(0, 3) ?? [];
  const meInTop = topRanks.some((row) => row.isMe);

  return (
    <aside className="right-rail">
      <Stats hasSolvedToday={wasSolvedOnDate(latest?.createdAt)} />
      <div className="rail-card level-card">
        <div className="level-avatar">XP</div>
        <div className="level-info">
          {exp ? (
            <>
              <div className="level-top">
                <strong>{exp.totalExp.toLocaleString()} XP</strong>
                <span className="level-tier">{tierNames[exp.tier] || exp.tier}</span>
              </div>
              <small>{latest ? `최근 +${latest.amount} XP${latest.problemTitle ? ' · ' + latest.problemTitle : ''}` : '문제를 맞히면 XP가 쌓여요.'}</small>
            </>
          ) : (
            <>
              <div className="level-top"><strong>내 경험치</strong></div>
              <small>{loggedIn ? '경험치를 불러오는 중…' : '로그인하면 XP가 기록돼요.'}</small>
            </>
          )}
        </div>
      </div>

      {unit && (
        <div className="rail-card unit-card">
          <div className="rail-heading">
            <strong>이어서 학습</strong>
            <button type="button" onClick={() => setUnitOpen(true)}>단원 보기</button>
          </div>
          <p className="unit-card-course">{unit.courseTitle}</p>
          <h3>{unit.title}</h3>
          <div className="unit-card-track" aria-label={`${unit.total}문제 중 ${unit.solved}문제 해결`}>
            <span style={{ width: (unit.total ? Math.round((unit.solved / unit.total) * 100) : 0) + '%' }} />
          </div>
          <small className="unit-card-meta">
            {unit.solved} / {unit.total}문제
            {unit.nextStageTitle ? ` · ${unit.remainingToUnlock}문제 더 맞히면 '${unit.nextStageTitle}' 열림` : ''}
          </small>
          {recommendations.length > 0 && (
            <ul className="unit-card-list">
              {recommendations.map((item) => (
                <li key={item.problemId}>
                  <span>{item.title}<small>{item.typeLabel}</small></span>
                  <b>+{item.xp} XP</b>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="rail-card leaderboard-card">
        <div className="rail-heading">
          <strong>리더보드</strong>
          {onNavigate && <button type="button" onClick={() => onNavigate('랭킹')}>보기</button>}
        </div>
        {topRanks.length ? (
          <>
            <ol className="rail-rank-list">
              {topRanks.map((user) => (
                <li className={'rail-rank-row' + (user.isMe ? ' is-me' : '')} key={user.userId ?? user.rank}>
                  <span className="rail-rank-number">{user.rank}</span>
                  <span className="rail-rank-name">{user.nickname || '학습자'}</span>
                  <b>{user.totalExp.toLocaleString()} XP</b>
                </li>
              ))}
            </ol>
            {ranking.me && !meInTop && (
              <div className="rail-rank-row is-me rail-rank-me">
                <span className="rail-rank-number">{ranking.me.rank}</span>
                <span className="rail-rank-name">나</span>
                <b>{ranking.me.totalExp.toLocaleString()} XP</b>
              </div>
            )}
          </>
        ) : (
          <div className="leaderboard-inner">
            <img src={icon('leaderboard/locked')} alt="" />
            <p>{loggedIn ? '학습을 시작하여 XP를 획득하고 리더보드에 참여하세요!' : '로그인하면 리더보드에 참여할 수 있어요!'}</p>
          </div>
        )}
      </div>
      {unitOpen && unit && <UnitDetailModal unitId={unit.unitId} onClose={() => setUnitOpen(false)} />}
    </aside>
  );
}
