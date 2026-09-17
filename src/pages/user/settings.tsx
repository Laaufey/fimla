import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import ProfilePicModal from "../../components/ProfilePicModal";
import UserInfoModal from "../../components/UserInfoModal";
import ModalBackdrop from "../../components/ModalBackdrop";
import ConfirmModal from "../../components/ConfirmModal";
import LoadingIcon from "../../components/LoadingIcon";
import AuthPromptBanner from "../../components/AuthPromptBanner";
import PageHeading from "../../components/PageHeading";
import { buttonPrimary, buttonSecondary, buttonDestructive, buttonQuiet } from "../../components/buttonStyles";
import getByUserEmail from "../../../lib/getByUserEmail";
import deleteData from "../../../lib/deleteData";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="truncate font-medium text-text-primary">{value}</p>
  </div>
);

const Settings = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const userEmail = session?.user?.["email"];
  const [userInfo, setUserInfo] = useState([]);
  const [user, setUser] = useState([]);
  const [changeProfilePic, showProfilePicModal] = useState(false);
  const [changeInfo, showInfoModal] = useState(false);
  const [imageSrc, setImageSrcReady] = useState("");
  const [confirmResetStats, setConfirmResetStats] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const defaultProfilePic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  const [profilePic, setProfilePic] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );
  const userImage =
    user?.["image"] ||
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  useEffect(() => {
    getUserInfo();
    getUser();
  }, [session]);

  useEffect(() => {
    if (userImage !== null) {
      setProfilePic(userImage);
    } else {
      setProfilePic(defaultProfilePic);
    }
  }, [user]);

  useEffect(() => {
    if (imageSrc) setProfilePic(imageSrc);
  }, [imageSrc]);

  const getUserInfo = async () => {
    getByUserEmail("userinfo", userSession).then((result) =>
      setUserInfo(result[0])
    );
  };

  const getUser = async () => {
    getByUserEmail("user", userSession).then((result) => setUser(result[0]));
  };

  const deleteUser = async (e: any) => {
    deleteData("user", e);
    signOut();
  };

  const deleteStats = async (e: any) => {
    deleteData("wordle-stats", e);
    deleteData("quordle-stats", e);
  };

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <div className="flex flex-col gap-y-4">
      <PageHeading title="Settings" />

      {session ? (
        <>
          {(changeProfilePic ||
            changeInfo ||
            confirmResetStats ||
            confirmDeleteAccount) && (
            <ModalBackdrop>
              {changeProfilePic && (
                <ProfilePicModal
                  setImageSrcReady={setImageSrcReady}
                  closeModal={() => showProfilePicModal(false)}
                />
              )}
              {changeInfo && (
                <UserInfoModal
                  onClick={() => showInfoModal(false)}
                  userInfo={userInfo}
                />
              )}
              {confirmResetStats && (
                <ConfirmModal
                  title="Reset your stats?"
                  description="Clear your stats and game history"
                  confirmLabel="Reset stats"
                  variant="danger"
                  onCancel={() => setConfirmResetStats(false)}
                  onConfirm={() => {
                    deleteStats(userEmail);
                    setConfirmResetStats(false);
                  }}
                />
              )}
              {confirmDeleteAccount && (
                <ConfirmModal
                  title="Delete your account?"
                  description="This action cannot be undone"
                  confirmLabel="Delete account"
                  variant="danger"
                  onCancel={() => setConfirmDeleteAccount(false)}
                  onConfirm={() => {
                    deleteUser(userEmail);
                    setConfirmDeleteAccount(false);
                  }}
                />
              )}
            </ModalBackdrop>
          )}

          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            {/* Profile summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={profilePic}
                    width={128}
                    height={128}
                    placeholder="blur"
                    blurDataURL="/user.png"
                    alt=""
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-display text-lg font-bold text-text-primary">
                    {session.user?.name}
                  </p>
                  {userInfo?.["username"] && (
                    <p className="text-sm text-text-secondary">
                      {userInfo?.["username"]}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => showProfilePicModal(true)}
                    className={buttonQuiet}
                  >
                    Change photo
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showInfoModal(true)}
                className={`${buttonPrimary} sm:w-fit`}
              >
                Edit details
              </button>
            </div>

            {/* Personal details - one flowing list, thin dividers between
                rows, no separate background per row. */}
            <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
              {userInfo?.["username"] !== null && (
                <DetailRow label="Name" value={userInfo?.["username"]} />
              )}
              {userInfo?.["userLocation"] !== null && (
                <DetailRow
                  label="Location"
                  value={userInfo?.["userLocation"]}
                />
              )}
              {userInfo?.["userDob"] !== null && (
                <DetailRow label="Date of birth" value={userInfo?.["userDob"]} />
              )}
            </div>

            {/* Account actions - same dividers-only treatment, no nested
                colored box. */}
            <div className="flex flex-col gap-4">
              <h2 className="heading-2">Account actions</h2>

              <div className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
                <div className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-text-primary">
                      Reset stats
                    </p>
                    <p className="text-sm text-text-secondary">
                      Clear your stats and game history
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmResetStats(true)}
                    className={`${buttonSecondary} w-full sm:w-fit`}
                  >
                    Reset stats
                  </button>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-text-primary">
                      Delete account
                    </p>
                    <p className="text-sm text-text-secondary">
                      This action cannot be undone
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAccount(true)}
                    className={`${buttonDestructive} w-full sm:w-fit`}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AuthPromptBanner
          title="Create your account in a few seconds"
          description="Save your stats, join groups and play with friends."
          primaryActionLabel="Get started"
          primaryActionHref="/api/auth/signin"
          secondaryText="Already have an account?"
          secondaryActionLabel="Sign in"
          secondaryActionHref="/api/auth/signin"
        />
      )}
    </div>
  );
};

export default Settings;
