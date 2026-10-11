import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-[30%] -right-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-[60%] -left-40 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl -z-10" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
