import { ImageStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const statusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

const statusMap = {
  draft: ImageStatus.DRAFT,
  published: ImageStatus.PUBLISHED,
  archived: ImageStatus.ARCHIVED,
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "状态参数错误" }, { status: 400 });
    }

    const image = await db.imageItem.update({
      where: { id },
      data: {
        status: statusMap[parsed.data.status],
        publishedAt: parsed.data.status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ item: image });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "更新失败" }, { status: 400 });
  }
}
