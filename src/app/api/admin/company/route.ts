import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get the first company info record (assuming there's only one)
    const companyInfo = await prisma.companyInfo.findFirst();
    
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

    // Get existing company info
    const existingInfo = await prisma.companyInfo.findFirst();

    let companyInfo;
    if (existingInfo) {
      // Update existing record
      companyInfo = await prisma.companyInfo.update({
        where: { id: existingInfo.id },
        data: {
          telephone: data.telephone,
          whatsapp: data.whatsapp,
          address: data.address,
          workSchedule: data.workSchedule,
          email: data.email || null,
        },
      });
    } else {
      // Create new record
      companyInfo = await prisma.companyInfo.create({
        data: {
          telephone: data.telephone,
          whatsapp: data.whatsapp,
          address: data.address,
          workSchedule: data.workSchedule,
          email: data.email || null,
        },
      });
    }

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { error: 'Failed to update company info' },
      { status: 500 }
    );
  }
} 