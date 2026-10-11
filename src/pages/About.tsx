import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  TestTube2,
  CheckCircle2,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const corePillars = [
    {
      icon: <TestTube2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Scientific DART Testing",
      description: "Empowering consumers with simple, laboratory-backed Detect Adulteration with Rapid Tests (DART) designed for everyday household kitchens."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Public Health Advocacy",
      description: "Raising awareness against harmful adulterants (metanil yellow, lead chromate, formalin, plastic resin) that pose severe health risks."
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Regulatory Alignment",
      description: "Referencing official guidelines published by the Food Safety and Standards Authority of India (FSSAI) and the World Health Organization (WHO)."
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Consumer Empowerment",
      description: "Equipping households, students, and dietary researchers with open knowledge to verify food purity before consumption."
    }
  ];

  const techStack = [
    { name: "Frontend", tech: "React 18, TypeScript, Vite, TailwindCSS" },
    { name: "Backend API", tech: "FastAPI, Python 3.11, Uvicorn, Pydantic v2" },
    { name: "Database", tech: "PostgreSQL 16, SQLAlchemy ORM" },
    { name: "Containerization", tech: "Docker Compose, NGINX Alpine Reverse Proxy" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="emerald" icon={<Award className="w-3.5 h-3.5" />}>
            Academic Capstone Initiative
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
          Empowering Public Health Through Food Safety Awareness
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-200/80 leading-relaxed">
          FoodSafe is a full-stack open academic project designed to educate households, students, and consumers on identifying adulterated food commodities using scientific household protocols.
        </p>
      </div>

      {/* Core Mission Card */}
      <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-800 text-white dark:bg-emerald-600 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-heading">
              Our Academic Vision
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50">
              Bridging Food Chemistry &amp; Consumer Knowledge
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-emerald-100/90 leading-relaxed">
          Food adulteration remains a critical public health challenge worldwide. Unscrupulous commercial practices often introduce toxic industrial dyes, synthetic chemicals, heavy metals, and physical contaminants into everyday commodities like milk, spices, honey, tea, grains, and fruits.
        </p>
        <p className="text-sm text-slate-700 dark:text-emerald-100/90 leading-relaxed">
          The FoodSafe platform provides accessible, interactive tools—including an extensive adulteration database, step-by-step DART test instructions, interactive quizzes, and personal safety tracking—to help families ensure food purity and protect their health.
        </p>
      </Card>

      {/* 4 Pillars Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50">
            Core System Pillars
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built on scientific rigor, public accessibility, and transparent data standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corePillars.map((pillar, idx) => (
            <Card key={idx} className="p-6 space-y-3 border-emerald-900/10 dark:border-emerald-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-100">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Architecture & Tech Stack Card */}
      <Card className="p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-900/10 dark:border-emerald-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-heading">
              Technical Architecture
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50">
              Modern Enterprise Full-Stack
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techStack.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-heading">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{item.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 font-mono">
                {item.tech}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-extrabold font-heading">
            Ready to Test Your Household Commodities?
          </h3>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Browse our comprehensive food commodities database or take the interactive Food Safety Quiz.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            icon={<Layers className="w-4 h-4" />}
            onClick={() => navigate('/foods')}
          >
            Explore Commodities
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/quiz')}
          >
            Take Safety Quiz
          </Button>
        </div>
      </div>

    </div>
  );
};
