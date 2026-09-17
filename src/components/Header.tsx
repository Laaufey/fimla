import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { navLinks, games } from "../data/paths";
import { useTheme } from "next-themes";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/router";

const PLAY_MENU_ID = "play-dropdown-menu";

const Header = () => {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeDropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const playTriggerRef = useRef<HTMLButtonElement>(null);
  const mobilePlayTriggerRef = useRef<HTMLButtonElement>(null);

  const openDropdown = () => {
    if (closeDropdownTimeout.current) {
      clearTimeout(closeDropdownTimeout.current);
      closeDropdownTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const closeDropdown = (delay = 150) => {
    if (closeDropdownTimeout.current) {
      clearTimeout(closeDropdownTimeout.current);
    }

    closeDropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
      closeDropdownTimeout.current = null;
    }, delay);
  };

  const getMenuItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []
    );

  const focusMenuItem = (index: number) => {
    const items = getMenuItems();
    if (items.length === 0) return;
    const nextIndex = ((index % items.length) + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    const items = getMenuItems();
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusMenuItem(currentIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusMenuItem(currentIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusMenuItem(0);
        break;
      case "End":
        event.preventDefault();
        focusMenuItem(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        if (closeDropdownTimeout.current) {
          clearTimeout(closeDropdownTimeout.current);
          closeDropdownTimeout.current = null;
        }
        setDropdownOpen(false);
        playTriggerRef.current?.focus();
        break;
      default:
        break;
    }
  };

  // Close on outside click, and move focus into the menu when it opens.
  useEffect(() => {
    if (!dropdownOpen) return;
    focusMenuItem(0);

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        playTriggerRef.current?.contains(target) ||
        mobilePlayTriggerRef.current?.contains(target)
      ) {
        return;
      }
      setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen]);

  const dropdown = (variant: "desktop" | "mobile" = "desktop") => {
    return (
      <div
        ref={menuRef}
        id={PLAY_MENU_ID}
        role="menu"
        aria-label="Play games"
        onKeyDown={handleMenuKeyDown}
        onMouseEnter={variant === "mobile" ? undefined : openDropdown}
        onMouseLeave={variant === "mobile" ? undefined : () => closeDropdown()}
        onBlur={(event) => {
          const nextFocus = event.relatedTarget as Node | null;
          if (
            nextFocus &&
            (menuRef.current?.contains(nextFocus) ||
              playTriggerRef.current?.contains(nextFocus) ||
              mobilePlayTriggerRef.current?.contains(nextFocus))
          ) {
            return;
          }
          setDropdownOpen(false);
        }}
        className={`w-full overflow-hidden lg:w-max ${
          variant === "mobile"
            ? ""
            : "rounded-b-2xl bg-nav-background shadow-[var(--nav-shadow)]"
        }`}
      >
        {React.Children.toArray(
          games.map((link) => {
            const isCurrent = router.pathname === link.path;
            return (
              <Link
                href={link.path}
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}
                className={`flex h-11 items-center gap-8 whitespace-nowrap px-5 text-sm font-medium transition-colors duration-150 active:opacity-80 ${
                  variant === "mobile"
                    ? "justify-center bg-nav-interactive text-nav-interactive-text hover:bg-nav-background hover:text-nav-text focus-visible:bg-nav-background focus-visible:text-nav-text active:bg-nav-background active:text-nav-text"
                    : `justify-between ${
                        isCurrent
                          ? "text-nav-interactive"
                          : "text-nav-text hover:text-nav-interactive focus-visible:text-nav-interactive"
                      }`
                }`}
              >
                <span>{link.name}</span>
                {variant === "mobile" ? null : (
                  <span aria-hidden="true">&rarr;</span>
                )}
              </Link>
            );
          })
        )}
      </div>
    );
  };

  const mobileMenu = () => {
    return (
      <div
        className="fixed inset-x-4 bottom-4 z-40 overflow-y-auto rounded-b-[20px] bg-nav-background text-center shadow-[var(--nav-shadow)] sm:inset-x-6 lg:hidden"
        style={{ top: "calc(env(safe-area-inset-top) + 5rem)" }}
      >
        {React.Children.toArray(
          navLinks.map((link) => (
            <>
              {link.dropdown === true ? (
                <>
                  <button
                    type="button"
                    ref={mobilePlayTriggerRef}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    aria-controls={PLAY_MENU_ID}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex w-full items-center justify-center gap-3 py-6 text-xl cursor-pointer transition-colors duration-150 active:opacity-80 ${
                      dropdownOpen
                        ? "text-nav-interactive"
                        : "hover:text-nav-interactive"
                    }`}
                  >
                    <div>{link.name}</div>
                  </button>
                  {dropdownOpen ? (
                    <div className="pb-4">{dropdown("mobile")}</div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href={link.path}
                    className={`flex items-center justify-center py-6 text-xl transition-colors duration-150 active:opacity-80 ${
                      router.pathname === link.path
                        ? "text-nav-interactive"
                        : "hover:text-nav-interactive"
                    }`}
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
            className="flex w-full items-center justify-center gap-3 py-6 text-xl text-secondary cursor-pointer transition-colors duration-150 hover:text-nav-interactive"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-3 py-6 text-xl text-secondary cursor-pointer transition-colors duration-150 hover:text-nav-interactive"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    );
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {
      if (closeDropdownTimeout.current) {
        clearTimeout(closeDropdownTimeout.current);
      }
    };
  }, []);
  if (!mounted) return null;

  const pillBase =
    "flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium transition-colors duration-[160ms] ease-in-out active:opacity-80";

  return (
    <div className="relative">
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-canvas lg:hidden"
        />
      )}
      <nav
        className={`relative z-50 mx-0 mt-4 flex h-16 items-center justify-between bg-nav-background px-6 text-nav-text ${
          mobileMenuOpen ? "rounded-t-[20px]" : "rounded-[20px]"
        }`}
      >
        <div className="w-1/5">
          <Link href="/" className="inline-flex rounded-full">
            {/* The nav is a light neutral surface in light theme and a
                dark aubergine surface in dark theme, so the wordmark
                swaps the same way the page background would. */}
            {resolvedTheme === "light" ? (
              <Image src="/logo-light.png" alt="Fimla" width={113} height={32} />
            ) : (
              <Image src="/logo-dark.png" alt="Fimla" width={113} height={32} />
            )}
          </Link>
        </div>

        <div
          className="relative items-center hidden gap-2 lg:flex"
          onMouseLeave={() => closeDropdown()}
        >
          <div
            className="absolute left-0 top-full z-10 mt-2"
            onMouseEnter={openDropdown}
            onMouseLeave={() => closeDropdown()}
          >
            {dropdownOpen ? dropdown() : ""}
          </div>
          {React.Children.toArray(
            navLinks.map((link) => {
              const active =
                router.pathname === link.path
                  ? "bg-nav-interactive text-nav-interactive-text"
                  : "bg-nav-item text-nav-text hover:bg-nav-interactive hover:text-nav-interactive-text";
              // Being on a /games page OR having the dropdown open both
              // count as "Play is active" - same lavender pill either
              // way, so opening the menu never dims it to a different color.
              const playActive =
                router.pathname.includes("/games") || dropdownOpen
                  ? "bg-nav-interactive text-nav-interactive-text"
                  : "bg-nav-item text-nav-text hover:bg-nav-interactive hover:text-nav-interactive-text";
                return (
                  <div>
                  {link.dropdown === true ? (
                    <button
                      type="button"
                      ref={playTriggerRef}
                      aria-haspopup="menu"
                      aria-expanded={dropdownOpen}
                      aria-controls={PLAY_MENU_ID}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      onMouseEnter={openDropdown}
                      className={`${pillBase} ${playActive} cursor-pointer`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.path}
                      onMouseEnter={() => closeDropdown(0)}
                      className={`${pillBase} ${active}`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end w-1/5 gap-x-4">
          <div className="hidden lg:block">
            {session ? (
              <button
                onClick={() => signOut()}
                className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-nav-interactive hover:text-nav-interactive-text"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-nav-interactive hover:text-nav-interactive-text"
              >
                Sign in
              </button>
            )}
          </div>
          <button
            aria-label="dark-mode"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full p-2 transition-colors duration-150 hover:text-nav-interactive"
          >
            {theme === "light" ? <HiMoon /> : <HiSun />}
          </button>

          <button
            aria-label="navigation-menu"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="col-span-2 rounded-full p-2 text-xl text-center transition-colors duration-150 hover:text-nav-interactive lg:hidden"
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
