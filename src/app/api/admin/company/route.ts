import { NextResponse } from 'next/server';
import { getCompanyInfo, updateCompanyInfo } from '@/lib/db';

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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.telephone || !data.whatsapp || !data.address || !data.workSchedule) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await updateCompanyInfo({
      telephone: data.telephone,
      whatsapp: data.whatsapp,
      address: data.address,
      workSchedule: data.workSchedule,
      email: data.email || null,
      website: data.website || null,
    });

    const updatedInfo = await getCompanyInfo();
    return NextResponse.json(updatedInfo);
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { error: 'Failed to update company info' },
      { status: 500 }
    );
  }
} 