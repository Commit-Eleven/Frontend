import { useState } from 'react';
import './ParsonsQuestion.css';

export function ParsonsQuestion({ problem, order, onChange, disabled }) {
  const [draggedFragment, setDraggedFragment] = useState(null);
  const fragments = problem.content.fragments;

  const placeFragment = (fragmentIndex, targetSlot) => {
    if (disabled || !Number.isInteger(fragmentIndex)) return;
    const next = [...order];
    const sourceSlot = next.indexOf(fragmentIndex);
    if (sourceSlot === targetSlot) return;
    const displacedFragment = next[targetSlot];
    if (sourceSlot !== -1) next[sourceSlot] = displacedFragment ?? null;
    next[targetSlot] = fragmentIndex;
    onChange(next);
  };

  const handleDrop = (event, targetSlot) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const fragmentIndex = data === '' ? draggedFragment : Number(data);
    placeFragment(fragmentIndex, targetSlot);
    setDraggedFragment(null);
  };

  const handleDropBackToBank = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const fragmentIndex = data === '' ? draggedFragment : Number(data);
    const sourceSlot = order.indexOf(fragmentIndex);
    if (!disabled && sourceSlot !== -1)
      onChange(order.map((item, index) => (index === sourceSlot ? null : item)));
    setDraggedFragment(null);
  };

  const addNext = (fragmentIndex) => {
    const emptySlot = order.indexOf(null);
    if (emptySlot !== -1) placeFragment(fragmentIndex, emptySlot);
  };

  return (
    <div className="practice-parsons">
      <p className="practice-parsons-instruction">
        코드 블록을 드래그하거나 눌러 빈칸에 배치하세요.
      </p>
      <ol className="practice-parsons-slots" aria-label="코드 블록을 놓을 순서">
        {order.map((fragmentIndex, position) => (
          <li key={position}>
            <button
              type="button"
              className={
                'practice-parsons-slot' +
                (fragmentIndex !== null ? ' is-filled' : '') +
                (draggedFragment === fragmentIndex ? ' is-dragging' : '')
              }
              aria-label={`${position + 1}번 위치${fragmentIndex === null ? ', 비어 있음' : `, ${fragments[fragmentIndex]}. 클릭하여 비우기`}`}
              disabled={disabled}
              draggable={fragmentIndex !== null && !disabled}
              onClick={() =>
                fragmentIndex !== null &&
                onChange(order.map((item, index) => (index === position ? null : item)))
              }
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(fragmentIndex));
                setDraggedFragment(fragmentIndex);
              }}
              onDragEnd={() => setDraggedFragment(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, position)}
            >
              <span className="practice-line-number" aria-hidden="true">
                {position + 1}
              </span>
              {fragmentIndex === null ? (
                <span>코드 블록을 드래그하여 배치하세요.</span>
              ) : (
                <code>{fragments[fragmentIndex]}</code>
              )}
            </button>
          </li>
        ))}
      </ol>
      <div
        className={
          'practice-parsons-bank' +
          (Number.isInteger(draggedFragment) && order.includes(draggedFragment)
            ? ' is-drop-target'
            : '')
        }
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
        onDrop={handleDropBackToBank}
      >
        <strong>코드 블록</strong>
        <div className="practice-parsons-blocks" aria-label="사용할 코드 블록">
          {fragments.map((fragment, fragmentIndex) =>
            order.includes(fragmentIndex) ? null : (
              <button
                type="button"
                key={fragmentIndex}
                className={`practice-parsons-block${draggedFragment === fragmentIndex ? ' is-dragging' : ''}`}
                draggable={!disabled}
                onClick={() => addNext(fragmentIndex)}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', String(fragmentIndex));
                  setDraggedFragment(fragmentIndex);
                }}
                onDragEnd={() => setDraggedFragment(null)}
              >
                <code>{fragment}</code>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
