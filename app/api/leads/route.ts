import { NextRequest, NextResponse } from 'next/server';
import { addLead, readLeads } from '@/lib/lead-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, pdfUrl, pdfBase64, fileName, auditData, emailSent } = body;

    const newLead = {
      id: Math.random().toString(36).substring(7),
      ...lead,
      pdfUrl,
      pdfBase64,
      fileName,
      auditData,
      createdAt: new Date().toISOString(),
      emailSentAt: emailSent ? new Date().toISOString() : null,
    };

    addLead(newLead);

    return NextResponse.json({
      success: true,
      data: newLead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all leads
    const leads = readLeads();

    return NextResponse.json({
      success: true,
      data: leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
