"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: { y: 20, opacity: 0 },
};

const DelayedGridItem = ({
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

export default DelayedGridItem;
