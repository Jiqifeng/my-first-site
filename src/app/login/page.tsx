"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistered(params.get("registered") === "1");
    setCallbackUrl(params.get("callbackUrl") || "/");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (!result || result.error) {
      setError("邮箱或密码错误");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-glass-border bg-glass p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold text-ink">登录</h1>
        {registered ? (
          <p className="mt-2 text-sm text-green-600">注册成功，请登录。</p>
        ) : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-ink-muted">
            邮箱
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
            />
          </label>
          <label className="block text-sm text-ink-muted">
            密码
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-accent px-4 py-2.5 font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          还没有账号？{" "}
          <Link href="/register" className="text-accent hover:underline">
            去注册
          </Link>
        </p>
      </section>
    </main>
  );
}
