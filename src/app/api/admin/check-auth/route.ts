import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/auth';

// Explicitly set to use Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ authenticated: !!session });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
} 