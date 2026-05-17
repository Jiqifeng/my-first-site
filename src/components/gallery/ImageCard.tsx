import Link from "next/link";
import Image from "next/image";

type ImageCardProps = {
  id: string;
  title: string;
  previewUrl: string;
  uploadedAt: string | Date;
};

export function ImageCard({ id, title, previewUrl, uploadedAt }: ImageCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-glass-border bg-glass">
      <Link href={`/image/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5">
          <Image
            src={previewUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <div className="space-y-1 p-4">
          <h3 className="line-clamp-1 text-base font-medium text-ink">{title}</h3>
          <p className="text-sm text-ink-muted">
            {new Date(uploadedAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>
      </Link>
    </article>
  );
}
