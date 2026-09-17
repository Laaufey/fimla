import { motion } from "framer-motion";

const ProgressBar = ({ progressPercentage }: { progressPercentage: number }) => {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
      <motion.div
        animate={{ width: `${progressPercentage}%` }}
        transition={{ type: "tween", duration: 0.5 }}
        className="h-full rounded-full bg-nav-interactive"
      />
    </div>
  );
};

export default ProgressBar;
