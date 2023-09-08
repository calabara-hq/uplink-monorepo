const ContestModal = ({
  isModalOpen,
  children,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
}) => {
  if (isModalOpen) {
    return (
      <div className="modal modal-open bg-[#00000080] transition-colors duration-300 ease-in-out">
        <div className="modal-box bg-[#1A1B1F] bg-gradient-to-r from-[#e0e8ff0a] to-[#e0e8ff0a] border border-[#ffffff14] max-w-2xl animate-springUp">
          {children}
        </div>
      </div>
    );
  }
  return null;
};

export default ContestModal;
