'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [leadData, setLeadData] = useState<any>(null);
  const [downloadError, setDownloadError] = useState('');
  const reportUrl = leadData?.pdfUrl || '';
  const getPdfBase64 = () => {
    if (leadData?.pdfBase64) return leadData.pdfBase64;

    const match = reportUrl.match(/^data:application\/pdf(?:;[^,]*)?;base64,(.+)$/);
    return match?.[1] || '';
  };
  const canDownloadReport = Boolean(getPdfBase64());

  const getReportFileName = () => {
    if (leadData?.fileName) return leadData.fileName;

    const company = String(leadData?.company || 'company')
      .replace(/[^a-z0-9_-]+/gi, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();

    return `${company || 'company'}_audit.pdf`;
  };

  const downloadReport = () => {
    setDownloadError('');

    try {
      const base64 = getPdfBase64();
      if (!base64) {
        setDownloadError('This report is missing download data. Please generate a new audit.');
        return;
      }

      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = getReportFileName();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to download report:', error);
      setDownloadError('Unable to download this report. Please generate a new audit.');
    }
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const savedLead = sessionStorage.getItem(`infiq-lead-${leadId}`);
        if (savedLead) {
          setLeadData(JSON.parse(savedLead));
          return;
        }

        const response = await fetch(`/api/leads/${leadId}`);
        const data = await response.json();
        if (data.success && data.data) {
          setLeadData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch lead:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Audit Complete!</h1>

        <p className="text-xl text-gray-300 mb-8">
          {isLoading
            ? 'Loading your report...'
            : `Your personalized business audit for ${leadData?.company || 'your company'} has been generated${leadData?.emailSentAt ? ' and sent to your email' : ''}.`}
        </p>

        {!isLoading && leadData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 mb-8 text-left"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="font-semibold">{leadData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Company</p>
                <p className="font-semibold">{leadData.company}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-semibold">{leadData.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Industry</p>
                <p className="font-semibold">{leadData.industry}</p>
              </div>
            </div>

            {canDownloadReport && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-gray-300 mb-2">Your PDF report is ready:</p>
                <button
                  type="button"
                  onClick={downloadReport}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                {downloadError && <p className="text-xs text-red-300 mt-2">{downloadError}</p>}
              </div>
            )}
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={downloadReport}
            disabled={!canDownloadReport}
            className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 ${!canDownloadReport ? 'pointer-events-none opacity-50' : ''}`}
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Report
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">What happens next?</p>
          <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-gray-300">{leadData?.emailSentAt ? 'Your report has been sent to your email' : 'Your report is available to download here'}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-gray-300">PDF saved to your Google Drive</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-gray-300">Data logged to analytics sheet</span>
            </li>
          </ul>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Submit Another Company <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
