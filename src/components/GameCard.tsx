import Image from "next/image";
import { motion } from "framer-motion"

const GameCard = ({ image, title, placeholderImg }) => {

  return (
    <div className="flex flex-col relative h-96 justify-between w-full transition duration-700 ease-in-out bg-white shadow-md dark:bg-dark rounded-3xl hover:scale-[1.01]">
      <motion.div 
      animate={{ opacity: [0,1]}}
      transition={{ duration: 1, delay: 1 }}
      className="relative h-80">
      <Image 
        placeholder="blur"
        blurDataURL={placeholderImg}
        layout="fill"
        objectFit="cover"
        className="w-full rounded-t-3xl" src={image} alt="games" />
        </motion.div>

      <div className="flex items-center justify-between m-6 md:m-2 lg:m-6 md:flex-col lg:flex-row">
        <h1 className="text-3xl md:text-2xl lg:text-3xl">{title}</h1>
        <button className="transition ease-in-out btn-secondary md:px-10 lg:px-4 md:my-2 lg:my-0 hover:shadow-md">
          play
        </button>
      </div>
    </div>
  );
};

export default GameCard;
