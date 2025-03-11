import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Explicitly set to use Node.js runtime
export const runtime = 'nodejs';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
  return NextResponse.json({ success: true });
} 