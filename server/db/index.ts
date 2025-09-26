import dotenv from "dotenv";
import {Pool} from "pg";

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5431"),
    database: process.env.DB_NAME
})