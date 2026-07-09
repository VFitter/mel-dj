import { compareSync, hashSync } from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE = "mel_admin_session";
const SESSION_TTL = 60 * 60 * 24; // 24 hours

export function verifyPassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}

export function hashPassword(password: string): string {
  return hashSync(password, 10);
}

function generateSessionToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
  return token;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value ?? null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
