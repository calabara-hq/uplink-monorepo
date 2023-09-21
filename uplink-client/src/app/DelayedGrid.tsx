"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export const DelayedGridLayout = ({
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
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: { y: 20, opacity: 0 },
};

export const DelayedGridItem = ({
  gridItemStyle,
  children,
}: {
  gridItemStyle: string;
  children: ReactNode;
}) => {
  return (
    <motion.div className={gridItemStyle} variants={item}>
      {children}
    </motion.div>
  );
};
