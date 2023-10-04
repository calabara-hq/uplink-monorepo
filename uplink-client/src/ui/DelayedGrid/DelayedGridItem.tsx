"use client";
import { ReactNode, useEffect, useState } from "react";
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
  delay,
}: {
  gridItemStyle: string;
  children: ReactNode;
  delay: number;
}) => {
  const [style, setStyle] = useState({
    opacity: 0,
    transform: "translateY(20px)",
    transition: "opacity 0.5s, transform 0.5s",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 0.5s, transform 0.5s",
      });
    }, delay * 1000); // converting to ms

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div className={gridItemStyle} style={style}>
      {children}
    </div>
  );
};

export default DelayedGridItem;
