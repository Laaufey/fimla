import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Archivo, Inter } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        {/* Global viewport meta - previously only set on the home page, so
            every other route rendered at the desktop-width virtual
            viewport and got scaled down, which is what made the nav/logo
            look clipped or mis-sized on mobile. `viewport-fit=cover` also
            lets Layout's safe-area padding do something on notched
            devices. Declaring it here (via next/head, applied to every
            page) lets Next's own head de-duplication replace its default
            viewport tag instead of rendering both. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider attribute="class">
        <main className={`${archivo.variable} ${inter.variable} font-ui`}>
          <Layout>
            <AnimatePresence mode="wait">
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
