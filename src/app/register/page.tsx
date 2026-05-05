"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, inviteCode }),
    });

    const payload = (await response.json()) as { message?: string };
    setIsPending(false);

    if (!response.ok) {
      setError(payload.message ?? "注册失败，请稍后重试");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-glass-border bg-glass p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold text-ink">注册</h1>
        <p className="mt-2 text-sm text-ink-muted">仅支持邀请码注册。</p>
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
          <label className="block text-sm text-ink-muted">
            邀请码
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 uppercase text-ink outline-none ring-accent/30 transition focus:ring"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-accent px-4 py-2.5 font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "注册中..." : "创建账号"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          已有账号？{" "}
          <Link href="/login" className="text-accent hover:underline">
            去登录
          </Link>
        </p>
      </section>
    </main>
  );
}
