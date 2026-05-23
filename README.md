# Gallery Hub · 邀请制图片展示站

基于 Next.js 15（App Router）构建的会员图片站：邀请码注册、邮箱密码登录、管理员上传与发布、普通用户登录后浏览已发布内容。

## 功能范围（第一期）

- 邀请码注册（一次性）
- 邮箱密码登录与会话管理（NextAuth）
- 图片流首页与图片详情页
- 管理后台：
  - 图片上传（Cloudinary 直传）
  - 图片状态管理（draft / published / archived）
  - 邀请码生成与查询

## 技术栈

- Next.js 15 + React 19 + TypeScript
- NextAuth（Credentials）
- Prisma + PostgreSQL（推荐 Neon）
- Tailwind CSS
- Cloudinary（媒体存储与上传）

## 环境变量

复制模板：

```bash
cp .env.example .env.local
```

必填变量：

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

可选变量（seed）：

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_INVITE_CODE`

## 本地启动

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 关键路由

- 公开：`/login`、`/register`
- 登录后：`/`、`/image/[id]`、`/profile`
- 管理员：`/admin/upload`、`/admin/images`、`/admin/invites`

## 部署（Vercel + Neon）

1. 推送代码到 GitHub（`main` 或 PR 分支）
2. 在 Vercel 项目中配置环境变量（Production/Preview）
3. 触发 Redeploy
4. 将迁移应用到 Neon：

```bash
DATABASE_URL="your_neon_url" npx prisma migrate deploy
```

5. （可选）初始化管理员与邀请码：

```bash
DATABASE_URL="your_neon_url" npm run db:seed
```

## 验收清单（最小）

- 游客访问 `/` 会跳转 `/login`
- 邀请码注册成功后不可复用
- 管理员可上传并发布图片
- 普通用户可浏览已发布图片
- 普通用户无法访问 `/admin/*`

## 安全提醒

- 不要提交任何真实密钥（`.env*`、`vercel.env` 已在 `.gitignore`）
- `NEXTAUTH_SECRET` 与 `CLOUDINARY_API_SECRET` 仅放本地和平台环境变量
- seed 改密完成后建议移除 `SEED_ADMIN_PASSWORD`
