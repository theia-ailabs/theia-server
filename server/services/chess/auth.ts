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

const createVerifier = () => base64URLEncode(crypto.randomBytes(32));

const createChallenge = (verifier: string | Buffer) =>
  base64URLEncode(sha256(verifier as Buffer));

app.get("/login", async (req: Request | any, res: Response) => {
  const url = req.protocol + "://" + req.get("host") + req.baseUrl;
  const verifier = createVerifier();
  const challenge = createChallenge(verifier);
  req.session.codeVerifier = verifier;
  res.redirect(
    "https://lichess.org/oauth?" +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: `${url}/callback`,
        scope: "preference:read",
        code_challenge_method: "S256",
        code_challenge: challenge,
      })
  );
});

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

export const getLichessUser = async (accessToken: string) => {
  const response = await axios.get("https://lichess.org/api/account", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);
  return response.data;
};

app.get("/callback", async (req: Request | any, res: Response) => {
  const url = req.protocol + "://" + req.get("host") + req.baseUrl;
  const verifier = req.session.codeVerifier;
  const lichessToken = await getLichessToken(
    req.query.code as string,
    verifier,
    url
  );

  if (!lichessToken.access_token) {
    res.send("Failed getting token");
    return;
  }

  const lichessUser = await getLichessUser(lichessToken.access_token);
  res.send(`Logged in as ${lichessUser.username}`);
});

// app.listen(port, () => console.log(`Server is running on port ${port}`));

getLichessUser("lip_95FGJRUVzQJL0sUsOSoi");
