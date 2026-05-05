"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";

const nav = [{ href: "/", label: "发现" }, { href: "/profile", label: "个人" }];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-glass backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-glass">
      <nav className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-5 md:h-14 md:px-8">
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-ink">
          Gallery Hub
        </Link>
        <div className="flex items-center gap-5 md:gap-8">
          {session &&
            nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hidden text-[13px] font-normal text-ink/80 transition hover:text-ink sm:inline"
              >
                {item.label}
              </Link>
            ))}
          {isAdmin ? (
            <Link
              href="/admin/images"
              className="hidden text-[13px] font-normal text-ink/80 transition hover:text-ink sm:inline"
            >
              管理
            </Link>
          ) : null}
          {!session ? (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-accent/90"
            >
              登录
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-full border border-glass-border px-4 py-1.5 text-[13px] text-ink/80 transition hover:text-ink"
            >
              退出
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-ink/70 transition hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
