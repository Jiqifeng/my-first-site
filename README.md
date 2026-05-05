# Gallery Hub · 邀请制图片展示站

该项目基于 Next.js 15（App Router）实现，定位为登录后可访问的图片内容平台，支持邀请码注册、邮箱登录、管理员上传与发布管理。

## 功能范围（第一期）

- 邀请码注册（一次性）
- 邮箱密码登录与会话管理
- 登录后访问图片流与图片详情
- 管理员后台：
  - 图片上传（Cloudinary 直传）
  - 图片状态管理（draft / published / archived）
  - 邀请码生成与查询

## 技术栈

- Next.js 15 + React 19 + TypeScript
- NextAuth（Credentials）
- Prisma + PostgreSQL
- Tailwind CSS
- Cloudinary（图片上传）

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env
```

3. 生成 Prisma Client 并执行迁移

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. 初始化管理员和邀请码（可选）

```bash
npm run db:seed
```

5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 关键路由

- 公开路由：`/login`、`/register`
- 登录后：`/`、`/image/[id]`、`/profile`
- 管理员：`/admin/upload`、`/admin/images`、`/admin/invites`

## 部署建议（Vercel）

- Web 与 API 部署在 Vercel
- 数据库建议使用 Neon Postgres
- 图片采用 Cloudinary 直传，避免经过 Vercel 函数中转
- 在 Vercel 中配置 `.env.example` 里所有变量
