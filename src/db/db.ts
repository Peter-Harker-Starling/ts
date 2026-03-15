import postgres from 'postgres';
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(connectionString, {
    ssl: "require", // 強制使用 SSL 加密連線
    prepare: false // 禁用預處理語句，直接執行 SQL 查詢
});

export default sql;