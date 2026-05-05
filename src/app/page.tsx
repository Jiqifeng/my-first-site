import { GalleryFeed } from "@/components/gallery/GalleryFeed";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-16 pt-28">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">Members Only</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">图片内容中心</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">仅注册用户可访问。这里展示管理员发布的最新内容。</p>
      </header>
      <GalleryFeed />
    </main>
  );
}
