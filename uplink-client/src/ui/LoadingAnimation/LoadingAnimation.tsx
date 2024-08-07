import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
  },
};

const LoadingAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  return (
    <div>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="stroke-[#57BAD7] stroke-w-2 stroke-linejoin-round stroke-linecap-round w-32 h-32 text-center"
      >
        <motion.path
          d="M0.902244 14.6903C2.21382 13.7092 4.46223 13.7715 5.56562 14.8928C8.35533 17.7272 10 21.2156 10 25C10 28.7844 8.35533 32.2728 5.56562 35.1072C4.46223 36.2285 2.23464 36.2908 0.902244 35.3097C-0.221964 34.4843 -0.28442 33.1761 0.65242 32.2261C2.67535 30.1209 3.76068 27.5926 3.7544 25C3.7544 22.3058 2.60937 19.814 0.65242 17.7739C-0.263601 16.8239 -0.201145 15.5157 0.902244 14.6903Z"
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1,
            },
          }}
        />
        <motion.path
          d="M11.0827 7.19235C12.6566 5.49767 15.3547 5.60527 16.6787 7.54205C20.0264 12.4378 22 18.4634 22 25C22 31.5366 20.0264 37.5622 16.6787 42.458C15.3547 44.3947 12.6816 44.5023 11.0827 42.8077C9.73364 41.382 9.6587 39.1224 10.7829 37.4815C13.2104 33.8452 14.5128 29.4782 14.5053 25C14.5053 20.3463 13.1312 16.0424 10.7829 12.5185C9.68368 10.8776 9.75863 8.61804 11.0827 7.19235Z"
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1,
            },
          }}
        />
        <motion.path
          d="M23.0827 1.56888C24.6566 -0.660966 27.3547 -0.519387 28.6787 2.02901C32.0264 8.4708 34 16.3992 34 25C34 33.6008 32.0264 41.5292 28.6787 47.971C27.3547 50.5194 24.6816 50.661 23.0827 48.4311C21.7336 46.5552 21.6587 43.5821 22.7829 41.423C25.2104 36.6385 26.5128 30.8924 26.5053 25C26.5053 18.8768 25.1312 13.2137 22.7829 8.57698C21.6837 6.41792 21.7586 3.44479 23.0827 1.56888Z"
          variants={icon}
          initial="hidden"
          animate="visible"
          transition={{
            default: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1,
            },
          }}
        />
      </motion.svg>
    </div>
  );
};

export default LoadingAnimation;
