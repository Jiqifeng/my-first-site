import Image, { ImageProps } from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  displayWidth?: number;
};

export function CloudinaryImage({ src, displayWidth, ...props }: CloudinaryImageProps) {
  const resolvedSrc = displayWidth ? cloudinaryUrl(src, { width: displayWidth, quality: "auto" }) : src;

  return <Image {...props} src={resolvedSrc} unoptimized />;
}
