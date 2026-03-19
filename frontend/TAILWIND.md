# Tailwind CSS 教學指南

本文件說明如何在專案中設定和使用 Tailwind CSS。

> ⚠️ **注意**：目前專案使用 MUI sx props 進行樣式設計。若要使用 Tailwind，需先完成安裝配置。

---

## 目錄

- [安裝與配置](#安裝與配置)
- [基礎語法](#基礎語法)
- [響應式設計](#響應式設計)
- [自訂配置](#自訂配置)
- [常用類別速查](#常用類別速查)
- [與 MUI 搭配使用](#與-mui-搭配使用)

---

## 安裝與配置

### 安裝套件 (Tailwind v3)

```bash
cd frontend
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          blue: '#0078D4',
          'blue-dark': '#005A9E',
          green: '#107C10',
          purple: '#8764B8',
          yellow: '#FFB900',
          red: '#E81123',
          cyan: '#00B7C3',
          teal: '#038387',
          violet: '#5C2D91',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 避免與 MUI 衝突
  },
}
```

### postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 其他自訂樣式 */
```

---

## 基礎語法

### 間距 (Spacing)

| 類別 | CSS | 像素 |
|------|-----|------|
| `p-1` | `padding: 0.25rem` | 4px |
| `p-2` | `padding: 0.5rem` | 8px |
| `p-4` | `padding: 1rem` | 16px |
| `p-6` | `padding: 1.5rem` | 24px |
| `p-8` | `padding: 2rem` | 32px |
| `m-4` | `margin: 1rem` | 16px |
| `gap-2` | `gap: 0.5rem` | 8px |

**方向修飾**：
- `px-` → 左右
- `py-` → 上下
- `pt-` / `pb-` / `pl-` / `pr-` → 單邊

```html
<div class="p-4 px-6 mt-2">內容</div>
```

### 顏色

```html
<!-- 文字顏色 -->
<p class="text-white">白色</p>
<p class="text-gray-500">灰色</p>
<p class="text-metro-blue">Metro 藍</p>

<!-- 背景顏色 -->
<div class="bg-white">白色背景</div>
<div class="bg-metro-green">Metro 綠色背景</div>

<!-- 邊框顏色 -->
<div class="border border-gray-300">灰色邊框</div>
```

### Flexbox

```html
<!-- 水平置中 -->
<div class="flex justify-center items-center">
  內容
</div>

<!-- 兩端對齊 -->
<div class="flex justify-between">
  <span>左</span>
  <span>右</span>
</div>

<!-- 垂直排列 -->
<div class="flex flex-col gap-2">
  <div>項目 1</div>
  <div>項目 2</div>
</div>

<!-- 換行 -->
<div class="flex flex-wrap gap-2">
  <span>標籤1</span>
  <span>標籤2</span>
</div>
```

### Grid 網格

```html
<!-- 3 欄 Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- 跨欄 -->
<div class="grid grid-cols-4 gap-2">
  <div class="col-span-2">佔 2 欄</div>
  <div>1 欄</div>
  <div>1 欄</div>
</div>
```

### 文字樣式

```html
<!-- 字體大小 -->
<p class="text-xs">12px</p>
<p class="text-sm">14px</p>
<p class="text-base">16px</p>
<p class="text-lg">18px</p>
<p class="text-xl">20px</p>
<p class="text-2xl">24px</p>

<!-- 字體粗細 -->
<p class="font-light">細體 (300)</p>
<p class="font-normal">正常 (400)</p>
<p class="font-medium">中等 (500)</p>
<p class="font-semibold">半粗 (600)</p>
<p class="font-bold">粗體 (700)</p>

<!-- 對齊 -->
<p class="text-center">置中</p>
```

---

## 響應式設計

### 斷點 (Breakpoints)

| 前綴 | 最小寬度 | 說明 |
|------|----------|------|
| (無) | 0px | 手機優先 |
| `sm:` | 640px | 大手機/小平板 |
| `md:` | 768px | 平板 |
| `lg:` | 1024px | 桌面 |
| `xl:` | 1280px | 大桌面 |

### 使用範例

```html
<!-- 響應式 Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- 手機 1 欄, 平板 2 欄, 桌面 3 欄, 大桌面 4 欄 -->
</div>

<!-- 響應式文字大小 -->
<h1 class="text-xl md:text-2xl lg:text-3xl">
  標題
</h1>

<!-- 響應式間距 -->
<div class="p-2 md:p-4 lg:p-6">
  內容
</div>

<!-- 響應式顯示/隱藏 -->
<div class="hidden md:block">僅桌面顯示</div>
<div class="block md:hidden">僅手機顯示</div>
```

### 實際範例：響應式卡片

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="p-4 border border-gray-200 bg-white">
      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  ))}
</div>
```

---

## 自訂配置

### Metro 色彩系統

在 `tailwind.config.js` 中擴展：

```js
theme: {
  extend: {
    colors: {
      metro: {
        blue: '#0078D4',
        'blue-dark': '#005A9E',
        'blue-light': '#2899F5',
        green: '#107C10',
        purple: '#8764B8',
        yellow: '#FFB900',
        red: '#E81123',
        cyan: '#00B7C3',
        teal: '#038387',
        violet: '#5C2D91',
      },
      surface: {
        DEFAULT: '#FFFFFF',
        secondary: '#F3F2F1',
        border: '#E1DFDD',
      },
      text: {
        primary: '#323130',
        secondary: '#605E5C',
      },
    },
  },
}
```

**使用**：

```html
<div class="bg-metro-blue text-white">Metro 藍色背景</div>
<p class="text-text-secondary">次要文字</p>
```

### 自訂元件類別

在 `index.css` 中使用 `@layer components`：

```css
@layer components {
  .metro-tile {
    @apply p-4 flex flex-col justify-between cursor-pointer 
           transition-all duration-100 hover:scale-[0.98] hover:opacity-90;
  }

  .metro-card {
    @apply bg-white border border-surface-border p-4;
  }

  .metro-btn {
    @apply px-4 py-2 font-semibold transition-colors duration-150;
  }

  .metro-btn-primary {
    @apply bg-metro-blue text-white hover:bg-metro-blue-dark;
  }

  .metro-chip {
    @apply px-2 py-1 text-xs font-semibold;
  }
}
```

---

## 常用類別速查

### 尺寸

| 類別 | 說明 |
|------|------|
| `w-full` | 寬度 100% |
| `w-1/2` | 寬度 50% |
| `h-10` | 高度 2.5rem |
| `min-h-screen` | 最小高度 100vh |
| `max-w-md` | 最大寬度 28rem |

### 邊框

| 類別 | 說明 |
|------|------|
| `border` | 1px 邊框 |
| `border-2` | 2px 邊框 |
| `border-t` | 僅上邊框 |
| `rounded` | 圓角 4px |
| `rounded-lg` | 圓角 8px |
| `rounded-none` | 無圓角 |

### 效果

| 類別 | 說明 |
|------|------|
| `shadow` | 預設陰影 |
| `shadow-lg` | 大陰影 |
| `opacity-50` | 50% 透明 |
| `transition` | 過渡效果 |
| `hover:scale-105` | hover 放大 |

---

## 與 MUI 搭配使用

### 建議原則

1. **佈局使用 Tailwind** - Grid、Flex、間距
2. **元件使用 MUI** - Dialog、Table、Button
3. **避免衝突** - 設定 `preflight: false`

### 範例

```tsx
import { Button, Dialog } from '@mui/material';

function Example() {
  return (
    // Tailwind 佈局
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-white border border-gray-200 p-4">
        {/* MUI 元件 */}
        <Button variant="contained">MUI Button</Button>
      </div>
    </div>
  );
}
```

---

## Tailwind v4 注意事項

若使用 **Tailwind v4**，配置方式不同：

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-metro-blue: #0078D4;
  --color-metro-green: #107C10;
}
```

建議使用 **Tailwind v3** 以獲得更好的文件支援和穩定性。

---

## 學習資源

- [Tailwind CSS 官方文件](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind Play (線上測試)](https://play.tailwindcss.com/)
