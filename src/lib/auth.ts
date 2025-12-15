import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: string = process.env.JWT_SECRET || "super-secret";

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"];

const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign({ ...payload, type: "access" }, JWT_SECRET, options);
};

export const signRefreshToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign({ ...payload, type: "refresh" }, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};

export const requireAuth = (
  req: Request
): { userId?: string; error?: string } => {
  const auth = req.headers.get("authorization") || "";
  const [scheme, token] = auth.split(" ");

  if (scheme !== "Bearer" || !token) {
    return { error: "Header Authorization inválido. Use Bearer {token}." };
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    if (decoded.type !== "access") {
      return { error: "Token inválido. Use um access token." };
    }
    return { userId: decoded.sub as string };
  } catch {
    return { error: "Token inválido ou expirado." };
  }
};

export const refreshAuth = (
  refreshToken: string
): { accessToken?: string; error?: string } => {
  try {
    const decoded = verifyToken(refreshToken) as JwtPayload;
    if (decoded.type !== "refresh") {
      return { error: "Token fornecido não é um refresh token." };
    }
    const newAccessToken = signToken({ sub: decoded.sub });
    return { accessToken: newAccessToken };
  } catch {
    return { error: "Refresh token inválido ou expirado." };
  }
};