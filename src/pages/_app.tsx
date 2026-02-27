import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class">
        <main className="font-sans">
          <Layout>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={router.route}
                initial="initialState"
                animate="animateState"
                exit="exitState"
                transition={{
                  duration: 0.75,
                }}
                variants={{
                  initialState: {
                    opacity: 0,
                  },
                  animateState: {
                    opacity: 1,
                  },
                  exitState: {},
                }}
                className="base-page-size"
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
}
