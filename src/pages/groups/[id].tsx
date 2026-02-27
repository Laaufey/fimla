import { HiRefresh, HiX, HiOutlineChat } from "react-icons/hi";
import { VscCircleFilled } from "react-icons/vsc";
import { useEffect, useState, useRef } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore";
import LoadingIcon from "../../components/LoadingIcon";
import getByUserEmail from "../../../lib/getByUserEmail";
import getById from "../../../lib/getById";
import updateData from "../../../lib/updateData";

const Tournament = () => {
  const { data: session, status } = useSession();
  const store = useLocalObservable(() => WordleStore);
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  const userEmail = session?.user?.["email"];
  const tournamentId = router.query["id"];

  const [chat, showChat] = useState(false);
  const [tournament, setTournament] = useState([]);
  const tournamentName = tournament?.["name"];
  const [inTournament, setInTournament] = useState(false);
  const [usersInTournament, setUsersInTournament] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState([]);
  const defaultProfilePic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const userImage = user?.["image"] || defaultProfilePic;

  useEffect(() => {
    store.startGame();
  }, []);
  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, [modal]);

  const getUser = async () => {
    getByUserEmail("user", userSession).then((result) => {
      setUser(result[0]);
    });
  };
  const getAllTournaments = async () => {
    getById("tournaments", tournamentId).then((result) => {
      setTournament(result[0]);
    });
  };

  const getUsersInTournaments = async () => {
    getById("single-tournament", tournamentId).then((result) => {
      setUsersInTournament(result);
      const filtered = result.filter((i) => i.userEmail === userEmail);
      if (filtered[0]) {
        setInTournament(true);
      } else {
        console.log("not in tournament");
      }
    });
  };

  const readComments = async () => {
    getById("comment", tournamentId).then((result) => {
      setComments(result);
    });
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleScroll = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  };

  const addComment = async () => {
    const body = { userName, tournamentId, userEmail, comment };
    updateData("comment", "POST", body);
    setComment("");
    readComments();
  };
  const addUserToTournament = async () => {
    const body = { userName, tournamentId, userEmail, tournamentName };
    updateData("single-tournament", "POST", body);
    window.location.reload();
  };

  const updateGuesses = async () => {
    let gamesPlayed: any;
    if (store.won || store.lost) {
      gamesPlayed = usersInTournament?.["gamesPlayed"] + 1;
    }
    const totalScore = usersInTournament?.["totalScore"] + store.totalScore;
    const body = { userEmail, tournamentId, totalScore, gamesPlayed };
    updateData("single-tournament", "PUT", body);
  };

  useEffect(() => {
    getUsersInTournaments();
    readComments();
  }, [modal]);
  useEffect(() => {
    readComments();
    getUser();
    getAllTournaments();
    getUsersInTournaments();
  }, [session]);
  useEffect(() => {
    handleScroll();
  }, [comments]);
  useEffect(() => {
    if (store.won || store.lost) {
      updateGuesses();
    }
  }, [store.roundComplete]);

  useEffect(() => {
    if (userImage !== null) {
      setProfilePic(userImage);
    } else {
      setProfilePic(defaultProfilePic);
    }
  }, [user]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      /* Screen is smaller than 768 and is on mobileview */
      showChat(false);
    }
    if (window.screen.width >= 768) {
      /* Screen is bigger than 768 and is probably on desktop or ipad */
      showChat(true);
    }
  }, []);

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <div>
      {tournament ? (
        <>
          <div className="flex flex-col">
            {inTournament === true ? (
              <>
                <button
                  className="fixed flex items-center justify-center w-20 h-20 rounded-full shadow-md md:hidden bottom-3 right-3 bg-purple2"
                  onClick={() => showChat(true)}
                >
                  <HiOutlineChat className="text-6xl text-white" />
                </button>
                {modal ? (
                  <div
                    onClick={() => setModal(false)}
                    className="fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-75 "
                  ></div>
                ) : null}
                {modal ? (
                  <div className=" absolute top-0 left-0.5 right-0.5">
                    <div className="flex flex-col items-center p-5 my-10 rounded-xl justify-evenly">
                      <div className="flex flex-col items-center w-2/5 p-5 my-10 bg-white dark:bg-darker rounded-xl justify-evenly">
                        <div className="flex items-center justify-between">
                          <h1 className="heading-1">
                            {tournament[0]?.["name"]}
                          </h1>
                          <button
                            onClick={() => setModal(false)}
                            className="heading-1"
                          >
                            <HiX />
                          </button>
                        </div>
                        <h1 className="h-6 px-2 rounded-md text-error">
                          {store.error}
                        </h1>
                        {store.guesses.map((_, i) => (
                          <WordGrid
                            word={store.word}
                            guess={store.guesses[i]}
                            isGuessed={i < store.numberOfGuesses}
                            key={i}
                          />
                        ))}

                        {store.won && (
                          <h1 className="text-lg font-bold">
                            You won! You are good!
                          </h1>
                        )}
                        {store.lost && (
                          <div className="flex items-center my-2 gap-x-8">
                            <p className="text-lg font-bold">
                              Almost! The correct word was:
                            </p>
                            <div>
                              <p className="text-lg font-bold text-green">
                                {store.word}
                              </p>
                            </div>
                          </div>
                        )}
                        {(store.lost || store.won) && (
                          <>
                            <button onClick={store.startGame}>
                              Play again
                            </button>
                          </>
                        )}
                        <Keyboard store={store} />
                      </div>
                    </div>
                  </div>
                ) : null}
                <h1 className="mt-10 heading-1">{tournamentName}</h1>
                <div className="flex flex-col">
                  <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2">
                    <div className="row-start-3 px-5 py-3 mx-2 rounded-md md:row-start-1 h-fit dark:bg-dark">
                      <h2 className="heading-2">Members</h2>
                      {usersInTournament.map((user, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 my-2 rounded-md bg-lightest dark:bg-darker"
                        >
                          <div className="w-12 h-12 overflow-hidden rounded-full ">
                            <Image
                              src={profilePic}
                              width={100}
                              height={100}
                              alt="image"
                              priority
                            />
                          </div>
                          <p>{user["userName"]}</p>
                          <VscCircleFilled className="text-gray-300" />
                        </div>
                      ))}
                    </div>

                    <div className="row-start-1 px-5 py-3 mx-2 rounded-md h-fit dark:bg-dark">
                      <h2 className="heading-2">Tournaments</h2>
                      <div className="flex items-center justify-between p-2 my-2 rounded-md bg-lightest dark:bg-darker">
                        <p className="">Wordle</p>
                        <Link href={`/groups/game/${tournamentId}`}>
                          <button className="">Play</button>
                        </Link>
                      </div>
                    </div>

                    {chat && (
                      <div className="fixed bottom-0 left-0 right-0 px-5 py-3 mx-2 rounded-md md:relative md:row-start-2 md:row-span-3 bg-lightest dark:bg-dark">
                        <div className="flex justify-between">
                          <h2 className="pb-2 heading-2">Discussion</h2>
                          <button
                            className="md:hidden"
                            onClick={() => showChat(false)}
                          >
                            <HiX className="text-xl" />
                          </button>
                        </div>

                        <div
                          ref={divRef}
                          className={`flex flex-col bg-white dark:bg-darker rounded-t-md p-5 items-end overflow-x-hidden h-48 overflow-y-auto`}
                        >
                          {comments.map((user, i) => (
                            <div key={i}>
                              <p className="pl-1 text-xs">
                                {`${user["userName"]}`.split(" ")[0]}
                              </p>
                              <div
                                key={i}
                                className="flex flex-col p-2 my-1 rounded-md bg-lighter dark:bg-dark w-fit"
                              >
                                <p className="text-s">{user["text"]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex p-4 mb-1 bg-lightest dark:bg-darker rounded-b-md">
                          <input
                            type="text"
                            className="w-full p-1 rounded-md dark:bg-dark"
                            onChange={(e) => handleComment(e)}
                            value={comment}
                          />
                          <button
                            value="Submit"
                            onClick={addComment}
                            className="h-10 px-4 ml-4 rounded-md bg-light dark:bg-dark"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col row-start-2 px-5 py-3 mx-2 rounded-md h-fit dark:bg-dark">
                      <div className="flex justify-between">
                        <h2 className="heading-2">Leaderboard</h2>
                        <button onClick={getUsersInTournaments}>
                          <HiRefresh />
                        </button>
                      </div>
                      <table className="">
                        <tbody>
                          {usersInTournament
                            .sort(
                              (prev, next) =>
                                next["totalScore"] - prev["totalScore"]
                            )
                            .slice(0, 10)
                            .map((user, i) => (
                              <tr
                                key={i}
                                className="flex items-center justify-between gap-2 p-2 my-2 rounded-md bg-lightest dark:bg-darker"
                              >
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">
                                  {`${user["userName"]}`.split(" ")[0]}
                                </td>
                                {/* Game played */}
                                <td className="p-1 text-center">
                                  {user["gamesPlayed"]}
                                </td>
                                {/* Avg. Score */}
                                <td className="flex items-baseline p-1 text-right">
                                  <p>
                                    {user["totalScore"] / user["gamesPlayed"] ||
                                      0}
                                  </p>
                                  <p className="text-xs">pts</p>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-5 mx-2 rounded-md md:col-start-2 dark:bg-dark">
                      <h2 className="heading-2">Invite Friends</h2>
                      <button
                        className="px-4 py-2 my-2 rounded-md bg-light dark:bg-darker"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `http://localhost:3000/groups/${tournamentId}`
                          );
                        }}
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center my-10 justify-evenly">
                  <h2 className="mb-5 heading-2">
                    Somebody has invited you the group
                  </h2>
                  <h1 className="mb-5 heading-1">{tournament[0]?.["name"]}</h1>
                  {session ? (
                    <button
                      className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark"
                      onClick={addUserToTournament}
                    >
                      JOIN
                    </button>
                  ) : (
                    <>
                      <p>You need to have an account to join this group</p>
                      <Link href="/api/auth/signin">
                        <button className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark">
                          Sign in
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default observer(Tournament);
