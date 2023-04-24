import express, { Request, Response } from "express";
import session from "express-session";
import crypto from "crypto";
import axios from "axios";

const app = express();
const clientId = "attentialloscacco";

app.use(session({ resave: true, secret: "SECRET", saveUninitialized: true }));

app.get("/", (req: Request, res: Response) => {
  res.send('<a href="/login">Login</a>');
});

// LOGIN
const base64URLEncode = (str: string | Buffer) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer: Buffer) =>
  crypto.createHash("sha256").update(buffer).digest();

export const createVerifier = () => base64URLEncode(crypto.randomBytes(32));

export const createChallenge = (verifier: string | Buffer) =>
  base64URLEncode(sha256(verifier as Buffer));

// CALLBACK
export const getLichessToken = async (
  authCode: string,
  verifier: string,
  url: string
) => {
  const response = await axios.post(
    "https://lichess.org/api/token",
    {
      grant_type: "authorization_code",
      redirect_uri: `${url}/callback`,
      client_id: clientId,
      code: authCode,
      code_verifier: verifier,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

const getLichessUser = async (accessToken: string) => {
  const response = await axios.get("https://lichess.org/api/account", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export default getLichessUser;
