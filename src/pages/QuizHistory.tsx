import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { apiService } from '../services/api';
import type { QuizResult, QuizAnalyticsOverview } from '../types';
import {
  History,
  Award,
  Calendar,
  TrendingUp,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';

export const QuizHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [histData, analData] = await Promise.all([
        apiService.getQuizHistory(),
        apiService.getQuizAnalytics(),
      ]);
      setHistory(histData);
      setAnalytics(analData);
    } catch (err) {
      console.error('Failed to fetch quiz history or analytics:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your food safety quiz performance history..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Quiz History"
        message="Please check your authentication session and network connection."
        onRetry={fetchHistoryData}
      />
    );
  }

  const userSummary = analytics?.performance_summary;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<History className="w-3.5 h-3.5" />}>
            Performance Tracking
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            Quiz History & Analytics
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-4 h-4" />}
          onClick={() => navigate('/quiz')}
        >
          Take Safety Quiz
        </Button>
      </div>

      {/* Analytics Summary Cards Grid */}
      {userSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="p-5 border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Attempts</span>
                <span className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
                  {userSummary.total_quizzes_taken}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Score</span>
                <span className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400">
                  {userSummary.average_score_percentage}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Score</span>
                <span className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
                  {userSummary.highest_score_percentage}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Community Avg</span>
                <span className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-50">
                  {analytics?.average_score || 0}%
                </span>
              </div>
            </div>
          </Card>

        </div>
      )}

      {/* History Attempts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50">
          Previous Attempts ({history.length})
        </h2>

        {history.length === 0 ? (
          <Card className="p-10 text-center space-y-4 border-emerald-900/10 dark:border-emerald-500/15">
            <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-emerald-100">
                No Quiz Attempts Recorded Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Test your knowledge of food safety, adulterant detection, and home testing procedures.
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Play className="w-4 h-4" />}
              onClick={() => navigate('/quiz')}
            >
              Start First Quiz
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((attempt, index) => {
              const formattedDate = new Date(attempt.completed_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isHigh = attempt.percentage >= 80;
              const isMedium = attempt.percentage >= 50 && attempt.percentage < 80;

              return (
                <Card
                  key={attempt.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-emerald-900/10 dark:border-emerald-500/15 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                      #{history.length - index}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 dark:text-emerald-50 font-heading">
                          Score: {attempt.score} / {attempt.total_questions} ({attempt.percentage}%)
                        </span>
                        <Badge
                          variant={isHigh ? 'emerald' : isMedium ? 'amber' : 'rose'}
                          size="sm"
                        >
                          {isHigh ? 'Pass' : isMedium ? 'Moderate' : 'Review Needed'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/quiz')}
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
