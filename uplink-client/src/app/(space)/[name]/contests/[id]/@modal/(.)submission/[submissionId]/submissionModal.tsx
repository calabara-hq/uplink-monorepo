"use client";
import BigSubmission from "@/ui/BigSubmission/BigSubmission";
import { sub } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

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
            className="modal-box max-w-[80vw] w-full overflow-hidden bg-transparent p-0"
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

export default function SubmissionModal({
  submission,
  submissions,
  prevSubmission,
  nextSubmission,
  index,
}: {
  submission: any;
  submissions: any;
  prevSubmission: any;
  nextSubmission: any;
  index: number;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const prevPath =
    index > 0
      ? pathName.split("/").slice(0, -1).join("/") +
        "/" +
        submissions.at(index - 1).id
      : null;
  const nextPath =
    index < submissions.length - 1
      ? pathName.split("/").slice(0, -1).join("/") +
        "/" +
        submissions.at(index + 1).id
      : null;

  return (
    <Modal isModalOpen={true} onClose={() => router.back()}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={variants}
          //custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.1 },
          }}
          className="flex w-full h-[500px] lg:h-[650px] gap-1 lg:gap-4 p-0"
        >
          {index > 0 ? (
            <Link
              className="flex flex-col justify-center items-center w-3/12 h-full bg-base-100 hover:bg-base-200 cursor-pointer"
              href={prevPath}
              replace
            >
              {" "}
              <BiLeftArrowAlt className="w-16 h-16" />
            </Link>
          ) : (
            <div className="w-1/6 h-full" onClick={() => router.back()}></div>
          )}
          <div
            className="flex flex-col jusitfy-start w-full h-full
                      cursor-pointer "
          >
            <div className="flex flex-col h-full w-full gap-2 p-4 bg-base-100">
              <BigSubmission submission={submission} />
            </div>
          </div>
          {index < submissions.length - 1 ? (
            <Link
              className="flex flex-col justify-center items-center w-3/12 h-full bg-base-100 hover:bg-base-200 cursor-pointer"
              href={nextPath}
              replace
            >
              <BiRightArrowAlt className="w-16 h-16" />
            </Link>
          ) : (
            <div className="w-1/6 h-full" onClick={() => router.back()}></div>
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}

const PreviewSubmission = ({ submission }: { submission: any }) => {
  if (submission.type === "text") {
    return <p>{submission.title}</p>;
  }
};
