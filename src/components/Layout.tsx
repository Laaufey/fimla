import Footer from "./Footer";
import Header from "./Header";
import { useSession } from "next-auth/react";
import UserNameModal from "./UserNameModal";

const Layout = ({ children }: any) => {
  const { data: session, status } = useSession();
  const showUserNameModal =
    status === "authenticated" && !session?.user?.name;

  return (
    <div className="mx-6 md:mx-20">
      <Header />

      {showUserNameModal ? (
        <>
          <div className="absolute z-10 top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50"></div>
          <UserNameModal />
        </>
      ) : null}
      <div className="flex flex-col justify-around md:mx-20 lg:mx-36">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
