'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name is required'),
  website: z.string().url('Invalid website URL'),
  industry: z.string().min(1, 'Please select an industry'),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

interface WorkflowStep {
  step: string;
  status: 'pending' | 'progress' | 'complete' | 'error';
  message: string;
}

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Real Estate',
  'Manufacturing',
  'Education',
  'E-Commerce',
  'SaaS',
  'Other',
];

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const updateWorkflow = (step: string, status: 'pending' | 'progress' | 'complete' | 'error', message: string) => {
    setWorkflow((prev) => {
      const existing = prev.find((s) => s.step === step);
      if (existing) {
        return prev.map((s) => (s.step === step ? { step, status, message } : s));
      }
      return [...prev, { step, status, message }];
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setShowWorkflow(true);
    setWorkflow([]);

    try {
      // Validation
      updateWorkflow('Validation', 'progress', 'Validating your information...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateWorkflow('Validation', 'complete', 'Data validated successfully');

      // Company Research
      updateWorkflow('Research', 'progress', 'Researching your company...');
      const researchResponse = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: data.website, company: data.company }),
      });

      if (!researchResponse.ok) throw new Error('Research failed');
      const researchData = await researchResponse.json();
      updateWorkflow('Research', 'complete', 'Company research complete');

      // Generate Audit
      updateWorkflow('Audit Generation', 'progress', 'Generating AI audit...');
      const auditResponse = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: data,
          research: researchData.data,
        }),
      });

      if (!auditResponse.ok) throw new Error('Audit generation failed');
      const auditData = await auditResponse.json();
      updateWorkflow('Audit Generation', 'complete', 'AI audit created');

      // Generate PDF
      updateWorkflow('PDF Generation', 'progress', 'Creating PDF report...');
      const pdfResponse = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: data,
          audit: auditData.data,
        }),
      });

      if (!pdfResponse.ok) throw new Error('PDF generation failed');
      const pdfData = await pdfResponse.json();
      updateWorkflow('PDF Generation', 'complete', 'PDF created');

      // Send Email
      updateWorkflow('Email Sending', 'progress', 'Sending email...');
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          name: data.fullName,
          company: data.company,
          pdfUrl: pdfData.data.pdfUrl,
          pdfBase64: pdfData.data.pdfBase64,
          fileName: pdfData.data.fileName,
        }),
      });

      if (!emailResponse.ok) throw new Error('Email sending failed');
      const emailData = await emailResponse.json();
      const emailSent = Boolean(emailData.success);
      updateWorkflow(
        'Email Sending',
        emailSent ? 'complete' : 'error',
        emailSent ? 'Email sent' : emailData.message || 'Email could not be sent'
      );

      // Log to Google Sheets
      updateWorkflow('Sheets Logging', 'progress', 'Logging to Google Sheets...');
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: data,
          pdfUrl: pdfData.data.pdfUrl,
        }),
      });
      updateWorkflow('Sheets Logging', 'complete', 'Data logged');

      // Upload to Google Drive
      updateWorkflow('Drive Upload', 'progress', 'Uploading to Google Drive...');
      await fetch('/api/drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: pdfData.data.fileId,
          company: data.company,
        }),
      });
      updateWorkflow('Drive Upload', 'complete', 'Uploaded to Google Drive');

      // Save to database
      updateWorkflow('Database Save', 'progress', 'Finalizing...');
      const dbResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: data,
          pdfUrl: pdfData.data.pdfUrl,
          auditData,
          emailSent,
        }),
      });

      if (!dbResponse.ok) throw new Error('Database save failed');
      const leadData = await dbResponse.json();
      updateWorkflow('Database Save', 'complete', 'Complete!');

      toast.success('Lead submitted successfully!');
      
      // Redirect to success page
      setTimeout(() => {
        router.push(`/success/${leadData.data.id}`);
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      updateWorkflow('Error', 'error', message);
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Get Your AI Audit</h1>
          <p className="text-gray-400 mb-8">Submit your company information and receive a personalized business audit instantly.</p>

          {showWorkflow && workflow.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-6 rounded-xl bg-gray-800/50 border border-gray-700/50"
            >
              <h3 className="font-semibold mb-4">Processing Your Audit...</h3>
              <div className="space-y-3">
                {workflow.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.status === 'complete' && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {item.status === 'progress' && (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      )}
                      {item.status === 'pending' && (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                      )}
                      {item.status === 'error' && (
                        <div className="w-5 h-5 rounded-full bg-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.step}</p>
                      <p className="text-xs text-gray-400">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="John Doe"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all"
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Work Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="john@company.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                {...register('company')}
                type="text"
                placeholder="Acme Corporation"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all"
              />
              {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <input
                {...register('website')}
                type="url"
                placeholder="https://example.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all"
              />
              {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                {...register('industry')}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all"
              >
                <option value="">Select an industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              {errors.industry && <p className="text-red-400 text-sm mt-1">{errors.industry.message}</p>}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
              <textarea
                {...register('additionalNotes')}
                placeholder="Tell us more about your business..."
                disabled={isSubmitting}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Processing...' : 'Generate My Audit'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
