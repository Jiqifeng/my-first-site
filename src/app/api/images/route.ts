import { ImageStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUserSession } from "@/lib/auth-guard";

export async function GET() {
  try {
    await requireUserSession();

    const items = await db.imageItem.findMany({
      where: {
        status: ImageStatus.PUBLISHED,
      },
      select: {
        id: true,
        title: true,
        description: true,
        hdImageUrl: true,
        previewUrl: true,
        uploadedAt: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 60,
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "未登录或读取失败" }, { status: 401 });
  }
}
