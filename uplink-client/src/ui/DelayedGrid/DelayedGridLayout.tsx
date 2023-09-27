"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0, scale: 0.5 },
};

const DelayedGridLayout = ({
  gridStyle,
  children,
}: {
  gridStyle: string;
  children: ReactNode;
}) => {
  const [inViewRef, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  return (
    <div className="w-full h-full" ref={inViewRef}>
      {inView && (
        <motion.div
          className={gridStyle}
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default DelayedGridLayout;
