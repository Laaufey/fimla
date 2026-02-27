import { HiX } from "react-icons/hi";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "./LoadingIcon";
import updateData from "../../lib/updateData";

const ProfilePicModal = ({ closeModal, setImageSrcReady }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );
  const [uploadStarted, setUploadStarted] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false)
  
  /* Session */
  const readUser = async () => {
    const session = await getSession();
    const email = session?.user?.email || "";
    const image =
      session?.user?.image ||
      "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";
    setEmail(email);
    setImageSrc(image);
  };

  /* UPLOAD IMAGES TO CLOUDINARY */
  const handleOnChange = (changeEvent: any) => {
    const reader = new FileReader();
    reader.onload = function (onLoadEvent: any) {
      setImageSrc(onLoadEvent.target?.result);
      setUploadStarted(true);
    };
    reader.readAsDataURL(changeEvent.target.files?.[0]);
  };

  const handleOnSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitted(true);
    const form = event.currentTarget;
    const fileInput: any = Array.from(form.elements).find(
      ({ name }: any) => name === "file"
    );
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", "figma-profile-pics");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/diczrtchl/image/upload",
      { method: "POST", body: formData }
    ).then((response) => response.json())
    .then(data => {
      setImageSrc(data.secure_url)
    })
    .then(() => {
      setImageSrcReady(imageSrc)
      setImageUploaded(true)
    })
  };

  useEffect(() => {
    if (imageUploaded) {
    const body = { userEmail, imageSrc };
    updateData("profile-pic", "PUT", body)
    closeModal();
    }
  }, [imageUploaded])
  
  useEffect(() => {
    readUser();
  }, []);

  return (
    <div className="absolute left-0 shadow-xl right-0 m-auto flex flex-col w-4/5 p-8 space-y-4 justify-evenly items-center lg:w-2/3 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Profile Picture</h1>
        <button className="heading-1" onClick={closeModal}>
          <HiX />
        </button>
      </div>
      <p>Update your profile picture here!</p>

      <div className="bg-black rounded-full h-24 w-24 overflow-hidden">
        <Image width={100} height={100} alt="profile picture" src={imageSrc} />
      </div>

      <form
        id="formId"
        action="#"
        method="POST"
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        className="flex flex-col items-center gap-4"
      >
        <label htmlFor="file">
          <input
            type="file"
            name="file"
            id="file"
            hidden
          />
          <p className="btn-secondary cursor-pointer">Choose Image</p>
          
        </label>
        {imageSrc && uploadStarted && !isSubmitted && (
          <button type="submit" className="btn-secondary">
            Save
          </button>
        )}
      </form>
      {isSubmitted && (
        <button className="pb-5">
          <LoadingIcon isPage={false} />
        </button>
      )}
    </div>
  );
};

export default ProfilePicModal;
