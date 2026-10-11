import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiService } from '../../services/api';
import type { Food, Category, FoodCreate, FoodUpdate } from '../../types';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export const FoodManagement: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState<number | ''>('');
  const [formDescription, setFormDescription] = useState('');
  const [formAdulterants, setFormAdulterants] = useState('');
  const [formHealthRisks, setFormHealthRisks] = useState('');
  const [formConsumerPrecautions, setFormConsumerPrecautions] = useState('');
  const [formImagePath, setFormImagePath] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal
  const [deletingFood, setDeletingFood] = useState<Food | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([apiService.getFoods(), apiService.getCategories()])
      .then(([foodsData, categoriesData]) => {
        if (active) {
          setFoods(foodsData);
          setCategories(categoriesData);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading foods data:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const reloadData = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormDescription('');
    setFormAdulterants('');
    setFormHealthRisks('');
    setFormConsumerPrecautions('');
    setFormImagePath('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    setFormName(food.name);
    setFormCategoryId(food.category?.id || categories[0]?.id || '');
    setFormDescription(food.description || '');
    setFormAdulterants(food.adulterants || '');
    setFormHealthRisks(food.health_risks || '');
    setFormConsumerPrecautions(food.consumer_precautions || '');
    setFormImagePath(food.image_path || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setFormError(null);
      const res = await apiService.uploadImage(file);
      setFormImagePath(res.url);
    } catch (err: unknown) {
      console.error('Failed to upload image:', err);
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError('Failed to upload image file.');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId) {
      setFormError('Food name and Category are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      if (editingFood) {
        const updatePayload: FoodUpdate = {
          name: formName.trim(),
          category_id: Number(formCategoryId),
          description: formDescription.trim() || undefined,
          adulterants: formAdulterants.trim() || undefined,
          health_risks: formHealthRisks.trim() || undefined,
          consumer_precautions: formConsumerPrecautions.trim() || undefined,
          image_path: formImagePath.trim() || undefined,
        };
        await apiService.updateFood(editingFood.id, updatePayload);
      } else {
        const createPayload: FoodCreate = {
          name: formName.trim(),
          category_id: Number(formCategoryId),
          description: formDescription.trim() || undefined,
          adulterants: formAdulterants.trim() || undefined,
          health_risks: formHealthRisks.trim() || undefined,
          consumer_precautions: formConsumerPrecautions.trim() || undefined,
          image_path: formImagePath.trim() || undefined,
        };
        await apiService.createFood(createPayload);
      }

      setIsModalOpen(false);
      reloadData();
    } catch (err: unknown) {
      console.error('Error saving food:', err);
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError('Failed to save food commodity.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFood) return;
    try {
      setDeleteSubmitting(true);
      await apiService.deleteFood(deletingFood.id);
      setDeletingFood(null);
      reloadData();
    } catch (err) {
      console.error('Error deleting food:', err);
      alert('Failed to delete food commodity.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    f.adulterants?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    f.category?.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" icon={<Utensils className="w-3.5 h-3.5" />}>
            Admin CRUD Module
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-emerald-50 mt-1">
            Food Commodities Management
          </h1>
        </div>

        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Food Commodity
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
            placeholder="Search commodities or adulterants..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          {filteredFoods.length} Commodities
        </span>
      </div>

      {/* Table Content */}
      {loading && <LoadingSpinner message="Loading food commodities..." />}

      {error && <ErrorMessage onRetry={reloadData} />}

      {!loading && !error && (
        <Card className="p-0 overflow-hidden border-emerald-900/10 dark:border-emerald-500/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-950/80 text-slate-700 dark:text-emerald-200 text-xs font-bold font-heading border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">ID</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Commodity Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Adulterants Summary</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredFoods.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No commodities match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredFoods.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">#{f.id}</td>
                      <td className="p-4">
                        {f.image_path ? (
                          <img
                            src={apiService.getImageUrl(f.image_path)}
                            alt={f.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-emerald-100 font-heading">
                        {f.name}
                      </td>
                      <td className="p-4">
                        <Badge variant="emerald" size="sm">
                          {f.category?.name || 'Unassigned'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-emerald-200/80 max-w-xs truncate">
                        {f.adulterants || <span className="italic text-slate-400">None</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(f)}
                            className="p-1.5 rounded-lg text-emerald-800 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Edit Commodity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingFood(f)}
                            className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Commodity"
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

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <Card className="w-full max-w-2xl p-6 space-y-6 relative border-emerald-900/20 dark:border-emerald-500/30 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-emerald-50">
                {editingFood ? 'Edit Food Commodity' : 'Create New Food Commodity'}
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
              
              {/* Image Upload & Preview Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Commodity Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {formImagePath ? (
                    <div className="relative group">
                      <img
                        src={apiService.getImageUrl(formImagePath)}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-emerald-500/30 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormImagePath('')}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-1 border border-dashed border-slate-300 dark:border-slate-800">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[10px]">No image</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-600 cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading Image...' : formImagePath ? 'Change Image' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB).
                    </p>
                    {formImagePath && (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-xs">{formImagePath}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                    Commodity Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Milk, Honey, Turmeric"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                    Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    required
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Overview of the food commodity..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Adulterants List
                </label>
                <textarea
                  rows={2}
                  value={formAdulterants}
                  onChange={(e) => setFormAdulterants(e.target.value)}
                  placeholder="e.g. Water, starch, detergent, urea, synthetic milk..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Health &amp; Toxic Risks
                </label>
                <textarea
                  rows={2}
                  value={formHealthRisks}
                  onChange={(e) => setFormHealthRisks(e.target.value)}
                  placeholder="e.g. Gastrointestinal distress, kidney impairment, tissue damage..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  Consumer Household Test Instructions (DART Protocol)
                </label>
                <textarea
                  rows={3}
                  value={formConsumerPrecautions}
                  onChange={(e) => setFormConsumerPrecautions(e.target.value)}
                  placeholder="1. Water Slip Test...\n2. Starch Test...\n3. Detergent Test..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
                  disabled={formSubmitting || uploadingImage}
                >
                  {formSubmitting ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Commodity'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deletingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 space-y-4 relative border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">Delete Food Commodity?</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">&ldquo;{deletingFood.name}&rdquo;</strong> from the database? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setDeletingFood(null)}
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
