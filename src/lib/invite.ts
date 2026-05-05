import { db } from "@/lib/db";

export async function validateInviteCode(code: string) {
  const invite = await db.inviteCode.findUnique({
    where: { code },
  });

  if (!invite || !invite.enabled || invite.usedAt) {
    return null;
  }

  if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return invite;
}
