import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface AuditResponse {
  businessOverview: string;
  websiteAudit: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  uxAnalysis: {
    usability: string;
    designQuality: string;
    improvements: string[];
  };
  seoAnalysis: {
    score: number;
    keywords: string[];
    opportunities: string[];
  };
  aiOpportunities: string[];
  growthSuggestions: string[];
  technicalSuggestions: string[];
  personalizedOutreach: string;
}

async function generateAuditWithGemini(
  lead: any,
  research: any
): Promise<AuditResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const normalizedResearch = normalizeResearch(research);
  const prompt = `
You are a senior business consultant and tech auditor. Generate a detailed, personalized business audit for the following company.

COMPANY INFORMATION:
Name: ${lead.company}
Website: ${lead.website}
Industry: ${lead.industry}
Contact: ${lead.fullName}
Additional Context: ${lead.additionalNotes || 'None provided'}

WEBSITE RESEARCH DATA:
- Title: ${normalizedResearch.websiteTitle}
- Meta Description: ${normalizedResearch.metaDescription}
- Main Headings: ${normalizedResearch.headings.join(', ')}
- Services: ${normalizedResearch.services.join(', ')}
- Technologies: ${normalizedResearch.technologies.join(', ')}
- Social Links: ${JSON.stringify(normalizedResearch.socialLinks)}

Please provide a professional, personalized business audit in JSON format with the following structure:
{
  "businessOverview": "A personalized 2-3 sentence overview of the company based on the data",
  "websiteAudit": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "recommendations": ["rec 1", "rec 2", "rec 3"]
  },
  "uxAnalysis": {
    "usability": "Analysis of website usability",
    "designQuality": "Analysis of design quality",
    "improvements": ["improvement 1", "improvement 2"]
  },
  "seoAnalysis": {
    "score": 75,
    "keywords": ["keyword 1", "keyword 2", "keyword 3"],
    "opportunities": ["opportunity 1", "opportunity 2"]
  },
  "aiOpportunities": ["AI use case 1", "AI use case 2", "AI use case 3"],
  "growthSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "technicalSuggestions": ["tech 1", "tech 2", "tech 3"],
  "personalizedOutreach": "A personalized message explaining why they should implement these recommendations"
}

Generate realistic, specific insights based on the ${lead.industry} industry and the company's web presence.
Make it feel genuinely personalized to ${lead.company}, not generic.
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate audit with Gemini');
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateAuditWithOpenAI(
  lead: any,
  research: any
): Promise<AuditResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const normalizedResearch = normalizeResearch(research);
  const prompt = `
You are a senior business consultant and tech auditor. Generate a detailed, personalized business audit for the following company.

COMPANY INFORMATION:
Name: ${lead.company}
Website: ${lead.website}
Industry: ${lead.industry}
Contact: ${lead.fullName}
Additional Context: ${lead.additionalNotes || 'None provided'}

WEBSITE RESEARCH DATA:
- Title: ${normalizedResearch.websiteTitle}
- Meta Description: ${normalizedResearch.metaDescription}
- Main Headings: ${normalizedResearch.headings.join(', ')}
- Services: ${normalizedResearch.services.join(', ')}
- Technologies: ${normalizedResearch.technologies.join(', ')}

Please provide a professional, personalized business audit in valid JSON format with these exact fields:
{
  "businessOverview": "string",
  "websiteAudit": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  },
  "uxAnalysis": {
    "usability": "string",
    "designQuality": "string",
    "improvements": ["string"]
  },
  "seoAnalysis": {
    "score": number,
    "keywords": ["string"],
    "opportunities": ["string"]
  },
  "aiOpportunities": ["string"],
  "growthSuggestions": ["string"],
  "technicalSuggestions": ["string"],
  "personalizedOutreach": "string"
}

Make insights specific to ${lead.company} and the ${lead.industry} industry.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate audit with OpenAI');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}

function normalizeResearch(research: any) {
  const data = research?.data || research || {};

  return {
    websiteTitle: data.websiteTitle || data.name || 'Company Website',
    metaDescription: data.metaDescription || data.description || 'Company information',
    headings: Array.isArray(data.headings) ? data.headings : [],
    services: Array.isArray(data.services) ? data.services : [],
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    socialLinks: data.socialLinks || {},
  };
}

// Fallback audit generator when API keys not available
function generateFallbackAudit(lead: any, research: any): AuditResponse {
  const normalizedResearch = normalizeResearch(research);
  const services = normalizedResearch.services.length > 0
    ? normalizedResearch.services.join(', ')
    : 'their core business';
  const technologies = normalizedResearch.technologies.length > 0
    ? normalizedResearch.technologies.join(', ')
    : 'modern web technologies';

  return {
    businessOverview: `${lead.company} is a ${lead.industry} company with an online presence at ${lead.website}. Based on website analysis, the company offers services related to ${services}. The team has been utilizing technologies including ${technologies}.`,
    websiteAudit: {
      strengths: [
        'Professional online presence established',
        'Clear company information available',
        'Mobile-friendly website design',
      ],
      weaknesses: [
        'Limited SEO optimization detected',
        'Potential conversion funnel gaps',
        'Mobile experience could be enhanced',
      ],
      recommendations: [
        'Implement comprehensive SEO strategy',
        'Optimize for local search in target markets',
        'Improve page load speed and performance',
      ],
    },
    uxAnalysis: {
      usability: 'The website has good navigational structure and clear information architecture, though some improvement in user flow is recommended.',
      designQuality: 'Modern design approach with consistent branding throughout. Consider implementing more interactive elements to increase engagement.',
      improvements: [
        'Add interactive elements and micro-interactions',
        'Implement better call-to-action visibility',
      ],
    },
    seoAnalysis: {
      score: 68,
      keywords: [
        lead.company,
        lead.industry,
        `${lead.industry} solutions`,
        'business services',
        'professional services',
      ],
      opportunities: [
        'Expand keyword targeting for niche markets',
        'Create content targeting customer pain points',
        'Build authoritative backlinks',
      ],
    },
    aiOpportunities: [
      'AI-powered customer service chatbots',
      'Predictive analytics for customer behavior',
      'Personalized content recommendations',
    ],
    growthSuggestions: [
      'Develop content marketing strategy',
      'Implement marketing automation',
      'Expand to new customer segments',
    ],
    technicalSuggestions: [
      'Migrate to modern web framework if needed',
      'Implement Progressive Web App features',
      'Set up advanced analytics tracking',
    ],
    personalizedOutreach: `${lead.fullName}, based on our comprehensive analysis of ${lead.company}, we've identified significant growth opportunities. The most impactful recommendations are to strengthen your SEO presence, implement AI-powered customer engagement tools, and optimize your conversion funnel. These changes could increase your customer acquisition by 30-40% within 6 months.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, research } = body;

    let audit: AuditResponse;

    // Try to use AI APIs, fall back to generated audit
    try {
      if (GEMINI_API_KEY) {
        audit = await generateAuditWithGemini(lead, research);
      } else if (OPENAI_API_KEY) {
        audit = await generateAuditWithOpenAI(lead, research);
      } else {
        audit = generateFallbackAudit(lead, research);
      }
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error);
      audit = generateFallbackAudit(lead, research);
    }

    return NextResponse.json({
      success: true,
      data: audit,
    });
  } catch (error) {
    console.error('Error generating audit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate audit' },
      { status: 500 }
    );
  }
}
