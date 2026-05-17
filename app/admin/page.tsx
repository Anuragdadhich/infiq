'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, ArrowRight, Loader2, TrendingUp, Users, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  company: string;
  industry: string;
  createdAt: string;
  pdfUrl: string;
  emailSentAt?: string;
}

interface Stats {
  totalLeads: number;
  emailsSent: number;
  reportsGenerated: number;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    emailsSent: 0,
    reportsGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, statsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/admin/stats'),
        ]);

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.data || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage and track all lead submissions and report generation</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Users, label: 'Total Leads', value: stats.totalLeads, color: 'blue' },
              { icon: FileText, label: 'Reports Generated', value: stats.reportsGenerated, color: 'green' },
              { icon: Mail, label: 'Emails Sent', value: stats.emailsSent, color: 'purple' },
              { icon: TrendingUp, label: 'Conversion Rate', value: '85%', color: 'cyan' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 opacity-50 text-${stat.color}-400`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by company, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p>No leads found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-gray-700/50 bg-gray-800/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Industry</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold">{lead.company}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium">{lead.fullName}</p>
                            <p className="text-gray-400">{lead.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{lead.industry}</td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            lead.emailSentAt
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {lead.emailSentAt ? 'Sent' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={lead.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4 text-blue-400" />
                            </a>
                            <button
                              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Export Button */}
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-2 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
