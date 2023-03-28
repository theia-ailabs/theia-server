import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();
// Connection
export const PORT = String(process.env.PORT);
// Keys
export const OPENAI_KEY = String(process.env.OPENAI_KEY);
