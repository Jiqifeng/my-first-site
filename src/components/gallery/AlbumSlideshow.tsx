"use client";

import { CloudinaryImage } from "@/components/gallery/CloudinaryImage";
import { useCallback, useEffect, useState } from "react";

type SlideImage = {
  id: string;
  hdImageUrl: string;
  previewUrl: string;
};

type AlbumSlideshowProps = {
  images: SlideImage[];
  title: string;
};

export function AlbumSlideshow({ images, title }: AlbumSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;
  const current = images[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrentIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  if (!current) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-glass-border bg-black/5 dark:bg-white/5">
        <CloudinaryImage
          key={current.id}
          src={current.hdImageUrl}
          displayWidth={1920}
          alt={`${title} - 第 ${currentIndex + 1} 张`}
          fill
          className="object-contain p-2"
          sizes="100vw"
          priority
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="上一张"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="下一张"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              ›
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`跳转到第 ${index + 1} 张`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === currentIndex
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <CloudinaryImage
                src={image.previewUrl}
                displayWidth={128}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
