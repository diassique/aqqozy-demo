import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token');
  
  if (!token) return null;
  
  try {
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    );
    return verified.payload as { isAdmin: boolean };
  } catch {
    return null;
  }
}

export async function createAdmin(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  return { id: 1, email, password: hashedPassword };
}

export async function validateAdmin(email: string, password: string) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Admin credentials not configured');
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { id: 1, email: ADMIN_EMAIL };
  }

  return null;
} 