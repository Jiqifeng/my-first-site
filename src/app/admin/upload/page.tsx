"use client";

import { FormEvent, useState } from "react";

type UploadSignaturePayload = {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
};

export default function AdminUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("请先选择图片文件");
      return;
    }

    setIsPending(true);
    setMessage(null);

    try {
      const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
      const sigPayload = (await sigRes.json()) as UploadSignaturePayload & { message?: string };
      if (!sigRes.ok) {
        throw new Error(sigPayload.message ?? "获取上传签名失败");
      }

      const cloudForm = new FormData();
      cloudForm.set("file", file);
      cloudForm.set("api_key", sigPayload.apiKey);
      cloudForm.set("timestamp", String(sigPayload.timestamp));
      cloudForm.set("signature", sigPayload.signature);
      cloudForm.set("folder", sigPayload.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigPayload.cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudForm,
        },
      );
      const uploadPayload = (await uploadRes.json()) as {
        secure_url?: string;
        public_id?: string;
        error?: { message?: string };
      };
      if (!uploadRes.ok || !uploadPayload.secure_url || !uploadPayload.public_id) {
        throw new Error(uploadPayload.error?.message ?? "图片上传失败");
      }

      const createRes = await fetch("/api/admin/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          hdImageUrl: uploadPayload.secure_url,
          publicId: uploadPayload.public_id,
          status,
        }),
      });

      const createPayload = (await createRes.json()) as { message?: string };
      if (!createRes.ok) {
        throw new Error(createPayload.message ?? "保存图片信息失败");
      }

      setMessage("上传成功");
      setTitle("");
      setDescription("");
      setFile(null);
      setStatus("draft");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 pb-16 pt-28">
      <h1 className="text-3xl font-semibold text-ink">上传图片</h1>
      <p className="mt-2 text-ink-muted">仅管理员可操作。图片会直传到 Cloudinary。</p>
      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-glass-border bg-glass p-6">
        <label className="block text-sm text-ink-muted">
          标题
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
          />
        </label>
        <label className="block text-sm text-ink-muted">
          描述
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
          />
        </label>
        <label className="block text-sm text-ink-muted">
          图片文件
          <input
            type="file"
            accept="image/*"
            required
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white hover:file:bg-accent/90"
          />
        </label>
        <label className="block text-sm text-ink-muted">
          发布状态
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "draft" | "published")}
            className="mt-1 w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-ink outline-none ring-accent/30 transition focus:ring"
          >
            <option value="draft">草稿</option>
            <option value="published">直接发布</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "上传中..." : "上传并保存"}
        </button>
      </form>
    </main>
  );
}
