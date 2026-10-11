import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiService } from '../../services/api';
import type { Category, CategoryCreate, CategoryUpdate } from '../../types';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertTriangle
} from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    apiService
      .getCategories()
      .then((data) => {
        if (active) {
          setCategories(data);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const reloadCategories = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      if (editingCategory) {
        const updatePayload: CategoryUpdate = {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
        };
        await apiService.updateCategory(editingCategory.id, updatePayload);
      } else {
        const createPayload: CategoryCreate = {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
        };
        await apiService.createCategory(createPayload);
      }

      setIsModalOpen(false);
      reloadCategories();
    } catch (err: unknown) {
      console.error('Error saving category:', err);
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError('Failed to save category. Please check backend connection.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      setDeleteSubmitting(true);
      await apiService.deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      reloadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<FolderTree className="w-3.5 h-3.5" />}>
            Admin CRUD Module
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            Category Management
          </h1>
        </div>

        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Category
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          {filteredCategories.length} Categories
        </span>
      </div>

      {/* Table Content */}
      {loading && <LoadingSpinner message="Loading categories..." />}

      {error && <ErrorMessage onRetry={reloadCategories} />}

      {!loading && !error && (
        <Card className="p-0 overflow-hidden border-emerald-900/10 dark:border-emerald-500/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-950/80 text-slate-700 dark:text-emerald-200 text-xs font-bold font-heading border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">ID</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">#{cat.id}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-emerald-100 font-heading">
                        {cat.name}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-emerald-200/80 max-w-md truncate">
                        {cat.description || <span className="italic text-slate-400">No description</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg text-emerald-800 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 space-y-6 relative border-emerald-900/20 dark:border-emerald-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs border border-rose-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dairy, Spices, Grains"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief summary of food items included in this category..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 space-y-4 relative border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">Delete Category?</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete category <strong className="text-slate-900 dark:text-white">&ldquo;{deletingCategory.name}&rdquo;</strong>?
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setDeletingCategory(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 text-white"
                onClick={handleDeleteConfirm}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
