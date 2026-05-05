"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminImageItem = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  uploadedBy: {
    email: string;
  };
};

export default function AdminImagesPage() {
  const [items, setItems] = useState<AdminImageItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    const response = await fetch("/api/admin/images");
    const payload = (await response.json()) as { items?: AdminImageItem[]; message?: string };
    if (!response.ok) {
      setMessage(payload.message ?? "加载失败");
      setLoading(false);
      return;
    }
    setItems(payload.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void fetchItems();
  }, []);

  async function updateStatus(id: string, status: "draft" | "published" | "archived") {
    const response = await fetch(`/api/admin/images/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      setMessage(payload.message ?? "更新状态失败");
      return;
    }
    setMessage("状态已更新");
    void fetchItems();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-16 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-ink">图片管理</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/upload"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
          >
            去上传
          </Link>
          <Link
            href="/admin/invites"
            className="rounded-xl border border-glass-border px-4 py-2 text-sm text-ink/80 transition hover:text-ink"
          >
            邀请码管理
          </Link>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-glass-border">
        <table className="min-w-full divide-y divide-glass-border">
          <thead className="bg-glass">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">标题</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">上传者</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">创建时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border bg-surface/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-ink-muted">
                  加载中...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-ink-muted">
                  暂无图片
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm text-ink">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">{item.status}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">{item.uploadedBy.email}</td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {new Date(item.createdAt).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void updateStatus(item.id, "draft")}
                        className="rounded-lg border border-glass-border px-3 py-1 text-xs text-ink-muted"
                      >
                        草稿
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateStatus(item.id, "published")}
                        className="rounded-lg bg-accent px-3 py-1 text-xs text-white"
                      >
                        发布
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateStatus(item.id, "archived")}
                        className="rounded-lg border border-glass-border px-3 py-1 text-xs text-ink-muted"
                      >
                        归档
                      </button>
                    </div>
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
