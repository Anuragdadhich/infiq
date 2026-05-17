import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface StoredLead {
  id: string;
  fullName: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  additionalNotes?: string;
  pdfUrl: string;
  auditData?: unknown;
  createdAt: string;
  emailSentAt?: string | null;
}

const dataDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'infiq-data')
  : path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'leads.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]', 'utf8');
  }
}

export function readLeads(): StoredLead[] {
  ensureStore();

  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw) as StoredLead[];
  } catch (error) {
    console.error('Error reading leads store:', error);
    return [];
  }
}

export function writeLeads(leads: StoredLead[]) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(leads, null, 2), 'utf8');
}

export function addLead(lead: StoredLead) {
  const leads = readLeads();
  leads.push(lead);
  writeLeads(leads);
  return lead;
}

export function findLeadById(id: string) {
  return readLeads().find((lead) => lead.id === id);
}
