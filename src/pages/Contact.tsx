import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { apiService } from '../services/api';
import { Mail, Send, CheckCircle2, AlertCircle, Phone, MapPin, MessageSquare, Clock, User, FileText } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await apiService.sendContactMessage(formData);
      setSuccessMessage(response.message || 'Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to send message. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <Mail className="w-3.5 h-3.5" /> Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 tracking-tight">
          Contact FoodSafe Team
        </h1>
        <p className="text-sm text-slate-600 dark:text-emerald-100/70 leading-relaxed">
          Have feedback on our food adulteration tests, suggestions for new safety protocols, or academic inquiries? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card className="p-6 space-y-5 border-emerald-900/15 dark:border-emerald-500/20">
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Academic Support
            </h2>
            <p className="text-xs text-slate-600 dark:text-emerald-100/70 leading-relaxed">
              FoodSafe is an educational initiative developed for public food safety awareness and adulteration detection standards.
            </p>

            <div className="space-y-4 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-slate-700 dark:text-emerald-100/80">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-emerald-50 text-xs">Email Us</span>
                  <a href="mailto:support@foodsafe.edu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    support@foodsafe.edu
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700 dark:text-emerald-100/80">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-emerald-50 text-xs">Helpline</span>
                  <span>+1 (800) 555-FOODSAFE</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700 dark:text-emerald-100/80">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-emerald-50 text-xs">Department</span>
                  <span>Department of Food Science & Technology, College Campus</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700 dark:text-emerald-100/80">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-emerald-50 text-xs">Hours</span>
                  <span>Mon – Fri: 9:00 AM – 5:00 PM EST</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20">
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Message Sent!</h4>
                  <p className="text-xs mt-0.5 text-slate-600 dark:text-emerald-200/70">{successMessage}</p>
                </div>
              </div>
            )}

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Failed to Send</h4>
                  <p className="text-xs mt-0.5 text-slate-600 dark:text-rose-200/70">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                    Your Full Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                        errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      } text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                    Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                        errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      } text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Subject <span className="text-emerald-600 dark:text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Query regarding Milk Purity Test Protocols"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                      errors.subject ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                    } text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                    required
                  />
                </div>
                {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Your Message <span className="text-emerald-600 dark:text-emerald-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry, feedback, or test report details..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  } bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-emerald-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors`}
                  required
                />
                {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  icon={isLoading ? undefined : <Send className="w-4 h-4" />}
                >
                  {isLoading ? 'Sending Message...' : 'Submit Inquiry'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
