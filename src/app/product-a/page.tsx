import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Genetic Phone · 产品 A 详情",
  description: "Genetic Phone 让硬件随环境持续进化：自主学习调参，隐私本地推理，每次迭代更快更稳。",
};

export default function ProductADetailPage() {
  const intro =
    "让硬件随环境持续进化：自主学习调参，隐私本地推理，每次迭代更快更稳。";
  // 约定：把本地图片放到 public/product-a/ 下，命名为 1.png / 2.png / 3.png
  const imageSlots = [1, 2, 3];

  return (
    <main className="min-h-screen px-6 pb-24 pt-[78px]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/#product-a"
            className="text-ink-muted hover:text-ink transition-colors"
          >
            ← 返回产品展示
          </Link>
        </div>

        <header className="mt-10">
          <p className="text-[13px] font-medium uppercase tracking-[0.24em] text-ink-muted">
            Genetic Phone
          </p>
          <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight text-ink sm:text-6xl md:text-7xl">
            下一代基因手机
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {intro}
          </p>
        </header>

        <section className="mt-14">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-ink-muted">
            图片预留（稍后替换为你的素材）
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {imageSlots.map((n) => (
              <div
                key={n}
                aria-label={`产品 A 图片占位 ${n}`}
                className="relative overflow-hidden rounded-3xl border border-glass-border bg-black/5 dark:bg-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5" />
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/product-a/${n}.png`}
                    alt={`Genetic Phone 图片 ${n}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority={n === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

