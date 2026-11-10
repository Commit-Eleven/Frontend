import { journeyIcon } from '../../lib/assets.js';
import { statusFor } from '../../data/journey.js';
import './JourneyMap.css';

function Hex({ node, status, onClick, activeRef, iconType = node.type }) {
  const base = status === 'special' ? 'active' : status;
  const lesson =
    iconType === 'challenge'
      ? 'lesson-challenge'
      : status === 'done'
        ? iconType === 'trophy'
          ? 'lesson-trophy-done'
          : 'lesson-done'
        : 'lesson-' + iconType;
  return (
    <button
      type="button"
      ref={status === 'active' ? activeRef : undefined}
      className={'hex-node hex-' + status}
      onClick={onClick}
      aria-label={
        node.title +
        ' ' +
        (status === 'locked'
          ? '잠김'
          : status === 'done'
            ? '완료'
            : status === 'active'
              ? '계속하기'
              : '')
      }
    >
      <img className="hex-base" src={journeyIcon('hex-' + base + '-base')} alt="" />
      <img className="hex-shadow" src={journeyIcon('hex-' + base + '-shadow')} alt="" />
      <img className="hex-top" src={journeyIcon('hex-' + base + '-top')} alt="" />
      <img className="hex-symbol" src={journeyIcon(lesson)} alt="" />
    </button>
  );
}

export function MapChapter({
  chapter,
  chapterIndex,
  completed,
  active,
  selectedId,
  onSelect,
  onOpen,
  activeRef,
}) {
  const canvasHeight = chapter.rows.length * 101 + 38;
  const point = (index) => {
    if (chapterIndex === 0) return [190, 130, 190, 250, 190, 190][index] || 190;
    return [70, 130, 190, 250, 190, 130, 190][index % 7];
  };
  const selectedRow = chapter.rows.findIndex(
    (row) => row.main.id === selectedId || row.side?.id === selectedId,
  );
  const selectedNode =
    selectedRow >= 0 &&
    (chapter.rows[selectedRow].main.id === selectedId
      ? chapter.rows[selectedRow].main
      : chapter.rows[selectedRow].side);
  const selectedStatus = selectedNode ? statusFor(selectedNode, completed, active) : null;
  const selectedMain = selectedRow >= 0 && chapter.rows[selectedRow].main.id === selectedId;
  const selectedX =
    selectedRow >= 0
      ? selectedMain
        ? point(selectedRow)
        : point(selectedRow) + (point(selectedRow) <= 190 ? 120 : -120)
      : 0;
  return (
    <section className="map-chapter" id={'chapter-' + chapterIndex}>
      {chapterIndex === 0 ? (
        <h2 className="first-chapter-title">{chapter.title}</h2>
      ) : (
        <div className="chapter-divider">
          <span>{chapter.title}</span>
        </div>
      )}
      <div className="path-canvas" style={{ height: canvasHeight }}>
        <svg className="path-lines" viewBox={'0 0 380 ' + canvasHeight} aria-hidden="true">
          {chapter.rows.slice(0, -1).map((row, index) => {
            const x1 = point(index),
              x2 = point(index + 1),
              y1 = 62 + index * 101,
              y2 = 62 + (index + 1) * 101;
            const fromStatus = statusFor(row.main, completed, active);
            const toStatus = statusFor(chapter.rows[index + 1].main, completed, active);
            const unlockedConnection =
              ['done', 'special'].includes(fromStatus) &&
              ['active', 'done', 'special'].includes(toStatus);
            return (
              <path
                key={index}
                d={
                  'M ' +
                  x1 +
                  ' ' +
                  y1 +
                  ' C ' +
                  x1 +
                  ' ' +
                  (y1 + 55) +
                  ', ' +
                  x2 +
                  ' ' +
                  (y2 - 55) +
                  ', ' +
                  x2 +
                  ' ' +
                  y2
                }
                fill="none"
                stroke={unlockedConnection ? 'var(--primary)' : '#e5e5e5'}
                strokeWidth="10"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {chapter.rows.map((row, index) => {
          const x = point(index),
            y = 30 + index * 101;
          const iconType =
            index === 0
              ? 'challenge'
              : index === chapter.rows.length - 1
                ? 'trophy'
                : row.main.type === 'challenge'
                  ? 'all'
                  : undefined;
          return (
            <div key={row.main.id}>
              <div className="node-position" style={{ left: x - 36, top: y }}>
                <Hex
                  node={row.main}
                  status={statusFor(row.main, completed, active)}
                  onClick={() => onSelect(row.main.id)}
                  activeRef={activeRef}
                  iconType={iconType}
                />
              </div>
            </div>
          );
        })}
        {selectedNode && (
          <div
            className={'node-popover popover-' + selectedStatus}
            style={{
              top: 30 + selectedRow * 101 + 62,
              left: Math.min(220, Math.max(0, selectedX - 144)),
            }}
          >
            <span className="popover-arrow" />
            <strong>{selectedNode.title}</strong>
            {selectedStatus === 'locked' && (
              <p>
                {selectedNode.type === 'mastery'
                  ? '옆의 레슨을 완료해 잠금 해제하세요!'
                  : '이전 레슨을 완료해 잠금 해제하세요!'}
              </p>
            )}
            {selectedStatus === 'special' && <p>배운 내용을 복습해 보세요.</p>}
            <button
              type="button"
              className={'popover-button ' + (selectedStatus === 'locked' ? 'disabled' : '')}
              onClick={() => selectedStatus !== 'locked' && onOpen(selectedNode.id)}
              disabled={selectedStatus === 'locked'}
            >
              {selectedStatus === 'locked'
                ? '잠김'
                : selectedStatus === 'done' || selectedStatus === 'special'
                  ? '복습하기'
                  : '계속하기'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
