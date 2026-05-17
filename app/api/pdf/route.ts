import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import * as fs from 'fs';
import * as path from 'path';

export const runtime = 'nodejs';

type Rgb = [number, number, number];

function generatePDFReport(lead: any, audit: any): Buffer {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const colors = {
    ink: [20, 28, 45] as Rgb,
    muted: [88, 101, 123] as Rgb,
    line: [221, 226, 235] as Rgb,
    navy: [15, 37, 69] as Rgb,
    blue: [37, 99, 235] as Rgb,
    cyan: [6, 182, 212] as Rgb,
    green: [16, 137, 97] as Rgb,
    amber: [180, 83, 9] as Rgb,
    red: [190, 18, 60] as Rgb,
    softBlue: [239, 246, 255] as Rgb,
    softCyan: [236, 254, 255] as Rgb,
    softGray: [248, 250, 252] as Rgb,
    white: [255, 255, 255] as Rgb,
  };

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let pageNumber = 0;
  let y = margin;

  const asText = (value: unknown, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value);
  };

  const asList = (value: unknown, fallback: string[]) => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map((item) => asText(item)).filter(Boolean);
    }
    return fallback;
  };

  const safeAudit = {
    businessOverview: asText(
      audit?.businessOverview,
      `${lead.company} has an active digital presence and a clear opportunity to improve lead capture, search visibility, and operational efficiency. This report summarizes the highest-impact changes for growth, trust, and conversion.`
    ),
    websiteAudit: {
      strengths: asList(audit?.websiteAudit?.strengths, [
        'The business has an established online presence and a clear market identity.',
        'Core company information is available for prospects to evaluate.',
        'The website can support a stronger conversion path with focused improvements.',
      ]),
      weaknesses: asList(audit?.websiteAudit?.weaknesses, [
        'The conversion journey can be more direct and persuasive.',
        'Search visibility appears underdeveloped for high-intent business keywords.',
        'Trust signals, proof points, and service differentiation can be made stronger.',
      ]),
      recommendations: asList(audit?.websiteAudit?.recommendations, [
        'Clarify the primary offer above the fold and add stronger calls to action.',
        'Create dedicated service pages for each major revenue-driving offer.',
        'Add proof elements such as testimonials, outcomes, certifications, and case studies.',
      ]),
    },
    uxAnalysis: {
      usability: asText(
        audit?.uxAnalysis?.usability,
        'The user journey should prioritize fast comprehension, low-friction enquiry, and visible next steps across desktop and mobile.'
      ),
      designQuality: asText(
        audit?.uxAnalysis?.designQuality,
        'A more consistent visual hierarchy, clearer section rhythm, and stronger trust cues would make the brand feel more mature and easier to buy from.'
      ),
      improvements: asList(audit?.uxAnalysis?.improvements, [
        'Simplify navigation around the most important conversion actions.',
        'Use clearer section headings and scannable content blocks.',
        'Improve mobile spacing, form ergonomics, and button visibility.',
      ]),
    },
    seoAnalysis: {
      score: Number(audit?.seoAnalysis?.score || 68),
      keywords: asList(audit?.seoAnalysis?.keywords, [
        asText(lead.company, 'Company'),
        asText(lead.industry, 'Industry'),
        `${asText(lead.industry, 'Business')} solutions`,
        'business automation',
        'growth consulting',
      ]),
      opportunities: asList(audit?.seoAnalysis?.opportunities, [
        'Build pages around high-intent service and location keywords.',
        'Publish educational content that answers buyer questions before sales calls.',
        'Improve metadata, internal linking, schema, and page performance.',
      ]),
    },
    aiOpportunities: asList(audit?.aiOpportunities, [
      'Use an AI assistant to qualify enquiries and route serious prospects to sales.',
      'Automate follow-up emails after form submissions, calls, and proposal requests.',
      'Summarize customer conversations to reveal objections, needs, and buying signals.',
    ]),
    growthSuggestions: asList(audit?.growthSuggestions, [
      'Create a tighter offer ladder from discovery call to paid engagement.',
      'Introduce nurture campaigns for leads that are interested but not ready yet.',
      'Track conversion metrics from traffic source through closed revenue.',
    ]),
    technicalSuggestions: asList(audit?.technicalSuggestions, [
      'Set up analytics events for form starts, form submissions, calls, and downloads.',
      'Improve Core Web Vitals with image optimization, caching, and script discipline.',
      'Add CRM or spreadsheet syncing so every lead is captured reliably.',
    ]),
    personalizedOutreach: asText(
      audit?.personalizedOutreach,
      `${lead.fullName}, ${lead.company} can turn its current digital presence into a stronger growth engine by improving the conversion path, strengthening search visibility, and adding practical AI automation around customer engagement.`
    ),
  };

  const setText = (
    fontSize: number,
    color: Rgb = colors.ink,
    style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal'
  ) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  const addWrappedText = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    color: Rgb = colors.ink,
    style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
    lineHeight = fontSize * 0.52
  ) => {
    setText(fontSize, color, style);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, startY);
    return startY + lines.length * lineHeight;
  };

  const addFooter = () => {
    setText(8, colors.muted);
    pdf.setDrawColor(colors.line[0], colors.line[1], colors.line[2]);
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    pdf.text('InfiQ Business Audit', margin, pageHeight - 8);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  const addPage = (withHeader = true) => {
    if (pageNumber > 0) {
      addFooter();
      pdf.addPage();
    }

    pageNumber += 1;
    y = margin;

    if (withHeader) {
      setText(8, colors.blue, 'bold');
      pdf.text('INFIQ BUSINESS INTELLIGENCE REPORT', margin, y);
      setText(8, colors.muted);
      pdf.text(asText(lead.company, 'Company'), pageWidth - margin, y, { align: 'right' });
      y += 12;
    }
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 22) {
      addPage();
    }
  };

  const addSectionTitle = (title: string, kicker?: string) => {
    ensureSpace(24);
    if (kicker) {
      setText(8, colors.blue, 'bold');
      pdf.text(kicker.toUpperCase(), margin, y);
      y += 5;
    }
    setText(17, colors.navy, 'bold');
    pdf.text(title, margin, y);
    y += 4;
    pdf.setDrawColor(colors.cyan[0], colors.cyan[1], colors.cyan[2]);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, margin + 34, y);
    y += 9;
  };

  const addParagraph = (text: string, options?: { size?: number; color?: Rgb; indent?: number }) => {
    const size = options?.size || 10.2;
    const x = options?.indent ? margin + options.indent : margin;
    const width = contentWidth - (options?.indent || 0);
    const lines = pdf.splitTextToSize(text, width);
    ensureSpace(lines.length * 5.6 + 3);
    y = addWrappedText(text, x, y, width, size, options?.color || colors.ink, 'normal', 5.6);
    y += 3;
  };

  const addList = (items: string[], options?: { color?: Rgb; title?: string }) => {
    if (options?.title) {
      ensureSpace(8);
      setText(10, options.color || colors.navy, 'bold');
      pdf.text(options.title, margin, y);
      y += 6;
    }

    items.forEach((item) => {
      const lines = pdf.splitTextToSize(item, contentWidth - 9);
      ensureSpace(lines.length * 5.2 + 5);
      setText(11, options?.color || colors.blue, 'bold');
      pdf.text('-', margin, y);
      y = addWrappedText(item, margin + 8, y, contentWidth - 8, 9.7, colors.ink, 'normal', 5.2);
      y += 3;
    });
  };

  const addInsightCard = (
    title: string,
    body: string,
    x: number,
    cardY: number,
    width: number,
    height: number,
    accent: Rgb
  ) => {
    pdf.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    pdf.setDrawColor(colors.line[0], colors.line[1], colors.line[2]);
    pdf.roundedRect(x, cardY, width, height, 3, 3, 'FD');
    pdf.setFillColor(accent[0], accent[1], accent[2]);
    pdf.roundedRect(x, cardY, 4, height, 3, 3, 'F');
    setText(10.5, colors.navy, 'bold');
    pdf.text(title, x + 8, cardY + 9);
    addWrappedText(body, x + 8, cardY + 17, width - 13, 8.8, colors.muted, 'normal', 4.7);
  };

  const addScoreCard = (label: string, value: string, note: string, x: number, cardY: number, width: number) => {
    pdf.setFillColor(colors.softGray[0], colors.softGray[1], colors.softGray[2]);
    pdf.setDrawColor(colors.line[0], colors.line[1], colors.line[2]);
    pdf.roundedRect(x, cardY, width, 34, 3, 3, 'FD');
    setText(8, colors.muted, 'bold');
    pdf.text(label.toUpperCase(), x + 6, cardY + 8);
    setText(20, colors.navy, 'bold');
    pdf.text(value, x + 6, cardY + 21);
    setText(7.8, colors.muted);
    pdf.text(note, x + 6, cardY + 29);
  };

  const addRoadmapRow = (phase: string, focus: string, actions: string[]) => {
    const rowHeight = 28 + actions.length * 4.5;
    ensureSpace(rowHeight);
    pdf.setFillColor(colors.softGray[0], colors.softGray[1], colors.softGray[2]);
    pdf.setDrawColor(colors.line[0], colors.line[1], colors.line[2]);
    pdf.roundedRect(margin, y, contentWidth, rowHeight, 2, 2, 'FD');
    setText(11, colors.blue, 'bold');
    pdf.text(phase, margin + 6, y + 9);
    setText(10, colors.navy, 'bold');
    pdf.text(focus, margin + 44, y + 9);
    let rowY = y + 17;
    actions.forEach((action) => {
      setText(8.8, colors.ink);
      pdf.text(`- ${action}`, margin + 44, rowY);
      rowY += 4.7;
    });
    y += rowHeight + 5;
  };

  addPage(false);

  pdf.setFillColor(colors.navy[0], colors.navy[1], colors.navy[2]);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  pdf.setFillColor(colors.blue[0], colors.blue[1], colors.blue[2]);
  pdf.rect(0, 0, pageWidth, 70, 'F');
  pdf.setFillColor(colors.cyan[0], colors.cyan[1], colors.cyan[2]);
  pdf.rect(0, 66, pageWidth, 4, 'F');

  setText(9, colors.white, 'bold');
  pdf.text('INFIQ', margin, 24);
  pdf.text('CONFIDENTIAL BUSINESS AUDIT', pageWidth - margin, 24, { align: 'right' });
  setText(30, colors.white, 'bold');
  pdf.text('Business Growth', margin, 100);
  pdf.text('Audit Report', margin, 113);

  y = 130;
  y = addWrappedText(
    `A practical assessment of ${asText(lead.company, 'your business')} across digital presence, conversion readiness, SEO, automation, and growth execution.`,
    margin,
    y,
    contentWidth - 20,
    13,
    colors.white,
    'normal',
    7
  );

  pdf.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  pdf.roundedRect(margin, 172, contentWidth, 62, 4, 4, 'F');
  setText(8, colors.muted, 'bold');
  pdf.text('PREPARED FOR', margin + 8, 185);
  setText(17, colors.navy, 'bold');
  pdf.text(asText(lead.company, 'Company'), margin + 8, 197);
  setText(10, colors.ink);
  pdf.text(`Contact: ${asText(lead.fullName, 'N/A')}`, margin + 8, 209);
  pdf.text(`Email: ${asText(lead.email, 'N/A')}`, margin + 8, 217);
  pdf.text(`Industry: ${asText(lead.industry, 'N/A')}`, margin + 8, 225);
  setText(9, colors.muted);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 8, 225, { align: 'right' });
  setText(8, [185, 199, 221]);
  pdf.text('This report is designed for strategic review and implementation planning.', margin, pageHeight - 18);

  addPage();
  addSectionTitle('Executive Summary', 'Business context');
  addParagraph(safeAudit.businessOverview, { size: 11 });
  addParagraph(
    `The immediate opportunity for ${asText(lead.company, 'the business')} is to turn more visitors into qualified conversations, make the value proposition easier to understand, and connect marketing activity with reliable follow-up. The recommendations in this report are prioritized for commercial impact, not cosmetic change.`
  );

  const score = Math.max(0, Math.min(100, safeAudit.seoAnalysis.score));
  const cardGap = 5;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  addScoreCard('SEO readiness', `${score}/100`, 'Search visibility', margin, y, cardWidth);
  addScoreCard('Conversion focus', 'High', 'Lead capture priority', margin + cardWidth + cardGap, y, cardWidth);
  addScoreCard('AI potential', 'Strong', 'Automation opportunity', margin + (cardWidth + cardGap) * 2, y, cardWidth);
  y += 44;

  addSectionTitle('Priority Findings', 'What matters most');
  addInsightCard('Clarify the offer', 'Prospects should understand who you help, what result you create, and what to do next within the first few seconds.', margin, y, (contentWidth - 6) / 2, 38, colors.blue);
  addInsightCard('Strengthen proof', 'Use testimonials, outcomes, industry examples, and trust signals to reduce hesitation before enquiry.', margin + (contentWidth + 6) / 2, y, (contentWidth - 6) / 2, 38, colors.green);
  y += 46;
  addInsightCard('Improve discoverability', 'Dedicated service pages and buyer-focused content can capture more high-intent organic traffic over time.', margin, y, (contentWidth - 6) / 2, 38, colors.cyan);
  addInsightCard('Automate follow-up', 'Speed-to-lead and consistent nurture sequences are practical ways to recover missed revenue.', margin + (contentWidth + 6) / 2, y, (contentWidth - 6) / 2, 38, colors.amber);
  y += 48;

  addPage();
  addSectionTitle('Website Audit', 'Digital presence');
  addParagraph('A strong business website should do three jobs well: establish credibility, explain the offer clearly, and create a low-friction path to enquiry. The points below separate what is already working from what should be improved first.');
  addList(safeAudit.websiteAudit.strengths, { title: 'Strengths', color: colors.green });
  addList(safeAudit.websiteAudit.weaknesses, { title: 'Weaknesses', color: colors.red });
  addList(safeAudit.websiteAudit.recommendations, { title: 'Recommended Improvements', color: colors.blue });

  addSectionTitle('User Experience Review', 'Buyer journey');
  addParagraph(safeAudit.uxAnalysis.usability);
  addParagraph(safeAudit.uxAnalysis.designQuality);
  addList(safeAudit.uxAnalysis.improvements, { title: 'UX Actions', color: colors.cyan });

  addPage();
  addSectionTitle('SEO and Demand Capture', 'Organic growth');
  addParagraph(`Current SEO readiness is assessed at ${score}/100. The goal is not only higher rankings, but better capture of buyers who are already searching for services like yours.`);
  pdf.setFillColor(colors.softBlue[0], colors.softBlue[1], colors.softBlue[2]);
  pdf.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  setText(9, colors.muted, 'bold');
  pdf.text('KEYWORD THEMES', margin + 7, y + 9);
  y = addWrappedText(safeAudit.seoAnalysis.keywords.join(', '), margin + 7, y + 19, contentWidth - 14, 10, colors.navy, 'bold', 5.4) + 8;
  addList(safeAudit.seoAnalysis.opportunities, { title: 'SEO Opportunities', color: colors.blue });
  addParagraph('For a serious business presence, each important service should have a focused page with a clear promise, FAQs, proof points, internal links, and a direct conversion action. This creates both search relevance and buyer confidence.');

  addSectionTitle('AI and Automation Opportunities', 'Operational leverage');
  addParagraph('AI should be applied where it improves response speed, consistency, qualification, and insight. The best starting point is usually the lead journey: enquiry capture, qualification, follow-up, and reporting.');
  addList(safeAudit.aiOpportunities, { color: colors.cyan });

  addPage();
  addSectionTitle('Growth Roadmap', 'Implementation plan');
  addParagraph('The roadmap below organizes the recommendations into practical phases. This keeps execution focused and prevents the report from becoming a list of disconnected tasks.');
  addRoadmapRow('Phase 1', 'Conversion foundation', [
    'Rewrite above-the-fold messaging around a clear business outcome.',
    'Add prominent calls to action and reduce form friction.',
    'Place testimonials, client logos, or proof points near decision areas.',
  ]);
  addRoadmapRow('Phase 2', 'Search and content engine', [
    'Create or improve service pages for high-intent keywords.',
    'Publish educational content around buyer objections and decision criteria.',
    'Improve metadata, internal links, schema markup, and page speed.',
  ]);
  addRoadmapRow('Phase 3', 'Automation and measurement', [
    'Connect lead capture to CRM, email, or Google Sheets reliably.',
    'Deploy automated follow-up for new enquiries and dormant leads.',
    'Track form submissions, calls, downloads, and source attribution.',
  ]);

  addSectionTitle('Growth Recommendations', 'Commercial actions');
  addList(safeAudit.growthSuggestions, { color: colors.green });
  addSectionTitle('Technical Recommendations', 'Infrastructure');
  addList(safeAudit.technicalSuggestions, { color: colors.amber });

  addPage();
  addSectionTitle('Personalized Next Step', 'Final note');
  pdf.setFillColor(colors.softCyan[0], colors.softCyan[1], colors.softCyan[2]);
  pdf.setDrawColor(colors.cyan[0], colors.cyan[1], colors.cyan[2]);
  pdf.roundedRect(margin, y, contentWidth, 58, 4, 4, 'FD');
  addWrappedText(safeAudit.personalizedOutreach, margin + 8, y + 13, contentWidth - 16, 11, colors.navy, 'normal', 6.2);
  y += 72;

  addSectionTitle('Recommended Decision', 'Executive close');
  addParagraph(`For ${asText(lead.company, 'the business')}, the highest-value move is to treat the website and follow-up system as one revenue workflow. Improve the message, capture qualified demand, automate response, and measure outcomes every week.`);
  addParagraph('This creates a practical growth loop: better positioning increases trust, better SEO increases qualified traffic, better conversion captures more enquiries, and better automation prevents warm leads from going cold.');
  addFooter();

  return Buffer.from(pdf.output('arraybuffer'));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, audit } = body;

    const pdfBuffer = generatePDFReport(lead, audit);

    const safeCompanyName = String(lead.company || 'company')
      .replace(/[^a-z0-9_-]+/gi, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
    const fileName = `${safeCompanyName || 'company'}_audit_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'reports', fileName);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, pdfBuffer);

    const pdfUrl = `/reports/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        pdfUrl,
        fileId: fileName,
        fileName,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
