import { NextResponse } from 'next/server';
import { getCompanyInfo } from '@/lib/db';

export async function GET() {
  try {
    const companyInfo = await getCompanyInfo();
    
    if (!companyInfo) {
      return NextResponse.json({
        telephone: '',
        whatsapp: '',
        address: '',
        workSchedule: '',
        email: '',
        website: '',
      });
    }

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
} 