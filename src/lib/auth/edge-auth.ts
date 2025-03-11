import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Edge-compatible session management functions
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