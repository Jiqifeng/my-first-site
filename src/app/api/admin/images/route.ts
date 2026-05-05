import { ImageStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const createImageSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  hdImageUrl: z.string().url("高清图片地址无效"),
  previewUrl: z.string().url("预览图地址无效").optional(),
  publicId: z.string().min(1, "publicId 不能为空"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

function toPrismaStatus(status: "draft" | "published" | "archived"): ImageStatus {
  if (status === "published") return ImageStatus.PUBLISHED;
  if (status === "archived") return ImageStatus.ARCHIVED;
  return ImageStatus.DRAFT;
}

export async function GET() {
  try {
    await requireAdminSession();
    const images = await db.imageItem.findMany({
      include: {
        uploadedBy: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items: images });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();
    const parsed = createImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "参数错误" },
        { status: 400 },
      );
    }

    const image = await db.imageItem.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        hdImageUrl: parsed.data.hdImageUrl,
        previewUrl: parsed.data.previewUrl ?? parsed.data.hdImageUrl,
        publicId: parsed.data.publicId,
        uploadedById: session.user.id,
        status: toPrismaStatus(parsed.data.status),
        publishedAt: parsed.data.status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ item: image }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }
}
