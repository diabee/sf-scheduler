# SF Scheduler

現代化的排程管理應用程式 (Monorepo 架構)。

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
│   │   ├── components/          # 共用元件 (MainLayout, ThemeProvider)
│   │   ├── configs/             # 配置檔 (constants, env)
│   │   ├── hooks/               # 自訂 Hooks (useApi, useScheduler)
│   │   ├── locales/             # 翻譯檔案 (en.ts, zh-TW.ts)
│   │   ├── pages/               # 頁面元件 (Dashboard, ScheduleManagement...)
│   │   ├── services/            # 服務層 (api.ts, scheduleService.ts)
│   │   ├── types/               # TypeScript 型別定義
│   │   ├── utils/               # 工具函式 (date formatting, error handling)
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

### 資料流

```
使用者操作
    │
    ▼
┌─────────────────┐
│   Page/Component │  ◄── 呈現 UI，觸發事件
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Custom Hooks   │  ◄── useApi, useApiMutation 封裝資料載入邏輯
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ApiService     │  ◄── 統一 HTTP 請求、Token 管理、錯誤處理
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API    │  ◄── RESTful API
└─────────────────┘
```

### 目錄職責

| 目錄          | 職責                     | 範例                               |
| ------------- | ------------------------ | ---------------------------------- |
| `app/`        | 應用程式進入點、路由配置 | `App.tsx`, `main.tsx`              |
| `components/` | 可重用的 UI 元件         | `MainLayout`, `LanguageSwitcher` |
| `configs/`    | 應用程式配置、常數       | `constants.ts`, `env.ts`           |
| `hooks/`      | 自訂 React Hooks         | `useApi.ts`, `usePermissions.ts`   |
| `locales/`    | 多語系翻譯檔             | `en.json`, `zh-TW.json`            |
| `pages/`      | 頁面級元件               | `Dashboard`, `UserManagement`      |
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
- 後端 Scheduler Service 運行於 `http://localhost:8080` (開發環境)

### 安裝與執行

```bash
# 安裝依賴 (由根目錄執行)
yarn install

# 啟動前端開發伺服器
yarn dev:frontend

# 啟動所有排程相關服務 (frontend + backend)
yarn dev
```

### 本地開發 (免登入模式)

如果您只需要開發排程功能，不想每次都經由 SSO 登入，可以使用此模式：

1. **後端 (sf-scheduler-service)**:
   使用 `no-auth` profile 啟動：
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev,no-auth
   ```

2. **前端 (sf-scheduler)**:
   使用 `dev:local:frontend` 指令啟動：
   ```bash
   yarn dev:local:frontend
   ```

系統將自動使用 `localadmin` 權限登入，並跳過身份驗證流程。

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

### Tailwind CSS v4 & Metro Theme

本專案採用 **Tailwind CSS v4.1** 搭配自定義的 "Metro" 設計系統。

#### 1. 核心觀念

- **Tailwind v4**: 使用最新的 CSS-native 配置 (`src/index.css` 中的 `@theme` 區塊)，無需 `tailwind.config.js`。
- **混合策略**:
  - **排版**: 使用 Tailwind 的 Flexbox/Grid (`flex`, `grid`, `gap-4`)。
  - **樣式**: 使用 Tailwind 的 Utility classes (`p-4`, `bg-white`, `rounded-lg`)。
  - **MUI 整合**: 對於複雜的互動元件 (如 `TextField`, `Dialog`)，保留 MUI 但盡量移除 `sx` prop，改用 Tailwind class 或外層 wrapper 控制佈局。

#### 2. Metro 主題色票 (Theme)

定義於 `src/index.css` 的 `@theme` 區塊中：

| 類別       | 色票變數                    | Tailwind Class                       | 說明               |
| ---------- | --------------------------- | ------------------------------------ | ------------------ |
| **品牌色** | `--color-metro-blue`        | `text-metro-blue`, `bg-metro-blue`   | 主要行動按鈕、連結 |
|            | `--color-metro-green`       | `text-metro-green`, `bg-metro-green` | 成功狀態、Excel    |
|            | `--color-metro-red`         | `text-metro-red`, `bg-metro-red`     | 錯誤、刪除、警告   |
| **介面**   | `--color-surface`           | `bg-surface`                         | 純白背景           |
|            | `--color-surface-secondary` | `bg-surface-secondary`               | 淺灰背景 (App底色) |
|            | `--color-surface-border`    | `border-surface-border`              | 邊框顏色           |
| **文字**   | `--color-text-primary`      | `text-text-primary`                  | 主要文字           |
|            | `--color-text-secondary`    | `text-text-secondary`                | 次要文字           |

#### 3. 常用自訂元件 (Components)

定義於 `src/index.css` 的 `@layer components`：

- **`.metro-card`**: 基礎卡片樣式 (白色背景 + 邊框 + 圓角)
- **`.metro-tile`**: 可點擊的動態磚 (Hover 效果)
- **`.metro-btn`**: 基礎按鈕樣式
- **`.metro-input`**: 自訂表單輸入框

#### 4. 響應式設計 (RWD)

- **sm**: 640px (手機橫向/大型手機)
- **md**: 768px (平板) -> **主要切換點** (Tablet/Mobile 切換)
- **lg**: 1024px (筆電/桌面)
- **xl**: 1280px (大型螢幕)

**範例：響應式卡片網格**

```tsx
// 手機 1 欄，平板 2 欄，桌面 3 欄
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  <div className="metro-card">...</div>
</div>
```

#### 5. 遷移指南 (MUI sx -> Tailwind)

**Before (MUI sx):**

```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    p: 2,
    mb: 2,
    backgroundColor: "background.paper",
    boxShadow: 1,
  }}
>
  ...
</Box>
```

**After (Tailwind):**

```tsx
<div className="flex justify-between p-4 mb-4 bg-surface shadow-sm">...</div>
```

### Axios - HTTP 請求

本專案透過 `ApiService` 類別封裝 Axios，提供統一的 HTTP 請求介面。

```typescript
// services/api.ts - 封裝示例
import { envConfig } from "~/configs/env";

class ApiService {
  private token: string | null = null;

  // 通用請求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${envConfig.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new AppError(ErrorCode.API_ERROR, "Request failed");
    }

    return response.json();
  }

  // 使用範例
  async getUsers(): Promise<UserDTO[]> {
    return this.request<UserDTO[]>("/api/v2/users");
  }
}

export const apiService = new ApiService();
```

### Zustand - 狀態管理

Zustand 是輕量級狀態管理庫，適合中小型專案。

```typescript
// stores/authStore.ts - 建立 Store
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// 在元件中使用
function UserProfile() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

### MUI (Material-UI) - UI 元件

本專案使用 MUI v6 作為主要 UI 框架。

```tsx
// 基本元件使用
import { Button, TextField, Box, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

function LoginForm() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">登入</Typography>

      <TextField
        label="使用者名稱"
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: <AccountCircle />,
        }}
      />

      <Button variant="contained" color="primary" size="large">
        登入
      </Button>
    </Box>
  );
}

// sx prop 樣式語法
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2, // padding: 16px
    m: 1, // margin: 8px
    bgcolor: "primary.main",
    borderRadius: 2,
    "&:hover": {
      bgcolor: "primary.dark",
    },
  }}
>
  內容
</Box>;
```

### i18next - 國際化

```typescript
// i18n.ts - 配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    fallbackLng: 'zh-TW',
    interpolation: { escapeValue: false },
  });

// 在元件中使用
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('zh-TW')}>中文</button>
    </div>
  );
}
```

### React Router - 路由

```tsx
// App.tsx - 路由配置
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule-management" element={<ScheduleManagement />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// 程式化導航
import { useNavigate } from "react-router-dom";

function NavButton() {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/dashboard")}>前往 Dashboard</button>;
}
```

---

## 串接後端教學

### API 服務層結構

```typescript
// services/api.ts
class ApiService {
  private token: string | null = null;

  // Token 管理
  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  // 登入 API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/v2/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  // CRUD 操作範例
  async getUsers(): Promise<UserDTO[]> {
    return this.request<UserDTO[]>("/api/v2/users");
  }

  async createUser(data: CreateUserRequest): Promise<UserDTO> {
    return this.request<UserDTO>("/api/v2/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<UserDTO> {
    return this.request<UserDTO>(`/api/v2/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/api/v2/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
```

### 自訂 Hooks

#### useApi - 資料載入

```typescript
// hooks/useApi.ts
export function useApi<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean } = { immediate: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      const apiError = handleError(err, 'useApi');
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute, refetch: execute };
}

// 使用範例
function UserList() {
  const { data: users, loading, error, refetch } = useApi(
    () => apiService.getUsers()
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

#### useApiMutation - 資料變更

```typescript
// hooks/useApi.ts
export function useApiMutation<T, P = void>(
  mutator: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (params: P) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutator(params);
      setData(result);
      return { data: result, error: null };
    } catch (err) {
      const apiError = handleError(err, 'useApiMutation');
      setError(apiError);
      return { data: null, error: apiError };
    } finally {
      setLoading(false);
    }
  }, [mutator]);

  return { data, loading, error, execute, reset: () => setData(null) };
}

// 使用範例
function CreateUserForm() {
  const { execute, loading, error } = useApiMutation(
    (data: CreateUserRequest) => apiService.createUser(data)
  );

  const handleSubmit = async (formData: CreateUserRequest) => {
    const { data, error } = await execute(formData);
    if (data) {
      toast.success('使用者建立成功');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表單內容 */}
      <Button type="submit" disabled={loading}>
        {loading ? '建立中...' : '建立使用者'}
      </Button>
      {error && <Alert severity="error">{error.message}</Alert>}
    </form>
  );
}
```

### 錯誤處理

```typescript
// utils/error.ts
export enum ErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown, context: string): ApiError {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message };
  }

  if (error instanceof Error) {
    return { code: ErrorCode.API_ERROR, message: error.message };
  }

  return { code: ErrorCode.API_ERROR, message: "發生未知錯誤" };
}

// 使用方式
try {
  await apiService.login(credentials);
} catch (error) {
  const appError = handleError(error, "Login");
  if (appError.code === ErrorCode.UNAUTHORIZED) {
    // 處理未授權錯誤
  }
}
```

### API 端點清單

| API 端點                | 方法           | 說明               |
| ----------------------- | -------------- | ------------------ |
| `/api/v2/auth/login`    | POST           | 使用者登入         |
| `/api/v2/auth/register` | POST           | 使用者註冊         |
| `/api/v2/users/me`      | GET            | 取得目前使用者資訊 |
| `/api/scheduler/jobs`   | GET/POST       | 排程作業管理       |
| `/api/scheduler/logs`   | GET            | 排程執行日誌       |
| `/api/v2/roles`         | GET/POST       | 角色管理           |
| `/api/v2/resources`     | GET/POST       | 資源管理           |


---

---


## React 教學與上手指南

### 專案上手步驟

1. **環境設置**

   ```bash
   # 確認 Node.js 版本
   node -v  # 需要 18+

   # Clone 專案
   git clone <repository-url>
   cd sf-scheduler

   # 安裝依賴
   yarn install

   # 啟動開發伺服器
   yarn dev:frontend
   ```

2. **了解專案結構**
   - 閱讀本 README
   - 查看 `frontend/src/` 目錄結構
   - 參考現有頁面 (`pages/Dashboard`, `pages/ScheduleManagement`)

3. **開始開發**
   - 修改現有元件觀察變化
   - 嘗試新增簡單功能 (如：排程狀態顯示)

### 新增頁面步驟

1. **建立頁面元件**

   ```typescript
   // src/pages/MyNewPage/index.tsx
   import { Box, Typography } from '@mui/material';
   import { useTranslation } from 'react-i18next';

   export default function MyNewPage() {
     const { t } = useTranslation();

     return (
       <Box sx={{ p: 3 }}>
         <Typography variant="h4">{t('myPage.title')}</Typography>
         {/* 頁面內容 */}
       </Box>
     );
   }
   ```

2. **新增路由**

   ```typescript
   // src/app/App.tsx
   import ScheduleManagement from '~/pages/ScheduleManagement';

   // 在 Routes 內新增
   <Route path="/schedule-management" element={<ScheduleManagement />} />
   ```

3. **新增翻譯**

   ```json
   // src/locales/zh-TW.json
   {
     "myPage": {
       "title": "我的新頁面"
     }
   }
   ```

4. **新增導航 (選擇性)**
   - 透過後端資源管理新增 MENU 項目
   - 或在 `MainLayout` 中手動新增

### 新增元件步驟

```typescript
// src/components/MyComponent/index.tsx
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: FC<MyComponentProps> = ({ title, children }) => {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 1 }}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};

export default MyComponent;
```

### 開發規範

| 項目         | 規範                                                      |
| ------------ | --------------------------------------------------------- |
| **元件命名** | PascalCase (如 `UserCard`, `LoginForm`)                   |
| **檔案命名** | 資料夾 + `index.tsx` (如 `components/UserCard/index.tsx`) |
| **Hooks**    | 以 `use` 開頭 (如 `useApi`, `useAuth`)                    |
| **型別**     | 使用 TypeScript interface/type                            |
| **樣式**     | 使用 MUI `sx` prop 或 Emotion styled                      |
| **國際化**   | 所有使用者可見文字使用 `t()`                              |

### 常用 React Hooks

```typescript
// useState - 狀態管理
const [count, setCount] = useState(0);

// useEffect - 副作用
useEffect(() => {
  fetchData();
  return () => cleanup(); // 清理函式
}, [dependency]);

// useCallback - 快取函式
const handleClick = useCallback(() => {
  doSomething(data);
}, [data]);

// useMemo - 快取計算結果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(input);
}, [input]);

// useRef - 引用 DOM 或保持值
const inputRef = useRef<HTMLInputElement>(null);
```

---

## 國際化

支援語言：

- 繁體中文 (`zh-TW`)
- English (`en`)

### 新增語言

1. 在 `frontend/src/locales/` 新增翻譯檔案
2. 在 `frontend/src/i18n.ts` 中註冊新語言
3. 在 `frontend/src/components/LanguageSwitcher/index.tsx` 中新增選項

---

## 環境變數

### 開發環境

```bash
# frontend/.env.development
VITE_API_URL=http://localhost:8080
```

### 測試環境

```bash
# frontend/.env.staging
VITE_API_URL=https://api-staging.example.com
```

### 正式環境

```bash
# frontend/.env.production
VITE_API_URL=https://api.example.com
```

### 環境變數使用

```typescript
// configs/env.ts
export const envConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
```

---

## Docker 容器化

### 目錄結構

```
frontend/docker/
├── Dockerfile                  # 多階段建置 (Node.js + Nginx)
├── nginx.conf.template         # Nginx 配置模板
├── docker-compose.dev.yml      # 開發環境
├── docker-compose.staging.yml  # 測試環境
├── docker-compose.prod.yml     # 正式環境
└── .env.example                # 環境變數範例
```

### 架構說明

```
┌─────────────────────────────────────────────────────────┐
│  Docker Container (Port 8000)                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Nginx                                            │  │
│  │  - 靜態檔案服務 (/usr/share/nginx/html)           │  │
│  │  - API 反向代理 (/api/ → ${API_URL}/api/)         │  │
│  │  - SPA 路由支援                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 快速部署

```bash
cd frontend

# 開發環境
docker compose -f docker/docker-compose.dev.yml up --build -d

# 測試環境
docker compose -f docker/docker-compose.staging.yml up --build -d

# 正式環境
docker compose -f docker/docker-compose.prod.yml up --build -d

# 自訂 API URL
API_URL=https://your-api.com docker compose -f docker/docker-compose.prod.yml up -d
```

### Docker Build

```bash
cd frontend

# 建置 image
docker build -f docker/Dockerfile -t sf-scheduler-frontend:latest .

# 執行容器
docker run -d \
  --name sf-scheduler-frontend \
  -p 31000:8000 \
  -e API_URL=http://your-api-server:8080 \
  -e NGINX_ENVSUBST_FILTER=API_URL \
  sf-scheduler-frontend:latest
```

### 環境配置

| 環境    | API URL                           | 前端 Port |
| ------- | --------------------------------- | --------- |
| dev     | `http://localhost:8080`           | 3000      |
| staging | `https://api-staging.example.com` | 3000      |
| prod    | `https://api.example.com`         | 3000      |

### 環境變數

| 變數      | 說明          | 預設值                             |
| --------- | ------------- | ---------------------------------- |
| `API_URL` | 後端 API 地址 | `http://host.docker.internal:8080` |
| `PORT`    | 主機端口映射  | `31000`                            |

### 常用指令

```bash
# 查看容器狀態
docker ps

# 查看日誌
docker logs sf-scheduler-frontend

# 進入容器
docker exec -it sf-scheduler-frontend sh

# 檢查 nginx 配置
docker exec -it sf-scheduler-frontend cat /etc/nginx/conf.d/default.conf

# 停止容器
docker compose -f docker/docker-compose.dev.yml down

# 重新建置
docker compose -f docker/docker-compose.dev.yml build --no-cache

# 清理 images
docker image prune -f
```

### 安全特性

- **最小化 Image** (~25MB Alpine-based)
- **非 root 用戶** 執行
- **唯讀檔案系統**
- **安全標頭** (X-Frame-Options, CSP, etc.)
- **資源限制** (CPU/Memory)

### 故障排除

```bash
# API 連線失敗 - 檢查 API_URL 設定
docker exec -it sf-scheduler-frontend cat /etc/nginx/conf.d/default.conf | grep proxy_pass

# 容器無法啟動 - 查看日誌
docker logs sf-scheduler-frontend

# 檢查 nginx 語法
docker exec -it sf-scheduler-frontend nginx -t
```

### CI/CD 整合建議

```yaml
# GitHub Actions 範例
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          cd frontend
          docker build -f docker/Dockerfile -t sf-scheduler-frontend:${{ github.sha }} .

      - name: Push to Registry
        run: |
          docker tag sf-scheduler-frontend:${{ github.sha }} registry.example.com/sf-scheduler-frontend:${{ github.sha }}
          docker push registry.example.com/sf-scheduler-frontend:${{ github.sha }}
```

---

## 權限系統

### 資源類型 (Resource Types)

| 類型           | 說明              | 用途                                    |
| -------------- | ----------------- | --------------------------------------- |
| **MENU**       | 左側選單項目      | 控制使用者可見的導航選單及對應 API 存取 |
| **PORTAL**     | Portal 區塊和項目 | Block 層級和 Item 層級控制              |
| **SF_BUILDER** | SF Builder 資源   | 未來 SF Builder 功能用                  |

### MENU 權限

| 權限代碼             | 說明           | 控制的 API                                     |
| -------------------- | -------------- | ---------------------------------------------- |
| `MENU_DASHBOARD`     | Dashboard 選單 | -                                              |

| `SCHEDULE_MGMT`      | 排程管理選單   | `/api/scheduler/*`                             |
| `MENU_USER_MGMT`     | 使用者管理選單 | `/api/v2/users/*`, `/api/v2/groups/*`          |
| `MENU_ROLE_MGMT`     | 角色管理選單   | `/api/v2/roles/*`                              |
| `MENU_RESOURCE_MGMT` | 資源管理選單   | `/api/v2/permissions/*`, `/api/v2/resources/*` |

### 權限控制流程

1. **角色管理** → 選擇角色 → 勾選對應權限
2. **使用者管理** → 選擇使用者 → 指派角色
3. 系統自動根據使用者權限顯示對應選單

---

## 背景圖片

背景圖片使用本地檔案 `frontend/src/assets/images/background.svg`。

### 更換背景

1. 將圖片放入 `frontend/src/assets/images/`
2. 編輯 `frontend/src/configs/constants.ts`：

```typescript
import defaultBg from "~/assets/images/your-image.jpg";
export const DEFAULT_BACKGROUND = defaultBg;
```

支援格式：jpg, png, webp, svg

---

## 學習資源

### 核心框架

| 技術           | 官方文件                            | 說明                |
| -------------- | ----------------------------------- | ------------------- |
| **React**      | https://react.dev                   | React 18 官方文件   |
| **TypeScript** | https://www.typescriptlang.org/docs | TypeScript 官方手冊 |
| **Vite**       | https://vitejs.dev/guide            | 現代前端建構工具    |

### UI 框架

| 技術                  | 官方文件                                    | 說明                   |
| --------------------- | ------------------------------------------- | ---------------------- |
| **MUI (Material UI)** | https://mui.com/material-ui/getting-started | React UI 組件庫        |
| **Emotion**           | https://emotion.sh/docs/introduction        | CSS-in-JS 樣式解決方案 |

### 狀態與資料管理

| 技術            | 官方文件                                                  | 說明                                |
| --------------- | --------------------------------------------------------- | ----------------------------------- |
| **Zustand**     | https://docs.pmnd.rs/zustand/getting-started/introduction | 輕量級狀態管理                      |
| **React Hooks** | https://react.dev/reference/react/hooks                   | useState, useEffect, useCallback 等 |

### 國際化

| 技術              | 官方文件                  | 說明       |
| ----------------- | ------------------------- | ---------- |
| **i18next**       | https://www.i18next.com   | 國際化框架 |
| **react-i18next** | https://react.i18next.com | React 整合 |

### 開發工具

| 技術          | 官方文件                       | 說明              |
| ------------- | ------------------------------ | ----------------- |
| **ESLint**    | https://eslint.org/docs/latest | 程式碼品質檢查    |
| **Prettier**  | https://prettier.io/docs/en    | 程式碼格式化      |
| **Turborepo** | https://turbo.build/repo/docs  | Monorepo 建構系統 |

### 推薦學習路線

1. **React 基礎** → https://react.dev/learn
2. **TypeScript + React** → https://react-typescript-cheatsheet.netlify.app
3. **MUI 組件** → https://mui.com/material-ui/all-components
4. **自定義 Hooks** → https://react.dev/learn/reusing-logic-with-custom-hooks

### 中文資源

- **React 官方中文** → https://zh-hans.react.dev
- **TypeScript 中文** → https://www.typescriptlang.org/zh/docs
