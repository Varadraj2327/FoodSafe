import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { ShieldAlert, Sparkles, Beaker, CheckCircle2, ArrowRight, BookOpen, Microchip } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="overview" className="py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Copy Column */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5" />}>
              College Academic Project
            </Badge>
            <Badge variant="blue" icon={<BookOpen className="w-3.5 h-3.5" />}>
              Public Health Initiative
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] font-heading">
            Pure Food. Clear Science.{' '}
            <span className="block text-gradient-forest">
              Protect Your Health & Family.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-emerald-100/80 leading-relaxed font-normal max-w-2xl">
            FoodSafe is an open awareness platform designed to educate consumers on detecting harmful food adulterants using accessible household test methods and verified safety protocols.
          </p>

          {/* Call to actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={<Beaker className="w-5 h-5" />}
              onClick={() => {
                const el = document.getElementById('modules');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Planned Modules
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                const el = document.getElementById('academic');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Academic Background
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-emerald-900/10 dark:border-emerald-500/10 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-emerald-400/80 uppercase tracking-wider">
                Focus Area
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-emerald-100 font-heading">
                Food Safety
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-emerald-400/80 uppercase tracking-wider">
                Methodology
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-emerald-100 font-heading">
                Rapid Tests
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-emerald-400/80 uppercase tracking-wider">
                Target Audience
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-emerald-100 font-heading">
                Households
              </div>
            </div>
          </div>

        </div>

        {/* Right Design Showcase Visual */}
        <div className="lg:col-span-5 relative">
          
          {/* Decorative Backing Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-teal-500/10 rounded-3xl blur-2xl transform rotate-3" />

          {/* Main Showcase Card */}
          <Card className="relative p-6 sm:p-8 space-y-6 border border-emerald-900/15 dark:border-emerald-500/20">
            
            {/* Header pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-heading uppercase tracking-wider">
                  Design System Preview
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                System Active
              </Badge>
            </div>

            {/* Simulated Glass Metrics */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-800 text-white dark:bg-emerald-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-100 font-heading">
                      Adulteration Risk Factor
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">
                      Detection &amp; Household Screening
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  Verified Protocol
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-900/10 dark:border-emerald-500/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  <span>Awareness Index</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Safe Consumption</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-full w-[85%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Quick Feature Checklist */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Responsive, modern health-tech UI design system</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Seamless Light &amp; Dark theme toggle support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Ready for modular feature integration (Phase 2 &amp; 3)</span>
              </div>
            </div>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 dark:text-emerald-400/60 inline-flex items-center gap-1">
                <Microchip className="w-3.5 h-3.5" /> Built with React, TypeScript &amp; Tailwind CSS
              </span>
            </div>

          </Card>
        </div>

      </div>
    </section>
  );
};
