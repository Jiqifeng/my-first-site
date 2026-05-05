import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Gallery Hub · 邀请制图片站",
  description: "登录后可访问的图片展示网站，支持管理员上传与邀请码注册。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
