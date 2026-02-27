import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks, games } from "../data/paths";
import { useTheme } from "next-themes";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  const mobileMenu = () => {
    return (
      <div className="flex flex-col w-full text-center lg:hidden">
        {React.Children.toArray(
          navLinks.map((link) => (
            <>
              {link.dropdown === true ? (
                <>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex py-6 space-x-3 text-xl border-t cursor-pointer center"
                  >
                    <div>{link.name}</div>
                  </div>
                  {dropdownOpen ? dropdown() : ""}
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href={link.path}
                    className="py-6 text-xl border-t"
                  >
                    {link.name}
                  </Link>
                </>
              )}
            </>
          ))
        )}
        {session ? (
          <button
            className="flex py-6 space-x-3 text-xl text-gray-400 cursor-pointer center border-y"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        ) : (
          <button
            className="flex py-6 space-x-3 text-xl text-gray-400 cursor-pointer center border-y"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    );
  };

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdown = () => {
    return (
      <div className="flex flex-col border bg-white/80 dark:bg-dark/80 lg:w-36 lg:rounded-xl">
        {React.Children.toArray(
          games.map((link) => (
            <Link
              onClick={() => setDropdownOpen(false)}
              onMouseEnter={() => setDropdownOpen(true)}
              href={link.path}
              className="p-3 border-b hover:bg-lightest/60 last:border-b-0 hover:first:rounded-t-xl hover:last:rounded-b-xl hover:dark:bg-darker"
            >
              <div onClick={() => setMobileMenuOpen(false)}>{link.name}</div>
            </Link>
          ))
        )}
      </div>
    );
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div>
      <nav className="flex items-center justify-between py-8">
        <div className="w-1/5">
          <Link href="/">
            {theme === "light" ? (
              <Image src="/logo-light.png" alt="logo-light" width={100} height={100}/>
            ) : (
              <Image src="/logo-dark.png" alt="logo-dark" width={100} height={100} />
            )}
          </Link>
        </div>

        <div className="relative items-center hidden w-3/5 justify-evenly lg:flex">
          <div className="absolute z-10 top-8 left-12">
            {dropdownOpen ? dropdown() : ""}
          </div>
          {React.Children.toArray(
            navLinks.map((link) => {
              const active =
                router.pathname === link.path
                  ? "bg-black dark:bg-white"
                  : "bg-transparent";
              const playActive =
                router.pathname.includes("/games") || dropdownOpen
                  ? "bg-black dark:bg-white"
                  : "bg-transparent";
              return (
                <div>
                  {link.dropdown === true ? (
                    <div
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      onMouseEnter={() => setDropdownOpen(true)}
                      className="flex space-x-3 cursor-pointer center"
                    >
                      <div
                        className={`${playActive} w-6 h-6 border border-black rounded-full dark:border-white`}
                      ></div>
                      <div>{link.name}</div>
                    </div>
                  ) : (
                    <Link className="flex space-x-3 center" href={link.path}>
                      <div
                        className={`${active} w-6 h-6 border border-black rounded-full dark:border-white`}
                      ></div>
                      <div>{link.name}</div>
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end w-1/5 gap-x-4">
          <div className="hidden md:block">
            {session ? (
              <button onClick={() => signOut()}>Sign out</button>
            ) : (
              <button onClick={() => signIn()}>Sign in</button>
            )}
          </div>
          <button
            aria-label="dark-mode"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <HiMoon /> : <HiSun />}
          </button>

          <button
            aria-label="navigation-menu"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="col-span-2 text-xl text-center lg:hidden"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen ? mobileMenu() : ""}
    </div>
  );
};

export default Header;
