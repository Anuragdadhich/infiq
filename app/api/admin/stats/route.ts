import { NextRequest, NextResponse } from 'next/server';
import { readLeads } from '@/lib/lead-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const leads = readLeads();
    const stats = {
      totalLeads: leads.length,
      emailsSent: leads.filter((lead) => lead.emailSentAt).length,
      reportsGenerated: leads.filter((lead) => lead.pdfUrl).length,
      conversionRate: leads.length ? 100 : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
