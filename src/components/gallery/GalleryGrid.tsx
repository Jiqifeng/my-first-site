import { AlbumCard } from "@/components/gallery/AlbumCard";

type GalleryItem = {
  id: string;
  title: string;
  previewUrl: string;
  uploadedAt: string | Date;
  imageCount: number;
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-glass-border bg-glass p-10 text-center text-ink-muted">
        暂无已发布相册，请稍后再来。
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <AlbumCard key={item.id} {...item} />
      ))}
    </section>
  );
}
