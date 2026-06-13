"use client";

import { FormEvent, useState } from "react";

type UploadSignaturePayload = {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
};

type UploadedImage = {
  hdImageUrl: string;
  publicId: string;
};

export default function AdminUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  async function uploadToCloudinary(file: File, sigPayload: UploadSignaturePayload): Promise<UploadedImage> {
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
      throw new Error(uploadPayload.error?.message ?? `「${file.name}」上传失败`);
    }

    return {
      hdImageUrl: uploadPayload.secure_url,
      publicId: uploadPayload.public_id,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (files.length === 0) {
      setMessage("请先选择至少一张图片");
      return;
    }

    setIsPending(true);
    setMessage(null);
    setUploadProgress(null);

    try {
      const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
      const sigPayload = (await sigRes.json()) as UploadSignaturePayload & { message?: string };
      if (!sigRes.ok) {
        throw new Error(sigPayload.message ?? "获取上传签名失败");
      }

      const uploadedImages: UploadedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`正在上传第 ${i + 1}/${files.length} 张...`);
        const result = await uploadToCloudinary(files[i], sigPayload);
        uploadedImages.push(result);
      }

      setUploadProgress("正在保存相册...");

      const createRes = await fetch("/api/admin/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          images: uploadedImages,
        }),
      });

      const createPayload = (await createRes.json()) as { message?: string };
      if (!createRes.ok) {
        throw new Error(createPayload.message ?? "保存相册信息失败");
      }

      setMessage(`上传成功，共 ${uploadedImages.length} 张图片`);
      setTitle("");
      setDescription("");
      setFiles([]);
      setStatus("draft");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setIsPending(false);
      setUploadProgress(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 pb-16 pt-28">
      <h1 className="text-3xl font-semibold text-ink">上传相册</h1>
      <p className="mt-2 text-ink-muted">仅管理员可操作。可一次选择多张图片，它们会组成一个相册文件夹。</p>
      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}
      {uploadProgress ? <p className="mt-2 text-sm text-accent">{uploadProgress}</p> : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-glass-border bg-glass p-6">
        <label className="block text-sm text-ink-muted">
          相册标题
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
          图片文件（可多选）
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="mt-1 block w-full text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white hover:file:bg-accent/90"
          />
        </label>
        {files.length > 0 ? (
          <p className="text-sm text-ink-muted">已选择 {files.length} 张图片：{files.map((f) => f.name).join("、")}</p>
        ) : null}
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
          {isPending ? "上传中..." : "上传并保存相册"}
        </button>
      </form>
    </main>
  );
}
