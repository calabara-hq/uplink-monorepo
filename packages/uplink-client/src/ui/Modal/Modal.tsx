import { useEffect, useRef } from "react";

const Modal = ({
  isModalOpen,
  children,
  onClose,
  title,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full ">
        <div className="modal modal-open">
          <div ref={modalRef} className="modal-box bg-black/90">
            {children}
          </div>
        </div>
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </div>
    );
  }
  return null;
};

export default Modal;
