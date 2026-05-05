"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type InviteItem = {
  id: string;
  code: string;
  enabled: boolean;
  usedAt: string | null;
  expiresAt: string | null;
  usedBy: {
    email: string;
  } | null;
  createdAt: string;
};

export default function AdminInvitesPage() {
  const [items, setItems] = useState<InviteItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState("");

  async function fetchInvites() {
    const response = await fetch("/api/admin/invites");
    const payload = (await response.json()) as { items?: InviteItem[]; message?: string };
    if (!response.ok) {
      setMessage(payload.message ?? "加载邀请码失败");
      return;
    }
    setItems(payload.items ?? []);
  }

  useEffect(() => {
    void fetchInvites();
  }, []);

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/admin/invites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      }),
    });
    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      setMessage(payload.message ?? "创建邀请码失败");
      return;
    }

    setMessage("邀请码已生成");
    setExpiresAt("");
    void fetchInvites();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 pb-16 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-ink">邀请码管理</h1>
        <Link
          href="/admin/images"
          className="rounded-xl border border-glass-border px-4 py-2 text-sm text-ink/80 transition hover:text-ink"
        >
          返回图片管理
        </Link>
      </div>

      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}

      <form
        onSubmit={createInvite}
        className="mt-6 rounded-2xl border border-glass-border bg-glass p-6"
      >
        <label className="block text-sm text-ink-muted">
          过期时间（可选）
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
          />
        </label>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90"
        >
          生成邀请码
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-glass-border">
        <table className="min-w-full divide-y divide-glass-border">
          <thead className="bg-glass">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">邀请码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">使用者</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">过期时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border bg-surface/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-ink-muted">
                  暂无邀请码
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm font-medium text-ink">{item.code}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {!item.enabled
                      ? "已禁用"
                      : item.usedAt
                        ? "已使用"
                        : item.expiresAt && new Date(item.expiresAt).getTime() < Date.now()
                          ? "已过期"
                          : "可用"}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-muted">{item.usedBy?.email ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {item.expiresAt ? new Date(item.expiresAt).toLocaleString("zh-CN") : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
