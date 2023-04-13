import dotenv from "dotenv";
dotenv.config();
// Connection
export const PORT = String(process.env.PORT) || "3000";
// Keys
export const OPENAI_KEY = String(process.env.OPENAI_KEY);
