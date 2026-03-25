# SF Scheduler (排程管理系統)

現代化的排程管理應用程式 (Monorepo 架構)，負責管理、監控、建立各類自動化排程任務。

---

## 目錄

- [專案結構](#專案結構)
- [前端架構](#前端架構)
- [技術棧](#技術棧)
- [快速開始](#快速開始)
- [套件使用教學](#套件使用教學)
- [串接後端教學](#串接後端教學)
- [React 教學與上手指南](#react-教學與上手指南)
- [國際化](#國際化)
- [環境變數](#環境變數)
- [Docker 容器化](#docker-容器化)
- [權限系統](#權限系統)
- [學習資源](#學習資源)

---

## 專案結構

```
sf-scheduler/
├── frontend/                # 排程管理前端應用程式
│   ├── src/
│   │   ├── app/                 # 應用程式核心 (App.tsx, 路由設定)
│   │   ├── components/          # 共用元件 (MainLayout, SideNav)
│   │   ├── configs/             # 配置檔 (constants, env)
│   │   ├── hooks/               # 自訂 Hooks (useApi, useScheduler)
│   │   ├── locales/             # 翻譯檔案 (en.ts, zh-TW.ts)
│   │   ├── pages/               # 頁面元件 (Dashboard, ScheduleManagement, ScheduleLogs...)
│   │   ├── services/            # 服務層 (api.ts, scheduleService.ts)
│   │   ├── types/               # TypeScript 型別定義
│   │   ├── utils/               # 工具函式 (error handling)
│   │   ├── i18n.ts              # i18n 配置
│   │   └── main.tsx             # 入口點
│   ├── docker/                  # Docker 相關配置
│   ├── .prettierrc.cjs          # Prettier 配置
│   ├── eslint.config.js         # ESLint 配置
│   ├── tsconfig.json            # TypeScript 配置
│   ├── vite.config.ts           # Vite 配置
│   └── package.json
├── backend/                 # 後端排程服務 (預留)
├── packages/                # 共用工具/型別套件 (預留)
├── turbo.json               # Turborepo 配置
└── package.json             # 根目錄 package.json
```

---

## 相關專案 / Related Projects

| 專案 | 類型 | 技術 | 說明 |
| --- | --- | --- | --- |
| `auth` | Backend | Spring Boot | 認證服務 |
| `adminportal` | Frontend | Turborepo + Next.js | 管理入口前端 |
| `store-customer` | Frontend | Vite + React | 門市客戶前端 |
| `store-customer-service` | Backend | Spring Boot | 門市客戶後端服務 |
| `sf-scheduler` | Frontend | Vite + React | 排程管理前端 (本專案) |
| `sf-scheduler-service` | Backend | Spring Boot | 排程管理後端服務 |

---

## 前端架構

### 架構概覽

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              前端應用程式架構                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │    Pages    │───▶│ Components  │───▶│   Hooks     │───▶│  Services   │  │
│  │  (頁面元件)  │    │  (共用元件)   │    │  (自訂Hook) │    │   (API層)   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                  │                  │                  │          │
│         ▼                  ▼                  ▼                  ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Router    │    │    i18n     │    │   Zustand   │    │    Axios    │  │
│  │   (路由)     │    │   (國際化)   │    │  (狀態管理)  │    │  (HTTP請求) │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 目錄職責

| 目錄          | 職責                     | 範例                               |
| ------------- | ------------------------ | ---------------------------------- |
| `app/`        | 應用程式進入點、路由配置 | `App.tsx`, `main.tsx`              |
| `components/` | 可重用的 UI 元件         | `MainLayout`, `LanguageSwitcher` |
| `configs/`    | 應用程式配置、常數       | `constants.ts`, `env.ts`           |
| `hooks/`      | 自訂 React Hooks         | `useApi.ts`, `usePermissions.ts`   |
| `locales/`    | 多語系翻譯檔             | `en.ts`, `zh-TW.ts`                |
| `pages/`      | 頁面級元件               | `Dashboard`, `ScheduleManagement`      |
| `services/`   | API 服務層、儲存服務     | `api.ts`, `storage.ts`             |
| `types/`      | TypeScript 型別定義      | `index.ts`                         |
| `utils/`      | 工具函式                 | `error.ts`                         |

---

## 技術棧

| 類別         | 技術              | 版本    | 說明           |
| ------------ | ----------------- | ------- | -------------- |
| **框架**     | React             | 18.2.0  | UI 框架        |
| **語言**     | TypeScript        | 5.6.2   | 型別安全       |
| **建構**     | Vite              | 5.4.6   | 快速建構工具   |
| **UI**       | MUI (Material-UI) | 6.4.8   | UI 元件庫      |
| **樣式**     | Emotion           | 11.11.3 | CSS-in-JS      |
| **狀態**     | Zustand           | 5.0.8   | 輕量級狀態管理 |
| **路由**     | React Router      | 7.12.0  | 前端路由       |
| **國際化**   | i18next           | 23.15.1 | 多語系支援     |
| **HTTP**     | Axios             | 1.13.2  | HTTP 客戶端    |
| **Monorepo** | Turborepo         | -       | 專案管理       |

---

## 快速開始

### 前置需求

- Node.js 18+
- Yarn (推薦)
- 後端 Auth Service 運行於 `http://localhost:8080` (開發環境)
- 後端 Scheduler Service 運行於 `http://localhost:8083` (開發環境)

### 安裝與執行

```bash
# 安裝依賴 (由根目錄執行)
yarn install

# 啟動前端開發伺服器
yarn dev:frontend

# 啟動所有相關服務 (frontend + backend)
yarn dev
```

### 本地開發 (免登入模式)

如果您只需要開發排程功能，不想每次都經由 SSO 登入，可以使用此模式：

1. **後端 (sf-scheduler-service)**:
   使用 `no-auth` profile 啟動。

2. **前端 (sf-scheduler)**:
   使用 `dev:local:frontend` 指令啟動：
   ```bash
   yarn dev:local:frontend
   ```

系統將自動使用預設權限登入，並跳過身份驗證流程。

### Frontend 指令 (在 frontend 目錄內)

```bash
cd frontend

# 程式碼檢查
yarn lint

# 修復 lint 錯誤
yarn lint:fix

# 格式化程式碼
yarn format:fix

# 型別檢查
yarn typecheck
```

---

## 權限系統

本專案與 `auth` 服務整合，實作 RBAC 權限控管。主要 ViewState 包含：

- `dashboard` (儀表板)
- `schedule` (排程管理)
- `upcoming_tasks` (即將執行)
- `schedule_logs` (執行日誌)

這些 ViewState 透過 API `getUserPermissions` 回傳的 Resource Code 自動對應。
