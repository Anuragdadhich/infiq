import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface CompanyData {
  name: string;
  description: string;
  websiteTitle: string;
  metaDescription: string;
  headings: string[];
  services: string[];
  technologies: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  performance: {
    lighthouse?: number;
    mobileFriendly?: boolean;
  };
}

async function scrapeWebsite(url: string): Promise<CompanyData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract metadata
    const websiteTitle = $('title').text() || $('h1').first().text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // Extract headings
    const headings: string[] = [];
    $('h2, h3').each((i, el) => {
      const text = $(el).text().trim();
      if (text && i < 5) headings.push(text);
    });

    // Extract services/features
    const services: string[] = [];
    $('.service, .feature, [class*="service"], [class*="feature"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text && i < 5) services.push(text);
    });

    // Extract technologies
    const technologies: string[] = [];
    const pageContent = response.data.toLowerCase();
    const techStack = [
      'React', 'Vue', 'Angular', 'Next.js', 'Svelte',
      'Node.js', 'Python', 'Java', 'C#', 'Go',
      'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker',
    ];
    techStack.forEach((tech) => {
      if (pageContent.includes(tech.toLowerCase())) {
        technologies.push(tech);
      }
    });

    // Extract social links
    const socialLinks = {
      linkedin: $('a[href*="linkedin"]').attr('href'),
      twitter: $('a[href*="twitter"]').attr('href'),
      facebook: $('a[href*="facebook"]').attr('href'),
    };

    return {
      name: websiteTitle,
      description: metaDescription,
      websiteTitle,
      metaDescription,
      headings,
      services,
      technologies,
      socialLinks,
      performance: {
        mobileFriendly: true, // Would need actual Google PageSpeed API
      },
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { website, company } = body;

    if (!website) {
      return NextResponse.json(
        { success: false, error: 'Website URL is required' },
        { status: 400 }
      );
    }

    // Ensure URL has protocol
    const url = website.startsWith('http') ? website : `https://${website}`;

    const companyData = await scrapeWebsite(url);

    return NextResponse.json({
      success: true,
      data: {
        ...companyData,
        name: company || companyData.name,
      },
    });
  } catch (error) {
    console.error('Error researching company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to research company',
        data: {
          name: 'Company',
          description: 'Unable to fetch website data',
          websiteTitle: 'Company Website',
          metaDescription: 'Company information',
          headings: [],
          services: [],
          technologies: [],
          socialLinks: {},
          performance: {},
        },
      },
      { status: 200 } // Return 200 with fallback data
    );
  }
}
