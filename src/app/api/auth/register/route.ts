import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateInviteCode } from "@/lib/invite";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "密码至少 8 位"),
  inviteCode: z.string().min(1, "邀请码不能为空"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const { password, inviteCode } = parsed.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "该邮箱已注册" }, { status: 409 });
    }

    const invite = await validateInviteCode(inviteCode);
    if (!invite) {
      return NextResponse.json({ message: "邀请码无效或已使用" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      await tx.inviteCode.update({
        where: { id: invite.id },
        data: {
          usedAt: new Date(),
          usedByUserId: created.id,
        },
      });

      return created;
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "注册失败，请稍后重试", detail: error instanceof Error ? error.message : undefined },
      { status: 500 },
    );
  }
}
