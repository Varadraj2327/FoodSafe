import axios from 'axios';
import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  Food,
  FoodCreate,
  FoodUpdate,
  User,
  UserUpdate,
  UserRegisterRequest,
  TokenResponse,
  AdminStats,
  QuizQuestion,
  QuizQuestionCreate,
  QuizAnswerInput,
  QuizResult,
  QuizAnalyticsOverview,
  AnalyticsOverview,
  FoodAnalytics,
  QuizAnalyticsAdmin,
  UserAnalyticsAdmin,
  UserPersonalInsights
} from '../types';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:8000/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization header if JWT token is stored in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodsafe-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  // --- AUTH & USER PROFILE ENDPOINTS ---
  async register(data: UserRegisterRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/register', data);
    return response.data;
  },

  async login(username: string, password: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: UserUpdate): Promise<User> {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  },

  // --- FAVORITES ENDPOINTS ---
  async getFavorites(): Promise<Food[]> {
    const response = await apiClient.get<Food[]>('/favorites');
    return response.data;
  },

  async addFavorite(foodId: number): Promise<void> {
    await apiClient.post(`/favorites/${foodId}`);
  },

  async removeFavorite(foodId: number): Promise<void> {
    await apiClient.delete(`/favorites/${foodId}`);
  },

  async checkFavorite(foodId: number): Promise<boolean> {
    const response = await apiClient.get<{ is_favorite: boolean }>(`/favorites/check/${foodId}`);
    return response.data.is_favorite;
  },


  // --- ADMIN STATS ---
  async getAdminStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>('/admin/stats');
    return response.data;
  },

  // --- CATEGORIES PUBLIC & ADMIN CRUD ---
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async createCategory(data: CategoryCreate): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  async updateCategory(id: number, data: CategoryUpdate): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },

  // --- FOODS PUBLIC & ADMIN CRUD ---
  async getFoods(): Promise<Food[]> {
    const response = await apiClient.get<Food[]>('/foods');
    return response.data;
  },

  async getFoodById(id: number | string): Promise<Food> {
    const response = await apiClient.get<Food>(`/foods/${id}`);
    return response.data;
  },

  async searchFoods(query: string): Promise<Food[]> {
    if (!query.trim()) return [];
    const response = await apiClient.get<Food[]>('/foods/search', {
      params: { q: query.trim() },
    });
    return response.data;
  },

  async createFood(data: FoodCreate): Promise<Food> {
    const response = await apiClient.post<Food>('/foods', data);
    return response.data;
  },

  async updateFood(id: number, data: FoodUpdate): Promise<Food> {
    const response = await apiClient.put<Food>(`/foods/${id}`, data);
    return response.data;
  },

  async deleteFood(id: number): Promise<void> {
    await apiClient.delete(`/foods/${id}`);
  },

  // --- IMAGE UPLOADS ---
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url: string; filename: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getImageUrl(path?: string): string | undefined {
    if (!path) return undefined;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const origin = (API_BASE_URL.replace(/\/api\/?$/, ''));
    return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
  },

  // --- QUIZ & AWARENESS MODULE ENDPOINTS ---
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    const response = await apiClient.get<QuizQuestion[]>('/quiz/questions');
    return response.data;
  },

  async submitQuiz(answers: QuizAnswerInput[]): Promise<QuizResult> {
    const response = await apiClient.post<QuizResult>('/quiz/submit', { answers });
    return response.data;
  },

  async getQuizHistory(): Promise<QuizResult[]> {
    const response = await apiClient.get<QuizResult[]>('/quiz/history');
    return response.data;
  },

  async getQuizAnalytics(): Promise<QuizAnalyticsOverview> {
    const response = await apiClient.get<QuizAnalyticsOverview>('/quiz/analytics');
    return response.data;
  },

  async getAdminQuizQuestions(): Promise<QuizQuestion[]> {
    const response = await apiClient.get<QuizQuestion[]>('/quiz/admin/questions');
    return response.data;
  },

  async createQuizQuestion(data: QuizQuestionCreate): Promise<QuizQuestion> {
    const response = await apiClient.post<QuizQuestion>('/quiz/admin/questions', data);
    return response.data;
  },

  async updateQuizQuestion(id: number, data: Partial<QuizQuestionCreate>): Promise<QuizQuestion> {
    const response = await apiClient.put<QuizQuestion>(`/quiz/admin/questions/${id}`, data);
    return response.data;
  },

  async deleteQuizQuestion(id: number): Promise<void> {
    await apiClient.delete(`/quiz/admin/questions/${id}`);
  },

  // --- ANALYTICS MODULE ENDPOINTS ---
  async getAdminAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>('/admin/analytics/overview');
    return response.data;
  },

  async getAdminAnalyticsFoods(): Promise<FoodAnalytics> {
    const response = await apiClient.get<FoodAnalytics>('/admin/analytics/foods');
    return response.data;
  },

  async getAdminAnalyticsQuiz(): Promise<QuizAnalyticsAdmin> {
    const response = await apiClient.get<QuizAnalyticsAdmin>('/admin/analytics/quiz');
    return response.data;
  },

  async getAdminAnalyticsUsers(): Promise<UserAnalyticsAdmin> {
    const response = await apiClient.get<UserAnalyticsAdmin>('/admin/analytics/users');
    return response.data;
  },

  async getUserPersonalAnalytics(): Promise<UserPersonalInsights> {
    const response = await apiClient.get<UserPersonalInsights>('/users/me/analytics');
    return response.data;
  },

  // --- CONTACT ENDPOINT ---
  async sendContactMessage(data: { name: string; email: string; subject: string; message: string }): Promise<{ status: string; message: string }> {
    const response = await apiClient.post<{ status: string; message: string }>('/contact', data);
    return response.data;
  },
};


