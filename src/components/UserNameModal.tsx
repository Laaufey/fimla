import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import updateData from "../../lib/updateData";

const UserNameModal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const readUser = async () => {
    const session = await getSession();
    const email = session?.user?.email || "";
    setEmail(email);
  };
  const updateUser = async () => {
    const body = { name, email };
    updateData("user", "PUT", body)
    signOut();
  };
  readUser();
  return (
    <div className="absolute z-20 left-0 right-0 m-auto mt-20 flex flex-col w-2/3 p-8 space-y-4 justify-evenly items-center md:w-1/2 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Welcome to Fimla!</h1>
      </div>
      <p>Before you start playing, tell us your name!</p>
      <form
        className="flex flex-col mb-4"
        action="#"
        method="PUT"
        onSubmit={() => updateUser()}
      >
        <label htmlFor="name">Full name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
          type="text"
          className="p-1 mb-5 rounded-md"
        />
        <button className="btn-primary mb-4">Enter</button>
        <p className="text-xs">
          Note: You will need to sign in again after this action.
        </p>
      </form>
      <div className="relative">
      </div>
    </div>
  );
};

export default UserNameModal;
