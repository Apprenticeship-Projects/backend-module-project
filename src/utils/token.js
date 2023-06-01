import jsonwebtoken from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("./keys/private-key.pem");
const publicKey = fs.readFileSync("./keys/public-key.pem");

export function signToken(uid, ses) {
  return jsonwebtoken.sign({ uid, ses }, privateKey, {
    algorithm: "ES256",
    expiresIn: "30d",
  });
}

export function verifyToken(token) {
  if (token == null) {
    return null;
  }
  return jsonwebtoken.verify(token, publicKey, { algorithms: ["ES256"] });
}

export function splitToken(auth) {
  if (!auth) return null;
  const [, token] = auth.split(" ");
  return token;
}
