import { ImageStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserSession } from "@/lib/auth-guard";

export async function GET() {
  try {
    await requireUserSession();

    const albums = await db.album.findMany({
      where: {
        status: ImageStatus.PUBLISHED,
      },
      select: {
        id: true,
        title: true,
        description: true,
        uploadedAt: true,
        images: {
          select: {
            previewUrl: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 60,
    });

    const items = albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      uploadedAt: album.uploadedAt,
      previewUrl: album.images[0]?.previewUrl ?? "",
      imageCount: album._count.images,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "未登录或读取失败" }, { status: 401 });
  }
}
