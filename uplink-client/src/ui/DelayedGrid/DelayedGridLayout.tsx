"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const DelayedGridLayout = ({ gridStyle, children }) => {
  const [inViewRef, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) setIsVisible(true);
    else setIsVisible(false);
  }, [inView]);

  return (
    <div ref={inViewRef} className="w-full h-full">
      {isVisible && <div className={gridStyle}>{children}</div>}
    </div>
  );
};

export default DelayedGridLayout;
