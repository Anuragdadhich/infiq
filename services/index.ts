// Service for company research
import axios from 'axios';

export async function researchCompany(website: string, company: string) {
  try {
    const response = await axios.post('/api/research', {
      website,
      company,
    });
    return response.data;
  } catch (error) {
    console.error('Research error:', error);
    throw error;
  }
}

// Service for generating audit
export async function generateAudit(lead: any, research: any) {
  try {
    const response = await axios.post('/api/audit', {
      lead,
      research,
    });
    return response.data;
  } catch (error) {
    console.error('Audit generation error:', error);
    throw error;
  }
}

// Service for generating PDF
export async function generatePDF(lead: any, audit: any) {
  try {
    const response = await axios.post('/api/pdf', {
      lead,
      audit,
    });
    return response.data;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

// Service for sending email
export async function sendEmail(to: string, name: string, company: string, pdfUrl: string) {
  try {
    const response = await axios.post('/api/email', {
      to,
      name,
      company,
      pdfUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

// Service for logging to sheets
export async function logToSheets(lead: any, pdfUrl: string) {
  try {
    const response = await axios.post('/api/sheets', {
      lead,
      pdfUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Sheets logging error:', error);
    throw error;
  }
}

// Service for uploading to drive
export async function uploadToDrive(fileId: string, company: string) {
  try {
    const response = await axios.post('/api/drive', {
      fileId,
      company,
    });
    return response.data;
  } catch (error) {
    console.error('Drive upload error:', error);
    throw error;
  }
}

// Service for creating lead
export async function createLead(lead: any, pdfUrl: string, auditData: any) {
  try {
    const response = await axios.post('/api/leads', {
      lead,
      pdfUrl,
      auditData,
    });
    return response.data;
  } catch (error) {
    console.error('Lead creation error:', error);
    throw error;
  }
}

// Service for fetching leads
export async function fetchLeads() {
  try {
    const response = await axios.get('/api/leads');
    return response.data;
  } catch (error) {
    console.error('Fetch leads error:', error);
    throw error;
  }
}

// Service for fetching lead by ID
export async function fetchLead(id: string) {
  try {
    const response = await axios.get(`/api/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch lead error:', error);
    throw error;
  }
}

// Service for getting admin stats
export async function fetchAdminStats() {
  try {
    const response = await axios.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Fetch stats error:', error);
    throw error;
  }
}
