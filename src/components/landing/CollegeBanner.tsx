import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { GraduationCap, Code2, Shield, Cpu, Layers, Sparkles } from 'lucide-react';

export const CollegeBanner: React.FC = () => {
  return (
    <section id="academic" className="py-12 md:py-16">
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-8 md:p-12 rounded-3xl border border-emerald-700/30 shadow-xl">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" icon={<GraduationCap className="w-3.5 h-3.5" />}>
                Academic Capstone Showcase
              </Badge>
              <Badge variant="blue" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Design System v1.0
              </Badge>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              FoodSafe Academic Awareness System
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Engineered with modern frontend standards, zero external API dependencies, strict TypeScript typing, clean glassmorphism design tokens, and instant light/dark mode support.
            </p>

            {/* Tech Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> React 19 + TypeScript
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Vite 8 Bundler
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Tailwind CSS v4
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Lucide Icons
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-3">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">
              Public Health Impact
            </h3>
            <p className="text-xs text-slate-300 leading-normal">
              Built to raise community awareness on food safety standards, preventing health hazards before consumption.
            </p>
          </div>

        </div>
      </Card>
    </section>
  );
};
