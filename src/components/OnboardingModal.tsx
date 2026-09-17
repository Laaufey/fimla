import { HiX } from "react-icons/hi";
import Image from "next/image";
import { ReactNode } from "react";

type OnboardingModalProps = {
  title: string;
  onClick: () => void;
  textOne: string;
  textTwo?: string;
  image?: string;
  alt?: string;
  /** Live example content (e.g. PaletteLegend) shown instead of `image`,
   * for cases where a static picture can't reflect the current state
   * (such as the selected result-color palette). */
  demo?: ReactNode;
};

const OnboardingModal = ({
  title,
  onClick,
  textOne,
  textTwo,
  image,
  alt,
  demo,
}: OnboardingModalProps) => {
  return (
    <div className="flex w-[90vw] max-w-lg flex-col p-8 space-y-4 justify-evenly rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">{title}</h1>
        <button className="heading-1" onClick={onClick}>
          <HiX />
        </button>
      </div>
      <p>{textOne}</p>
      {demo ? (
        demo
      ) : image ? (
        <div className="relative">
          <Image src={image} alt={alt || ""} width={300} height={300} />
        </div>
      ) : null}
      {textTwo && <p>{textTwo}</p>}
    </div>
  );
};

export default OnboardingModal;
