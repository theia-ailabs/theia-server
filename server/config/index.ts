import dotenv from "dotenv";
dotenv.config();
// Connection
export const PORT = String(process.env.PORT) || "3000";
// Keys
export const OPENAI_KEY = String(process.env.OPENAI_KEY);
export const VOICE_API = String(process.env.VOICE_API);
export const VOICE_UID = String(process.env.VOICE_UID);
export const VOICE_KEY = String(process.env.VOICE_KEY);
