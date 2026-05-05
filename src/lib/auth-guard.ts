import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type GuardSession = {
  user: {
    id: string;
    role: "admin" | "user";
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function requireUserSession(): Promise<GuardSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return session as GuardSession;
}

export async function requireAdminSession(): Promise<GuardSession> {
  const session = await requireUserSession();

  if (session.user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return session;
}
