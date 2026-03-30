import { FormEvent, useState } from "react";
import { getProviders, getSession, signIn } from "next-auth/react";

type SignInProps = {
  callbackUrl: string;
  providers: Awaited<ReturnType<typeof getProviders>>;
};

const SignIn = ({ callbackUrl, providers }: SignInProps) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCredentialsSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const result = await signIn("credentials", {
      email: signInEmail,
      password: signInPassword,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Invalid email or password.");
      return;
    }

    window.location.href = callbackUrl;
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data?.message || "Failed to create account.");
      return;
    }

    const result = await signIn("credentials", {
      email: signUpEmail,
      password: signUpPassword,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Account created, but sign-in failed. Please sign in manually.");
      return;
    }

    window.location.href = callbackUrl;
  };

  const oauthProviders = providers
    ? Object.values(providers).filter(
        (provider) => provider.id === "google" || provider.id === "github"
      )
    : [];

  return (
    <div className="flex items-start justify-center min-h-[70vh] pt-10">
      <div className="w-full max-w-sm px-2">
        <h1 className="mb-8 text-4xl font-semibold text-center">
          {mode === "signin" ? "Log in" : "Create account"}
        </h1>

        {mode === "signin" ? (
          <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-2.5">
            <input
              id="signin-email"
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="p-3 text-sm rounded-xl bg-gray-100 dark:bg-dark"
              placeholder="Email"
              required
            />
            <input
              id="signin-password"
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              className="p-3 text-sm rounded-xl bg-gray-100 dark:bg-dark"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-3 text-sm text-white bg-purple-600 rounded-xl hover:bg-purple-700"
            >
              Log in
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-2.5">
            <input
              id="signup-name"
              type="text"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="p-3 text-sm rounded-xl bg-gray-100 dark:bg-dark"
              placeholder="Name"
            />
            <input
              id="signup-email"
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="p-3 text-sm rounded-xl bg-gray-100 dark:bg-dark"
              placeholder="Email"
              required
            />
            <input
              id="signup-password"
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="p-3 text-sm rounded-xl bg-gray-100 dark:bg-dark"
              placeholder="Password"
              minLength={8}
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-3 text-sm text-white bg-purple-600 rounded-xl hover:bg-purple-700"
            >
              Create account
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {oauthProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl,
                })
              }
              className="w-full py-2.5 text-sm border rounded-xl dark:border-gray-600"
            >
              {mode === "signin" ? "Log in" : "Create account"} with{" "}
              {provider.name}
            </button>
          ))}
        </div>

        <div className="mt-5 text-center">
          {mode === "signin" ? (
            <button className="text-sm underline" onClick={() => setMode("signup")}>
              Create an account
            </button>
          ) : (
            <p className="text-sm">
              Already have an account?{" "}
              <button className="underline" onClick={() => setMode("signin")}>
                Log in
              </button>
            </p>
          )}
        </div>

        {message && <p className="text-error">{message}</p>}
      </div>
    </div>
  );
};

export default SignIn;

export async function getServerSideProps(context) {
  const callbackUrl =
    typeof context.query.callbackUrl === "string" &&
    context.query.callbackUrl.length > 0
      ? context.query.callbackUrl
      : "/";
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  return {
    props: {
      callbackUrl,
      providers: providers ?? {},
    },
  };
}
