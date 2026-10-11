import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { apiService } from '../services/api';
import type { QuizQuestion, QuizResult } from '../types';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  History,
  BookOpen,
  Sparkles,
  Check
} from 'lucide-react';

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Quiz active state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Result state after submission
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    setError(false);
    apiService
      .getQuizQuestions()
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quiz questions:', err);
        setError(true);
        setLoading(false);
      });
  };

  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) return;

    // Build payload
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_option_id: answersMap[q.id] || 0,
    }));

    try {
      setSubmitting(true);
      setSubmitError(null);
      const res = await apiService.submitQuiz(answers);
      setResult(res);
    } catch (err: unknown) {
      console.error('Quiz submission failed:', err);
      setSubmitError('Failed to record your quiz submission. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setCurrentIndex(0);
    setAnswersMap({});
    fetchQuestions();
  };

  if (loading) {
    return <LoadingSpinner message="Preparing Food Safety Awareness Quiz questions..." />;
  }

  if (error || questions.length === 0) {
    return (
      <ErrorMessage
        title="Unable to Load Quiz Questions"
        message={
          questions.length === 0
            ? 'No quiz questions are available at this time. Please check back later.'
            : 'Failed to fetch food safety quiz questions.'
        }
        onRetry={fetchQuestions}
      />
    );
  }

  // ==========================================
  // RENDER RESULTS VIEW IF SUBMITTED
  // ==========================================
  if (result) {
    const isHigh = result.percentage >= 80;
    const isMedium = result.percentage >= 50 && result.percentage < 80;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
        
        {/* Results Banner Header */}
        <Card className="p-8 text-center space-y-6 border-emerald-900/20 dark:border-emerald-500/30 relative overflow-hidden bg-gradient-to-b from-emerald-500/5 to-transparent">
          
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-md">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge
              variant={isHigh ? 'emerald' : isMedium ? 'amber' : 'rose'}
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              {isHigh
                ? 'Food Safety Champion!'
                : isMedium
                ? 'Proficient Consumer'
                : 'Needs Safety Review'}
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-emerald-50">
              Quiz Evaluation Results
            </h1>
            
            <p className="text-sm text-slate-500 dark:text-emerald-200/80 max-w-lg mx-auto">
              You scored <span className="font-bold text-slate-900 dark:text-emerald-100">{result.score}</span> out of{' '}
              <span className="font-bold text-slate-900 dark:text-emerald-100">{result.total_questions}</span> questions correctly.
            </p>
          </div>

          {/* Score Card Display */}
          <div className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-x-6">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400">
                {result.score} / {result.total_questions}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
              <span className="text-2xl font-black font-heading text-slate-900 dark:text-emerald-100">
                {result.percentage}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleRestart}
            >
              Retake Quiz
            </Button>
            <Button
              variant="primary"
              icon={<History className="w-4 h-4" />}
              onClick={() => navigate('/quiz/history')}
            >
              View Quiz History
            </Button>
          </div>
        </Card>

        {/* Detailed Answers Breakdown */}
        {result.details && result.details.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Detailed Question Review & Learnings
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {result.details.length} Questions Evaluated
              </span>
            </div>

            <div className="space-y-4">
              {result.details.map((detail, index) => (
                <Card
                  key={detail.question_id}
                  className={`p-6 space-y-4 border ${
                    detail.is_correct
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-emerald-100 font-bold text-xs shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-emerald-100 leading-snug">
                        {detail.question_text}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      {detail.is_correct ? (
                        <Badge variant="emerald" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                          Correct (+1)
                        </Badge>
                      ) : (
                        <Badge variant="rose" icon={<XCircle className="w-3.5 h-3.5" />}>
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Options Review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className={`p-3 rounded-xl border ${
                      detail.is_correct
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                    }`}>
                      <span className="font-bold block text-[10px] uppercase text-slate-400 mb-0.5">
                        Your Selected Answer:
                      </span>
                      <span className="font-semibold">{detail.user_option_text}</span>
                    </div>

                    {!detail.is_correct && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold block text-[10px] uppercase text-slate-400 mb-0.5">
                          Correct Answer:
                        </span>
                        <span className="font-semibold">{detail.correct_option_text}</span>
                      </div>
                    )}
                  </div>

                  {/* Educational Explanation */}
                  {detail.explanation && (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-emerald-200/90 leading-relaxed">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        💡 Food Safety Tip / Explanation:
                      </span>
                      {detail.explanation}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // RENDER ACTIVE QUIZ INTERFACE
  // ==========================================
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedOptionId = answersMap[currentQuestion.id];
  const answeredCount = Object.keys(answersMap).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      
      {/* Quiz Header & Progress Indicator */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Badge variant="emerald" icon={<HelpCircle className="w-3.5 h-3.5" />}>
              Consumer Food Safety Test
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
              Food Safety Awareness Quiz
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {answeredCount} of {totalQuestions} Answered
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Submission Error Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Active Question Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-emerald-900/15 dark:border-emerald-500/20 shadow-md">
        
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Question #{currentIndex + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-emerald-50 leading-snug">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Options Cards */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => option.id && handleSelectOption(currentQuestion.id, option.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-50 ring-2 ring-emerald-500/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-emerald-100 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-700 group-hover:border-emerald-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm font-medium leading-normal">{option.option_text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation & Submit Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentIndex < totalQuestions - 1 ? (
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={submitting || answeredCount === 0}
                onClick={handleSubmitQuiz}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                {submitting ? 'Evaluating Responses...' : 'Submit Answers'}
              </Button>
            )}
          </div>
        </div>

      </Card>

      {/* Helper Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 text-center">
        Tip: You can navigate between questions before clicking <span className="font-semibold text-slate-700 dark:text-emerald-200">Submit Answers</span>.
      </div>

    </div>
  );
};
