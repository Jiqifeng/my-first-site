"use client";

import { useEffect, useState } from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

type GalleryApiItem = {
  id: string;
  title: string;
  description: string | null;
  hdImageUrl: string;
  previewUrl: string;
  uploadedAt: string;
};

export function GalleryFeed() {
  const [items, setItems] = useState<GalleryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch("/api/images", { cache: "no-store" });
        const payload = (await response.json()) as { items?: GalleryApiItem[]; message?: string };
        if (!response.ok) {
          throw new Error(payload.message ?? "读取图片失败");
        }
        setItems(payload.items ?? []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "读取图片失败");
      } finally {
        setLoading(false);
      }
    }

    void loadItems();
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-glass-border bg-glass p-10 text-center text-ink-muted">图片加载中...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-glass-border bg-glass p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <GalleryGrid
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        previewUrl: item.previewUrl,
        uploadedAt: item.uploadedAt,
      }))}
    />
  );
}
