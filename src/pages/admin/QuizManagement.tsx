import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiService } from '../../services/api';
import type { QuizQuestion, QuizQuestionCreate } from '../../types';
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Radio,
  BookOpen
} from 'lucide-react';

interface OptionDraft {
  option_text: string;
  is_correct: boolean;
}

export const QuizManagement: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [explanationText, setExplanationText] = useState('');
  const [optionsDraft, setOptionsDraft] = useState<OptionDraft[]>([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminQuestions();
  }, []);

  const fetchAdminQuestions = () => {
    setLoading(true);
    setError(false);
    apiService
      .getAdminQuizQuestions()
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin quiz questions:', err);
        setError(true);
        setLoading(false);
      });
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setExplanationText('');
    setOptionsDraft([
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setQuestionText(q.question_text);
    setExplanationText(q.explanation || '');
    setOptionsDraft(
      q.options.map((opt) => ({
        option_text: opt.option_text,
        is_correct: !!opt.is_correct,
      }))
    );
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOptionTextChange = (index: number, text: string) => {
    setOptionsDraft((prev) => {
      const updated = [...prev];
      updated[index].option_text = text;
      return updated;
    });
  };

  const handleSetCorrectOption = (selectedIndex: number) => {
    setOptionsDraft((prev) =>
      prev.map((opt, idx) => ({
        ...opt,
        is_correct: idx === selectedIndex,
      }))
    );
  };

  const handleAddOptionRow = () => {
    setOptionsDraft((prev) => [...prev, { option_text: '', is_correct: false }]);
  };

  const handleRemoveOptionRow = (index: number) => {
    if (optionsDraft.length <= 2) {
      setFormError('A question must have at least 2 options.');
      return;
    }
    setOptionsDraft((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      // Ensure at least one option remains correct if deleted option was correct
      if (!updated.some((opt) => opt.is_correct) && updated.length > 0) {
        updated[0].is_correct = true;
      }
      return updated;
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setFormError('Question text is required.');
      return;
    }

    const filledOptions = optionsDraft.filter((opt) => opt.option_text.trim().length > 0);
    if (filledOptions.length < 2) {
      setFormError('Please provide at least 2 non-empty options.');
      return;
    }

    if (!filledOptions.some((opt) => opt.is_correct)) {
      setFormError('Please select one option as the correct answer.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const payload: QuizQuestionCreate = {
        question_text: questionText.trim(),
        explanation: explanationText.trim() || undefined,
        options: filledOptions.map((opt) => ({
          option_text: opt.option_text.trim(),
          is_correct: opt.is_correct,
        })),
      };

      if (editingQuestion) {
        await apiService.updateQuizQuestion(editingQuestion.id, payload);
      } else {
        await apiService.createQuizQuestion(payload);
      }

      setIsModalOpen(false);
      fetchAdminQuestions();
    } catch (err: unknown) {
      console.error('Failed to save quiz question:', err);
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError('An error occurred while saving the question.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteQuizQuestion(id);
      setDeleteConfirmId(null);
      fetchAdminQuestions();
    } catch (err) {
      console.error('Failed to delete question:', err);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Quiz Questions Repository..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Quiz Questions"
        message="Ensure administrator credentials and API services are active."
        onRetry={fetchAdminQuestions}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<HelpCircle className="w-3.5 h-3.5" />}>
            Admin Control Panel
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            Quiz & Awareness Management
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Add New Question
        </Button>
      </div>

      {/* Questions Table List */}
      <Card className="overflow-hidden border-emerald-900/10 dark:border-emerald-500/15">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-emerald-50 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Active Questions Repository ({questions.length})
          </h2>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500">No quiz questions created yet.</p>
            <Button variant="outline" size="sm" onClick={openCreateModal}>
              Create First Question
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map((q, index) => {
              const correctOpt = q.options.find((opt) => opt.is_correct);

              return (
                <div
                  key={q.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-950/40 transition-colors"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-emerald-100 leading-snug">
                        {q.question_text}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs pl-9">
                      <span className="text-slate-500 font-semibold">
                        {q.options.length} Choice Options
                      </span>
                      {correctOpt && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Answer Key: {correctOpt.option_text}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit3 className="w-3.5 h-3.5" />}
                      onClick={() => openEditModal(q)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                      onClick={() => setDeleteConfirmId(q.id)}
                      className="hover:bg-rose-500/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl p-6 space-y-6 relative border-emerald-900/20 dark:border-emerald-500/30 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                  {editingQuestion ? 'Edit Quiz Question' : 'Create New Quiz Question'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5">
              
              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Question Prompt *
                </label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. How can consumers detect starch adulteration in cattle milk at home?"
                  className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              {/* Educational Explanation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Educational Explanation (Shown after completion)
                </label>
                <textarea
                  rows={2}
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="e.g. Iodine solution turns blue when reacting with starch compounds in adulterated milk."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              {/* Choice Options List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                    Choice Options (Select radio for correct answer) *
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={handleAddOptionRow}
                  >
                    Add Option
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {optionsDraft.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(index)}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
                          opt.is_correct
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:border-emerald-500'
                        }`}
                        title={opt.is_correct ? 'Marked as Correct Answer' : 'Click to set as Correct Answer'}
                      >
                        <Radio className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={opt.option_text}
                        onChange={(e) => handleOptionTextChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}...`}
                        className={`flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                          opt.is_correct
                            ? 'border-emerald-500/50 ring-1 ring-emerald-500/30 font-semibold text-emerald-900 dark:text-emerald-100'
                            : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                        required
                      />

                      {optionsDraft.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionRow(index)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving Question...' : editingQuestion ? 'Update Question' : 'Save Question'}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 space-y-4 text-center border-rose-500/20">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                Delete Quiz Question?
              </h3>
              <p className="text-xs text-slate-500">
                This will permanently remove the question and its answer choices.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => handleDeleteQuestion(deleteConfirmId)}
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
