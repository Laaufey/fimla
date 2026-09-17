import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingIcon from "../components/LoadingIcon";
import AuthPromptBanner from "../components/AuthPromptBanner";
import PageHeading from "../components/PageHeading";
import { buttonPrimary } from "../components/buttonStyles";
import getByUserEmail from "../../lib/getByUserEmail";
import updateData from "../../lib/updateData";

const Groups = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const userEmail = session?.user?.["email"];
  const userName = session?.user?.["name"];
  const [tournamentName, setTournamentName] = useState("");
  const [userInTournament, setUserInTournament] = useState([]);

  const getUsersInTournaments = async () => {
    getByUserEmail("single-tournament", userSession).then((result) => {
      setUserInTournament(result);
    });
  };
  useEffect(() => {
    getUsersInTournaments();
  }, [session]);

  const createTournament = async () => {
    const body = { tournamentName, userName, userEmail };
    updateData("tournaments", "POST", body).then(() => getUsersInTournaments());
    setTournamentName("");
  };

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Groups" />

      {session ? (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="heading-2">Your groups</h2>

            {userInTournament.length === 0 ? (
              <p className="text-sm text-text-secondary">
                You haven&apos;t joined or created any groups yet.
              </p>
            ) : (
              userInTournament.map((o) => (
                <Link
                  key={o["tournamentId"]}
                  href={{
                    pathname: "/groups/[id]",
                    query: { id: o["tournamentId"] },
                  }}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface-secondary p-5 text-text-primary transition-colors duration-150 hover:bg-border-subtle sm:p-6"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate font-semibold">
                      {o["tournamentName"]}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Open your group and see the leaderboard
                    </p>
                  </div>
                  <span className={`${buttonPrimary} shrink-0`}>
                    Open group <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              ))
            )}
          </div>

          <section className="flex w-full flex-col gap-4 rounded-3xl bg-surface-secondary p-6 sm:p-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-extrabold tracking-tight-brand">
                Create a group
              </h2>
              <p className="text-sm text-text-secondary">
                Create a space to play and compare scores with friends.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:max-w-sm">
              <label
                htmlFor="group-name"
                className="text-sm font-medium text-text-secondary"
              >
                Group name
              </label>
              <input
                id="group-name"
                type="text"
                placeholder="Enter a group name"
                className="h-11 w-full rounded-xl bg-surface px-4 text-sm text-text-primary placeholder:text-text-secondary sm:h-12"
                onChange={(e) => setTournamentName(e.target.value)}
                value={tournamentName}
              />
              <button
                type="button"
                onClick={createTournament}
                className={`${buttonPrimary} mt-2 h-11 w-full sm:h-12 sm:w-fit`}
              >
                Create group <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </section>
        </>
      ) : (
        <AuthPromptBanner
          title="Create an account to start a group"
          description="Sign up to create groups, invite friends and compare your scores."
          primaryActionLabel="Create account"
          primaryActionHref="/api/auth/signin"
          secondaryText="Already have an account?"
          secondaryActionLabel="Sign in"
          secondaryActionHref="/api/auth/signin"
        />
      )}
    </div>
  );
};

export default Groups;
