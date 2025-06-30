import { NextResponse } from 'next/server';
import { getUniqueManufacturers } from '@/lib/db';

export async function GET() {
  try {
    const manufacturers = await getUniqueManufacturers();
    return NextResponse.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке производителей' },
      { status: 500 }
    );
  }
} 