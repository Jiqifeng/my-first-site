# Nova · 苹果风格产品介绍站

基于 Next.js 15（App Router）、Tailwind CSS 与 Framer Motion 的多产品展示站：极简黑白、大留白、玻璃导航栏，支持深色模式。

## 当前进度

- ✅ 全局视觉与玻璃化 `Header`
- ✅ 全屏 **Hero**（产品名 + Slogan +「了解更多」「购买」）+ Framer Motion 入场动效
- ✅ **产品 A**：全屏背景图 + 居中文案 + 滚动视区内淡入缩放
- ⏳ **产品 B / C**：占位区块，待细化布局与动效

## 技术栈

- Next.js 15（App Router）
- React 19
- Tailwind CSS 3
- Framer Motion
- TypeScript

## 如何运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

```bash
npm run build && npm start
```

## 项目结构（节选）

```
src/
├── app/
│   ├── globals.css   # 纯白/纯黑主题变量
│   ├── layout.tsx
│   └── page.tsx      # Hero + ProductA/B/C
└── components/
    ├── ThemeProvider.tsx
    ├── Header.tsx
    ├── Hero.tsx
    └── products/
        ├── ProductA.tsx   # 全屏背景图产品区
        ├── ProductB.tsx   # 占位
        └── ProductC.tsx   # 占位
```

## 图片

远程图来自 Unsplash，已在 `next.config.ts` 中配置 `images.unsplash.com`。
