"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default function SubmissionViewer() {
  const [modalIsOpen, setModalisOpen] = useState(false);
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    setCurrentStep([currentStep + newDirection, newDirection]);
  };

  const steps = [
    {
      component: <Tweet1 />,
    },
    {
      component: <Tweet2 />,
    },
    {
      component: <Tweet3 />,
    },
  ];

  return (
    <div>
      <button className="btn" onClick={() => setModalisOpen(true)}>
        thread
      </button>
      <Modal isModalOpen={modalIsOpen} onClose={() => setModalisOpen(false)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.1 },
            }}
            className="flex flex-col w-full h-[600px] gap-4"
          >
            {currentStep > 0 && (
              <div
                className="w-full h-[80px] bg-pink-700"
                onClick={() => paginate(-1)}
              />
            )}
            <div className="w-full h-full bg-blue-600">
              {steps[currentStep].component}
            </div>
            {currentStep < steps.length - 1 && (
              <div
                className="w-full h-[80px] bg-green-700"
                onClick={() => paginate(1)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
}

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
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
        <div className="modal modal-open bg-transparent ">
          <div
            ref={modalRef}
            className="modal-box max-w-2xl overflow-hidden bg-transparent p-0"
          >
            {children}
          </div>
        </div>
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </div>
    );
  }
  return null;
};

const Tweet1 = () => {
  return (
    <div>
      <p>tweet 1</p>
    </div>
  );
};

const Tweet2 = () => {
  return (
    <div>
      <p>tweet 2</p>
    </div>
  );
};

const Tweet3 = () => {
  return (
    <div>
      <p>tweet 3</p>
    </div>
  );
};
