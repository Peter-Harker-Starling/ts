# 學分抵免系統 — 後端

以 Node.js + Express + TypeScript 建構的 RESTful API，資料庫使用 PostgreSQL（Supabase）。

**部署網址**：https://ts-1-zy17.onrender.com
>  Render free 方案可能需要 **20–40 seconds** 冷啟動喚醒 (cold start).

## 專案架構

```
src/
├── index.ts                # 啟動 server
├── app.ts                  # Express 設定、middleware
├── db/
│   └── db.ts               # 資料庫連線
├── types/
│   ├── user.ts
│   └── creditTransfer.ts
├── routes/
│   ├── auth.ts
│   └── creditTransfer.ts
├── controllers/
│   ├── authController.ts
│   └── creditTransferController.ts
├── services/
│   ├── authService.ts
│   └── creditTransferService.ts
└── middlewares/
    ├── auth.ts             # JWT 驗證
    └── staffOnly.ts        # 角色權限控管
```

## 環境變數說明

在根目錄建立 `.env` 檔案：

```env
DATABASE_URL=postgresql://你的連線字串
JWT_SECRET=自訂密鑰
NODE_ENV=development
```

| 變數 | 說明 |
|------|------|
| `DATABASE_URL` | Supabase PostgreSQL 連線字串（Transaction Pooler） |
| `JWT_SECRET` | JWT 簽發密鑰，可自行設定任意字串 |
| `NODE_ENV` | 環境模式，production 時 cookie 會啟用 secure |

## 資料庫結構

```sql
CREATE TYPE role AS ENUM ('STAFF', 'STUDENT');
CREATE TYPE status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE users (
  id serial PRIMARY KEY,
  login_id text NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  user_role role DEFAULT 'STUDENT'
);

CREATE TABLE credit_transfer (
  id serial PRIMARY KEY,
  user_id int NOT NULL,
  semester text NOT NULL,
  course_type text NOT NULL,
  credit_type text NOT NULL,
  credit integer NOT NULL,
  course_name_before text NOT NULL,
  course_name_after text NOT NULL,
  receive_date date,
  completion_date date,
  credit_status status DEFAULT 'PENDING',
  reason text,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 安裝與啟動

```bash
npm install
npm run dev
```

## Docker
 
```bash
# 建立 image
docker build -t credit-transfer .
 
# 啟動容器
docker run -p 3000:3000 --env-file .env credit-transfer
```

## API 文件

| 方法 | 路徑 | 說明 | 權限 |
|------|------|------|------|
| POST | `/auth/register` | 註冊帳號 | 無 |
| POST | `/auth/login` | 登入 | 無 |
| POST | `/auth/logout` | 登出 | 登入後 |
| GET | `/auth/me` | 取得目前登入資訊 | 登入後 |

#### POST `/auth/register`
```json
{
  "loginId": "112214902",
  "password": "yourpassword",
  "name": "王小明",
  "email": "student@example.com",
  "user_role": "STUDENT"
}
```

#### POST `/auth/login`
```json
{
  "loginId": "112214902",
  "password": "yourpassword"
}
```

---

### 學分抵免申請

| 方法 | 路徑 | 說明 | 權限 |
|------|------|------|------|
| POST | `/credit-transfer` | 新增抵免申請 | STUDENT |
| GET | `/credit-transfer/my` | 查看自己的申請 | STUDENT |
| GET | `/credit-transfer/all` | 查看所有申請 | STAFF |
| PATCH | `/credit-transfer/:id` | 審核申請 | STAFF |

#### POST `/credit-transfer`
```json
{
  "semester": "113-2",
  "course_type": "專業必修",
  "credit_type": "跨系修課",
  "credit": 3,
  "course_name_before": "資料結構",
  "course_name_after": "演算法"
}
```

#### PATCH `/credit-transfer/:id`
```json
{
  "credit_status": "APPROVED",
  "reason": "課程內容相符，同意抵免"
}
```

# ts
