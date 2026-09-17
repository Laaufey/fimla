import React from "react";
import { motion } from "framer-motion";

const LoadingIcon = ({ isPage }) => {
  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.3,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const loadingCircleVariants = {
    start: {
      y: "50%",
    },
    end: {
      y: "150%",
    },
  };

  const height = isPage === true ? "h-[50vh]" : "h-full";

  return (
    <div className={`flex w-full ${height} center`}>
      <motion.div
        variants={loadingContainerVariants}
        initial="false"
        animate="end"
        className="flex space-x-2"
      >
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-action-primary rounded-full"
        />
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-action-primary rounded-full"
        />
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-action-primary rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default LoadingIcon;
