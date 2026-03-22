"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/** 高科技 / 极简办公场景占位图（Unsplash） */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=80";

export function ProductA() {
  return (
    <section
      id="product-a"
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* 暗角与遮罩，保证白字可读 */}
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" aria-hidden />

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28 text-center">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.24em] text-white/75">
            Genetic Phone
          </p>
          <Link
            href="/product-a"
            className="inline-block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            aria-label="进入产品 A 详情页面"
          >
            <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white transition-opacity sm:text-5xl md:text-6xl lg:text-7xl hover:opacity-90">
              下一代基因手机
            </h2>
          </Link>
          <p className="mt-8 text-lg font-medium leading-relaxed text-white/85 sm:text-xl md:text-2xl">
            自主进化，智能迭代
          </p>
        </motion.div>

        <motion.p
          className="absolute bottom-12 left-0 right-0 text-center text-[13px] text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          向下滚动，探索更多产品
        </motion.p>
      </div>
    </section>
  );
}
