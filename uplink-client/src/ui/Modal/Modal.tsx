import { useEffect, useRef } from "react";
import { Button } from "../DesignKit/Button";

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
          className="modal-box bg-base-100 border border-border animate-springUp"
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
  isLoading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
  confirmDisabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <div className="modal-action mt-8">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="mr-auto"
      >
        {cancelLabel}
      </Button>
      <Button
        disabled={confirmDisabled}
        onClick={onConfirm}
      >
        {confirmLabel}
        {isLoading && (
          <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 ml-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        )}
      </Button>
    </div>
  );
};

export default Modal;
