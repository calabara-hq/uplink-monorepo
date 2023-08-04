"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

const subImage =
  "https://calabara.mypinata.cloud/ipfs/QmZfA7nc9KZ5RAtgYB3MVnzR8y9Jm3vzv8zRvezibb67kM?_gl=1*12l1tvo*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjMzOS4yNy4wLjA.";

const subImage2 =
  "https://calabara.mypinata.cloud/ipfs/QmfSASTvVBNdAAqmQSgRXVK6wA7ap9EwW4JSKoGq1kKcmf?_gl=1*pam249*rs_ga*ZjMxY2Y4NzUtMDhmNS00ZjdlLTg4M2UtNjQ4ZTQ3MTY5YWVh*rs_ga_5RMPXG14TE*MTY4MzA1NjMwNi41LjEuMTY4MzA1NjgzMi42MC4wLjA.";

export default function SubmissionViewer() {
  const [modalIsOpen, setModalisOpen] = useState(false);
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    setCurrentStep([currentStep + newDirection, newDirection]);
  };

  const submissionCards = [
    {
      component: <SubmissionCardModal />,
    },
    {
      component: <SubmissionCardModal2 />,
    },
    {
      component: <SubmissionCardModal />,
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
            className="flex w-full h-[500px] lg:h-[650px] gap-1 lg:gap-4"
          >
            {currentStep > 0 && (
              <div
                className=" w-1/6 h-full bg-base-100 hover:bg-base-200 cursor-pointer"
                onClick={() => paginate(-1)}
              />
            )}
            <div className="w-full h-full bg-blue-600">
              {submissionCards[currentStep].component}
            </div>
            {currentStep < submissionCards.length - 1 && (
              <div
                className=" w-1/6 h-full bg-base-100 hover:bg-base-200 cursor-pointer"
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
            className="modal-box max-w-5xl overflow-hidden bg-transparent p-0"
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

const SubmissionCardModal = () => {
  return (
    <div
      className="flex flex-col jusitfy-start min-w-fit h-full
                    cursor-pointer "
    >
      <div className="flex flex-col  h-fit gap-2 p-4 bg-base-100">
        <h2 className="card-title">Submission #1</h2>
        <p>
          is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the standard dummy text ever since the
        </p>
      </div>
      <figure className="relative bg-base-100 h-full w-full ">
        <Image
          src={subImage}
          alt="submission image"
          fill
          className="rounded-xl object-contain"
        />
      </figure>
    </div>
  );
};
const SubmissionCardModal2 = () => {
  return (
    <div
      className="flex flex-col jusitfy-start min-w-fit h-full
                    cursor-pointer "
    >
      <div className="flex flex-col  h-fit gap-2 p-4 bg-base-100">
        <h2 className="card-title">Submission #1</h2>
        <p>
          is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the standard dummy text ever since the
        </p>
      </div>
      <div className="relative bg-base-100 h-full w-full ">
        <Image
          src={subImage2}
          alt="submission image"
          fill
          className="rounded-xl object-contain"
        />
      </div>
    </div>
  );
};
