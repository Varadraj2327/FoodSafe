import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Database, Search, HelpCircle, Bot, LayoutDashboard, Compass, Lock, Layers } from 'lucide-react';

export const ModulesPreview: React.FC = () => {
  const modules = [
    {
      icon: <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Food Adulteration Database',
      description: 'Comprehensive index of food commodities (Milk, Spices, Honey, Ghee, Oils) with common adulterant profiles.',
      phase: 'Phase 2',
      status: 'Ready for Integration',
    },
    {
      icon: <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Search & Category Filter',
      description: 'Instant lookup for specific food items, chemical tests, and symptom-based safety checks.',
      phase: 'Phase 2',
      status: 'Ready for Integration',
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Detection Guide & Protocols',
      description: 'Interactive DART (Detect Adulteration with Rapid Test) step-by-step home experimentation guide.',
      phase: 'Phase 2',
      status: 'Ready for Integration',
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: 'Interactive Awareness Quiz',
      description: 'Engaging quiz module to test consumer awareness and educate on myth vs. scientific facts.',
      phase: 'Phase 3',
      status: 'Planned',
    },
    {
      icon: <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'AI Safety Assistant',
      description: 'Conversational assistant providing instant answers on food symptoms and safety test interpretation.',
      phase: 'Phase 3',
      status: 'Planned',
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Analytics Dashboard',
      description: 'Aggregated analytics on adulteration prevalence, regional alerts, and user awareness metrics.',
      phase: 'Phase 3',
      status: 'Planned',
    },
  ];

  return (
    <section id="modules" className="py-12 md:py-16">
      
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <Badge variant="blue" icon={<Layers className="w-3.5 h-3.5" />}>
          Modular System Architecture
        </Badge>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading">
          System Modules Roadmap
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/70">
          FoodSafe is architected to scale seamlessly. Below are the planned specialized modules that will plug into this foundation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => (
          <Card key={idx} className="relative overflow-hidden group space-y-3 opacity-95 hover:opacity-100">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20">
                {mod.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                {mod.phase}
              </span>
            </div>

            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-100">
              {mod.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-emerald-200/70 leading-relaxed">
              {mod.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
                {mod.status}
              </span>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                Module Slot Reserved
              </span>
            </div>
          </Card>
        ))}
      </div>

    </section>
  );
};
