import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, Heart, BookOpen, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-emerald-900/30 dark:bg-slate-950 dark:border-emerald-950">
      {/* Top Banner / Accent strip */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-emerald-500 to-teal-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              FoodSafe is an open academic initiative dedicated to empowering households, students, and consumers with scientific knowledge to identify food adulteration and safeguard public health.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                College Capstone Project
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                FSSAI Aware
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/foods" className="hover:text-emerald-300 transition-colors">
                  Food Database
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-emerald-300 transition-colors">
                  Adulteration Search
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>Safety Quiz</span>
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">Interactive</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-300 transition-colors">
                  About FoodSafe
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
              Legal & Standards
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a href="https://www.fssai.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
                  FSSAI Official Guidelines <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.who.int/health-topics/food-safety" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
                  WHO Food Safety <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>FoodSafe Academic System &copy; {new Date().getFullYear()}. Built for educational purposes.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>for Public Health Awareness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
