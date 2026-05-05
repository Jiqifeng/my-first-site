import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const createInviteSchema = z.object({
  expiresAt: z.string().datetime().optional(),
  enabled: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdminSession();
    const invites = await db.inviteCode.findMany({
      include: {
        usedBy: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items: invites });
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
    const body = await request.json().catch(() => ({}));
    const parsed = createInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "参数错误" }, { status: 400 });
    }

    const code = `INV-${randomBytes(4).toString("hex").toUpperCase()}`;
    const invite = await db.inviteCode.create({
      data: {
        code,
        createdById: session.user.id,
        enabled: parsed.data.enabled ?? true,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });

    return NextResponse.json({ item: invite }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ message: "创建邀请码失败" }, { status: 401 });
  }
}
