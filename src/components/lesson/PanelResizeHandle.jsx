import { useRef, useState } from 'react';
import './PanelResizeHandle.css';

export function PanelResizeHandle({
  label,
  value,
  min,
  max,
  onResize,
  getPointerValue,
  onDragChange,
  className = '',
}) {
  const [dragging, setDragging] = useState(false);
  const pointerId = useRef(null);
  const previousBodyStyles = useRef(null);

  const finishDragging = () => {
    if (!dragging) return;
    setDragging(false);
    pointerId.current = null;
    if (previousBodyStyles.current) {
      document.body.style.cursor = previousBodyStyles.current.cursor;
      document.body.style.userSelect = previousBodyStyles.current.userSelect;
      previousBodyStyles.current = null;
    }
    onDragChange?.(false);
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    pointerId.current = event.pointerId;
    previousBodyStyles.current = {
      cursor: document.body.style.cursor,
      userSelect: document.body.style.userSelect,
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    setDragging(true);
    onDragChange?.(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerId.current !== event.pointerId) return;
    onResize(getPointerValue ? getPointerValue(event.clientX) : event.clientX);
  };

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 48 : 20;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onResize(value - step);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onResize(value + step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onResize(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      onResize(max);
    }
  };

  return (
    <div
      className={`panel-resize-handle ${className}${dragging ? ' is-dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={Math.round(min)}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      title={`${label} (드래그 또는 ←/→)`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
      onLostPointerCapture={finishDragging}
      onKeyDown={handleKeyDown}
    />
  );
}
