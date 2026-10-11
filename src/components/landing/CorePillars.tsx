import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ShieldCheck, TestTube2, AlertTriangle, Scale, Eye } from 'lucide-react';

export const CorePillars: React.FC = () => {
  const pillars = [
    {
      icon: <TestTube2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'Household Testing Methods',
      description: 'Step-by-step physical and chemical quick tests using everyday kitchen items to detect common adulterants.',
      tag: 'Scientific Protocol',
      badgeVariant: 'emerald' as const,
    },
    {
      icon: <Eye className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: 'Visual Adulterant Identification',
      description: 'Visual guides and indicators to spot fake dyes, synthetic chalk, urea, and industrial starches.',
      tag: 'Visual Awareness',
      badgeVariant: 'blue' as const,
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: 'Health Risk Index',
      description: 'Understanding toxic risks, heavy metal contamination, organ impact, and acute vs. chronic exposure.',
      tag: 'Health Impact',
      badgeVariant: 'amber' as const,
    },
    {
      icon: <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'Consumer Rights & FSSAI',
      description: 'Empowering citizens with legal knowledge, testing standards (DART), and official complaint filing steps.',
      tag: 'Legal Protection',
      badgeVariant: 'emerald' as const,
    },
  ];

  return (
    <section id="mission" className="py-12 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <Badge variant="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Core Pillars of FoodSafe
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
          Designed for Awareness, Safety &amp; Science
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/70">
          Our system translates complex food chemistry into easy-to-understand household safety guidelines for everyday food items.
        </p>
      </div>

      {/* Grid of Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => (
          <Card key={idx} className="flex flex-col justify-between h-full space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20">
                  {pillar.icon}
                </div>
                <Badge variant={pillar.badgeVariant} size="sm">
                  {pillar.tag}
                </Badge>
              </div>

              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                {pillar.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-emerald-200/70 leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-900/5 dark:border-emerald-500/10 flex items-center justify-between text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <span>Standard 0{idx + 1}</span>
              <span className="hover:underline cursor-pointer">Learn More &rarr;</span>
            </div>
          </Card>
        ))}
      </div>

    </section>
  );
};
