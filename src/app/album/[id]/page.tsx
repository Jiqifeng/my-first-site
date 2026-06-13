import Link from "next/link";
import { ImageStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { AlbumSlideshow } from "@/components/gallery/AlbumSlideshow";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await db.album.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: {
          email: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!album || album.status !== ImageStatus.PUBLISHED || album.images.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 pb-16 pt-28">
      <Link href="/" className="text-sm text-ink-muted transition hover:text-ink">
        ← 返回相册列表
      </Link>

      <section className="mt-6">
        <AlbumSlideshow
          title={album.title}
          images={album.images.map((image) => ({
            id: image.id,
            hdImageUrl: image.hdImageUrl,
            previewUrl: image.previewUrl,
          }))}
        />
      </section>

      <section className="mt-6 space-y-2">
        <h1 className="text-3xl font-semibold text-ink">{album.title}</h1>
        {album.description ? (
          <p className="max-w-3xl text-base leading-relaxed text-ink-muted">{album.description}</p>
        ) : null}
        <p className="text-sm text-ink-muted">
          上传者：{album.uploadedBy.email} · 共 {album.images.length} 张 · 发布时间：
          {album.publishedAt
            ? new Date(album.publishedAt).toLocaleString("zh-CN")
            : new Date(album.uploadedAt).toLocaleString("zh-CN")}
        </p>
        <p className="text-xs text-ink-muted">使用 ← → 方向键可快速切换图片</p>
      </section>
    </main>
  );
}
