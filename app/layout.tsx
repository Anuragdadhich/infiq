import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'InfiQ - AI Lead Automation Platform',
  description: 'Transform your prospects with AI-powered personalized business audits and automated lead enrichment',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Syne', sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-dark-900 text-white antialiased">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          {children}
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
