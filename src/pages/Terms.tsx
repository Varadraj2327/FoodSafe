import React from 'react';
import { Card } from '../components/common/Card';
import { FileCheck, BookOpen, AlertTriangle, Scale, Shield } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <FileCheck className="w-3.5 h-3.5" /> Platform Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 leading-relaxed">
          Last updated: October 2026. Please review the terms governing the use of the FoodSafe academic platform.
        </p>
      </div>

      <Card className="p-6 sm:p-10 space-y-8 border-emerald-900/15 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-100/80 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>1. Educational Purpose & Scope</h2>
          </div>
          <p>
            FoodSafe is an open academic software submission and educational repository built to disseminate verifiable food safety practices, household adulteration detection protocols (e.g. DART protocols), and consumer health awareness. All content provided on the platform is intended strictly for educational and informational purposes.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2>2. Medical & Laboratory Disclaimer</h2>
          </div>
          <p>
            The home tests and food storage instructions documented on FoodSafe are quick screening tools based on published standards (e.g., FSSAI & WHO public guidelines). They do not replace certified laboratory chemical testing or official regulatory inspections. Users should consult certified food testing laboratories or regulatory authorities (such as FSSAI) for official legal or diagnostic confirmation.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>3. User Account Responsibilities</h2>
          </div>
          <p>
            Users are responsible for maintaining the confidentiality of their account login credentials. Any unauthorized access resulting from compromised user passwords is the sole responsibility of the account holder. Users agree not to engage in malicious activities such as automated abuse, SQL injection, or unauthorized admin access attempts.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>4. Intellectual Property & Citation</h2>
          </div>
          <p>
            The FoodSafe application design, source code, logos, and instructional guides are created for public health education. Academic institutions and students may reference, audit, or fork this software repository for educational purposes with appropriate attribution.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>5. Governing Law & Contact</h2>
          </div>
          <p>
            These terms are governed by standard academic open-source practices. For any legal or institutional queries regarding this software project, please reach out through our <a href="/contact" className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500">Contact Us</a> page.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default Terms;
