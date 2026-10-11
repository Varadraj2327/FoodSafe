import React from 'react';
import { Card } from '../components/common/Card';
import { ShieldCheck, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Data Protection & Trust
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 leading-relaxed">
          Last updated: October 2026. Learn how FoodSafe handles user data, protects user accounts, and maintains privacy standards.
        </p>
      </div>

      <Card className="p-6 sm:p-10 space-y-8 border-emerald-900/15 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-100/80 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>1. Information We Collect</h2>
          </div>
          <p>
            FoodSafe is an open educational platform designed to raise awareness about food safety, adulteration detection methods, and consumer health. When you interact with our platform, we collect limited personal data to provide user authentication and personalized features:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Account Information:</strong> Name, email address, and hashed credentials created during registration.</li>
            <li><strong>Usage & Quiz Data:</strong> Quiz submission history, scores, and saved food favorites for registered accounts.</li>
            <li><strong>Technical Data:</strong> Browser session information, IP logs for security auditing, and standard HTTP requests.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>2. How We Use Your Information</h2>
          </div>
          <p>
            Your information is used strictly to operate and improve the FoodSafe academic application:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Authenticating your session and maintaining secure account permissions.</li>
            <li>Tracking your progress in food safety quizzes and storing your bookmarked food items.</li>
            <li>Responding to user inquiries submitted via our Contact Us portal.</li>
            <li>Aggregating anonymized usage metrics for academic evaluation and system optimization.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>3. Data Protection & Encryption</h2>
          </div>
          <p>
            We take data security seriously. User passwords are encrypted using industry-standard password hashing algorithms (bcrypt/argon2) before storage in PostgreSQL databases. We never store plaintext passwords, nor do we sell, rent, or trade personal information to third parties.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>4. User Rights & Account Management</h2>
          </div>
          <p>
            As a user of FoodSafe, you retain full ownership of your personal profile data. You have the right to update your profile information, change your password, view your historical quiz performance, or request account deletion by contacting our academic administration team.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-emerald-50 font-bold font-heading text-base sm:text-lg">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>5. Updates to This Policy</h2>
          </div>
          <p>
            We may periodically update this Privacy Policy to reflect system enhancements or regulatory updates. Any changes will be published directly on this page with an updated revision date.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
