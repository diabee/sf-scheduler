# Docker 容器化指南

Admin Portal Frontend 容器化部署說明。

## 目錄結構

```
docker/
├── Dockerfile                  # 多階段建置 (Node.js + Nginx)
├── nginx.conf.template         # Nginx 配置模板 (支援環境變數)
├── docker-compose.dev.yml      # 開發環境
├── docker-compose.staging.yml  # 測試環境
├── docker-compose.prod.yml     # 正式環境
├── .env.example                # 環境變數範例
└── README.md
```

## 架構說明

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

## 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `API_URL` | 後端 API 地址 | `http://host.docker.internal:8080` |
| `PORT` | 主機端口映射 | `31000` |

---

## 快速開始

### 1. Docker Build

```bash
cd frontend

# 建置 image
docker build -f docker/Dockerfile -t adminportal-frontend:latest .

# 建置指定版本
docker build -f docker/Dockerfile -t adminportal-frontend:v1.0.0 .

# 不使用快取
docker build -f docker/Dockerfile --no-cache -t adminportal-frontend:latest .
```

### 2. Docker Run

```bash
# 執行容器
docker run -d \
  --name adminportal-frontend \
  -p 31000:8000 \
  -e API_URL=http://your-api-server:8080 \
  -e NGINX_ENVSUBST_FILTER=API_URL \
  adminportal-frontend:latest
```

### 3. Docker Compose

```bash
cd frontend

# 開發環境
docker compose -f docker/docker-compose.dev.yml up --build -d

# 自訂 API URL
API_URL=http://10.91.46.84:8080 docker compose -f docker/docker-compose.dev.yml up --build -d

# 測試環境
API_URL=https://api-staging.example.com docker compose -f docker/docker-compose.staging.yml up --build -d

# 正式環境
API_URL=https://api.example.com docker compose -f docker/docker-compose.prod.yml up --build -d
```

---

## 常用指令

```bash
# 查看容器狀態
docker ps

# 查看日誌
docker logs adminportal-frontend-dev

# 進入容器
docker exec -it adminportal-frontend-dev sh

# 檢查 nginx 配置
docker exec -it adminportal-frontend-dev cat /etc/nginx/conf.d/default.conf

# 停止容器
docker compose -f docker/docker-compose.dev.yml down

# 重新建置
docker compose -f docker/docker-compose.dev.yml build --no-cache

# 清理 images
docker image prune -f
```

---

## 故障排除

### API 連線失敗

```bash
# 檢查 API_URL 設定
docker exec -it adminportal-frontend-dev cat /etc/nginx/conf.d/default.conf | grep proxy_pass
```

### 容器無法啟動

```bash
# 查看日誌
docker logs adminportal-frontend-dev

# 檢查 nginx 語法
docker exec -it adminportal-frontend-dev nginx -t
```
