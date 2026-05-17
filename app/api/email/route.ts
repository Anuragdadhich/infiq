import { NextRequest, NextResponse } from 'next/server';
import { toAbsoluteUrl } from '@/lib/urls';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@infiq.io';

function getEmailTemplate(name: string, company: string, pdfUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0;
      padding: 0;
    }
    .container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .content {
      background: white;
      border-radius: 12px;
      padding: 40px;
      margin: 20px;
    }
    h1 {
      color: #667eea;
      margin-top: 0;
    }
    .highlight {
      color: #667eea;
      font-weight: 600;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .features {
      text-align: left;
      margin: 20px 0;
    }
    .feature-item {
      margin: 12px 0;
      padding-left: 20px;
      border-left: 3px solid #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>🎉 Your AI Business Audit is Ready!</h1>
      
      <p>Hi <span class="highlight">${name}</span>,</p>
      
      <p>We've completed a comprehensive AI-powered business audit for <span class="highlight">${company}</span>. Your personalized report reveals actionable insights to accelerate growth and optimize your business operations.</p>
      
      <a href="${pdfUrl}" class="cta-button">📥 Download Your Report</a>
      
      <div class="features">
        <div class="feature-item">✨ Personalized business insights</div>
        <div class="feature-item">🔍 Website audit & recommendations</div>
        <div class="feature-item">📈 SEO analysis & opportunities</div>
        <div class="feature-item">🤖 AI automation suggestions</div>
        <div class="feature-item">💡 Growth recommendations</div>
      </div>
      
      <p>The report includes:</p>
      <ul>
        <li>Business Overview</li>
        <li>Website Audit with Strengths & Weaknesses</li>
        <li>SEO Analysis</li>
        <li>AI Opportunities for Your Business</li>
        <li>Growth & Technical Suggestions</li>
      </ul>
      
      <p><strong>Ready to implement these recommendations?</strong> Our team can help you execute these strategies and achieve measurable results.</p>
      
      <div class="footer">
        <p>InfiQ - AI-Powered Lead Automation Platform</p>
        <p>© 2024 InfiQ. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function sendEmailWithResend(
  to: string,
  name: string,
  company: string,
  pdfUrl: string,
  pdfBase64?: string,
  fileName = 'business-audit.pdf'
) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: true, message: 'Email sending skipped - API key not configured' };
  }

  const html = getEmailTemplate(name, company, pdfUrl);
  const attachments = pdfBase64
    ? [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ]
    : undefined;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: `Your AI Business Audit for ${company} - InfiQ`,
      html,
      reply_to: 'support@infiq.io',
      attachments,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, name, company, pdfUrl, pdfBase64, fileName } = body;

    if (!to || !name || !company || !pdfUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const absolutePdfUrl = pdfUrl.startsWith('data:')
      ? pdfUrl
      : toAbsoluteUrl(pdfUrl, request);
    const result = await sendEmailWithResend(to, name, company, absolutePdfUrl, pdfBase64, fileName);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        pdfUrl: absolutePdfUrl,
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 to not fail the workflow
    );
  }
}
