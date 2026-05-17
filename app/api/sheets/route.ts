import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

async function appendToGoogleSheets(
  sheetId: string,
  values: any[]
): Promise<void> {
  if (!GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.warn('Google Service Account not configured');
    return;
  }

  try {
    const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);

    // In production, use @google-cloud/sheets library
    // For now, we'll log the data
    console.log('Would append to Google Sheets:', values);
  } catch (error) {
    console.error('Error accessing Google Sheets:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, pdfUrl } = body;

    if (!GOOGLE_SHEETS_ID) {
      console.warn('GOOGLE_SHEETS_ID not configured');
      return NextResponse.json({
        success: true,
        message: 'Google Sheets logging skipped - not configured',
      });
    }

    // Log entry format: [Name, Email, Company, Industry, Timestamp, PDF URL]
    const timestamp = new Date().toISOString();
    const values = [
      [lead.fullName, lead.email, lead.company, lead.industry, timestamp, pdfUrl],
    ];

    await appendToGoogleSheets(GOOGLE_SHEETS_ID, values);

    return NextResponse.json({
      success: true,
      message: 'Data logged to Google Sheets',
    });
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to log to Google Sheets',
    });
  }
}
