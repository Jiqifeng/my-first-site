import Image from "next/image";
import Link from "next/link";
import { ImageStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.imageItem.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!item || item.status !== ImageStatus.PUBLISHED) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 pb-16 pt-28">
      <Link href="/" className="text-sm text-ink-muted transition hover:text-ink">
        ← 返回图片流
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-glass-border bg-glass">
        <div className="relative aspect-[16/10] w-full">
          <Image src={item.hdImageUrl} alt={item.title} fill className="object-cover" sizes="100vw" priority />
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <h1 className="text-3xl font-semibold text-ink">{item.title}</h1>
        {item.description ? <p className="max-w-3xl text-base leading-relaxed text-ink-muted">{item.description}</p> : null}
        <p className="text-sm text-ink-muted">
          上传者：{item.uploadedBy.email} · 发布时间：
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleString("zh-CN")
            : new Date(item.uploadedAt).toLocaleString("zh-CN")}
        </p>
      </section>
    </main>
  );
}
