import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const album = await db.album.findUnique({
      where: { id },
      include: {
        images: {
          select: { publicId: true },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ message: "相册不存在" }, { status: 404 });
    }

    if (isCloudinaryConfigured()) {
      await Promise.allSettled(
        album.images.map((image) =>
          cloudinary.uploader.destroy(image.publicId, { resource_type: "image" }),
        ),
      );
    }

    await db.album.delete({ where: { id } });

    return NextResponse.json({ message: "相册已删除" });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "删除失败" }, { status: 400 });
  }
}
