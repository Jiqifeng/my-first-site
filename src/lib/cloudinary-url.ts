const UPLOAD_MARKER = "/upload/";

export function cloudinaryUrl(
  url: string,
  options: { width?: number; quality?: "auto" | number } = {},
): string {
  const markerIndex = url.indexOf(UPLOAD_MARKER);
  if (markerIndex === -1 || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const transforms: string[] = ["f_auto"];
  if (options.width) {
    transforms.push(`w_${options.width}`, "c_limit");
  }
  if (options.quality) {
    transforms.push(`q_${options.quality}`);
  }

  const prefix = url.slice(0, markerIndex + UPLOAD_MARKER.length);
  const suffix = url.slice(markerIndex + UPLOAD_MARKER.length);
  return `${prefix}${transforms.join(",")}/${suffix}`;
}
