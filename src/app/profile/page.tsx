import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 pb-16 pt-28">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">个人中心</h1>
      <div className="mt-6 rounded-2xl border border-glass-border bg-glass p-6">
        <p className="text-sm text-ink-muted">当前登录邮箱</p>
        <p className="mt-1 text-lg text-ink">{session?.user?.email ?? "-"}</p>
        <p className="mt-4 text-sm text-ink-muted">角色</p>
        <p className="mt-1 capitalize text-lg text-ink">{session?.user?.role ?? "-"}</p>
      </div>
    </main>
  );
}
