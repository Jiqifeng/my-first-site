"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-24 pt-[calc(4rem+env(safe-area-inset-top))]"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.p
          className="mb-4 text-[13px] font-medium uppercase tracking-[0.28em] text-ink-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          全新登场
        </motion.p>

        <motion.h1
          className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[5.5rem]"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Nova One
        </motion.h1>

        <motion.p
          className="mt-8 max-w-2xl text-balance text-xl font-medium leading-snug text-ink-muted sm:text-2xl md:text-[1.65rem]"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          强大，不言而喻。
          <br className="hidden sm:block" />
          为下一刻，重新设计。
        </motion.p>

        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-5 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#product-a"
            className="text-[17px] font-normal text-accent underline decoration-1 underline-offset-4 transition hover:opacity-80"
          >
            了解更多
          </a>
          <a
            href="#product-a"
            className="rounded-full bg-accent px-8 py-3 text-[17px] font-medium text-white transition hover:bg-accent/90"
          >
            购买
          </a>
        </motion.div>
      </div>
    </section>
  );
}
