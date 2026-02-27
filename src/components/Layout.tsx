import Footer from "./Footer";
import Header from "./Header";

import { getSession } from "next-auth/react";
import UserNameModal from "./UserNameModal";
import { useEffect, useState } from "react";

// type Content = {
//   children: JSX.Element;
// };

const Layout = ({ children }: any) => {
  const [user, setUser] = useState(false);
  const getUser = async () => {
    const session = await getSession();
    if (session?.["user"]?.["name"] !== null) {
      setUser(false);
    } else {
      setUser(true);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="mx-6 md:mx-20">
      <Header />

      {user ? (
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
