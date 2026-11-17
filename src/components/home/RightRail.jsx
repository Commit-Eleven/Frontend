import { memo, useMemo } from 'react';
import { icon } from '../../lib/assets.js';
import { wasSolvedOnDate } from '../../lib/studyActivity.js';
import { LoadingSkeleton } from '../common/LoadingSkeleton.jsx';
import { Stats } from '../common/Stats.jsx';
import { chapterTitleFor } from '../../data/curricula.js';
import './RightRail.css';

const tierNames = { normal: '학습자', creator: '크리에이터', admin: '관리자' };

/** 선택한 언어의 로컬 커리큘럼과 로컬 진행도로 '이어서 학습' 카드를 만듭니다. */
function currentLesson(journey, completed, active) {
  const lessons = journey.allMainLessons;
  const next = lessons.find((lesson) => lesson.id === active) ?? lessons.find((lesson) => !completed.includes(lesson.id));
  if (!next) return null;
  const chapterIndex = journey.chapterData.findIndex((chapter) =>
    chapter.rows.some((row) => row.main.id === next.id || row.side?.id === next.id),
  );
  const chapter = journey.chapterData[chapterIndex];
  const remainingInChapter = chapter
    ? chapter.rows.filter((row) => !completed.includes(row.main.id)).length
    : 0;
  return {
    courseTitle: journey.title,
    chapterTitle: chapterTitleFor(next.id, journey),
    title: next.title,
    // 처음 쓰는 사람도 진행이 보이도록 코스 전체가 아니라 현재 챕터 기준으로 계산합니다.
    solved: chapter
      ? chapter.rows.filter((row) => completed.includes(row.main.id)).length
      : lessons.filter((lesson) => completed.includes(lesson.id)).length,
    total: chapter ? chapter.rows.length : lessons.length,
    remainingInChapter,
    nextChapterTitle: journey.chapterData[chapterIndex + 1]?.title ?? journey.nextSectionTitle,
  };
}

export const RightRail = memo(function RightRail({ onNavigate, summary, journey, completed = [], active, onSyllabus }) {
  const { exp, ranking, loggedIn } = summary;

  const latest = exp?.recent[0];
  const unit = useMemo(
    () => (journey ? currentLesson(journey, completed, active) : null),
    [journey, completed, active],
  );
  const topRanks = ranking?.items.slice(0, 3) ?? [];
  const meInTop = topRanks.some((row) => row.isMe);

  return (
    <aside className="right-rail">
      <Stats streakDays={summary.home?.stats.streakDays ?? 0} hasSolvedToday={wasSolvedOnDate(latest?.createdAt)} />
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
              {loggedIn ? <LoadingSkeleton variant="xp" label="경험치를 불러오는 중" /> : (
                <>
                  <div className="level-top"><strong>내 경험치</strong></div>
                  <small>로그인하면 XP가 기록돼요.</small>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {unit && (
        <div className="rail-card unit-card">
          <div className="rail-heading">
            <strong>이어서 학습</strong>
            {onSyllabus && <button type="button" onClick={onSyllabus}>강의 계획</button>}
          </div>
          <p className="unit-card-course">{unit.courseTitle} · {unit.chapterTitle}</p>
          <h3>{unit.title}</h3>
          <div className="unit-card-track" aria-label={`${unit.total}개 레슨 중 ${unit.solved}개 완료`}>
            <span style={{ width: (unit.total ? Math.round((unit.solved / unit.total) * 100) : 0) + '%' }} />
          </div>
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
    </aside>
  );
});
