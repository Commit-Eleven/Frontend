import './ModalBackdrop.css';

/** 모달 바깥 영역과 닫기 동작을 공통으로 제공합니다. */
export function ModalBackdrop({ children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      {children}
    </div>
  );
}
