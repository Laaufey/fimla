import Footer from "./Footer";
import Header from "./Header";
import { useSession } from "next-auth/react";
import UserNameModal from "./UserNameModal";
import ModalBackdrop from "./ModalBackdrop";

const Layout = ({ children }: any) => {
  const { data: session, status } = useSession();
  const showUserNameModal =
    status === "authenticated" && !session?.user?.name;

  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Header />

      {showUserNameModal ? (
        <ModalBackdrop>
          <UserNameModal />
        </ModalBackdrop>
      ) : null}
      <div className="flex flex-col gap-10 pt-8">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
