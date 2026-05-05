import { ImageCard } from "@/components/gallery/ImageCard";

type GalleryItem = {
  id: string;
  title: string;
  previewUrl: string;
  uploadedAt: string | Date;
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-glass-border bg-glass p-10 text-center text-ink-muted">
        暂无已发布图片，请稍后再来。
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ImageCard key={item.id} {...item} />
      ))}
    </section>
  );
}
