import { useEffect, useRef } from "react";

const Modal = ({
  isModalOpen,
  children,
  onClose,
  title,
  disableClickOutside,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  disableClickOutside?: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        disableClickOutside ? null : onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  if (isModalOpen) {
    return (
      <div className="modal modal-open bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div
          ref={modalRef}
          className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] animate-springUp"
        >
          {children}
        </div>
      </div>
    );
  }
  return null;
};

export const ModalActions = ({
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel,
  confirmDisabled,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
  confirmDisabled?: boolean;
}) => {
  return (
    <div className="modal-action mt-8">
      <button
        onClick={onCancel}
        className="btn btn-md btn-ghost lowercase mr-auto"
      >
        {cancelLabel}
      </button>
      <button
        disabled={confirmDisabled}
        onClick={onConfirm}
        className="btn btn-primary btn-md lowercase"
      >
        {confirmLabel}
      </button>
    </div>
  );
};

export default Modal;
