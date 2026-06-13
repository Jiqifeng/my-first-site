import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST() {
  try {
    await requireAdminSession();

    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ message: "Cloudinary 环境变量未配置" }, { status: 500 });
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "my-first-site/images";
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      apiSecret,
    );

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      cloudName,
      apiKey,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "获取上传签名失败" }, { status: 401 });
  }
}
