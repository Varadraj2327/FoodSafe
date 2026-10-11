export type Theme = 'light' | 'dark';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at?: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  food_id: number;
  food: Food;
  created_at: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}


export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
}

export interface Food {
  id: number;
  name: string;
  category: Category;
  description?: string;
  adulterants?: string;
  health_risks?: string;
  consumer_precautions?: string;
  image_path?: string;
  created_at?: string;
}

export interface FoodCreate {
  name: string;
  category_id: number;
  description?: string;
  adulterants?: string;
  health_risks?: string;
  consumer_precautions?: string;
  image_path?: string;
}

export interface FoodUpdate {
  name?: string;
  category_id?: number;
  description?: string;
  adulterants?: string;
  health_risks?: string;
  consumer_precautions?: string;
  image_path?: string;
}


export interface AdminStats {
  food_count: number;
  category_count: number;
  quiz_count: number;
  admin_user: string;
}

export interface QuizOption {
  id?: number;
  option_text: string;
  is_correct?: boolean;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  explanation?: string;
  created_at?: string;
  options: QuizOption[];
}

export interface QuizQuestionCreate {
  question_text: string;
  explanation?: string;
  options: { option_text: string; is_correct: boolean }[];
}

export interface QuizAnswerInput {
  question_id: number;
  selected_option_id: number;
}

export interface QuestionResultDetail {
  question_id: number;
  question_text: string;
  user_option_id: number;
  user_option_text: string;
  correct_option_id: number;
  correct_option_text: string;
  is_correct: boolean;
  explanation?: string;
}

export interface QuizResult {
  id: number;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
  details?: QuestionResultDetail[];
}

export interface UserPerformanceSummary {
  total_quizzes_taken: number;
  average_score_percentage: number;
  highest_score_percentage: number;
  latest_quiz_date?: string;
}

export interface QuizAnalyticsOverview {
  total_attempts: number;
  average_score: number;
  total_unique_participants: number;
  performance_summary: UserPerformanceSummary;
}

export interface AnalyticsOverview {
  total_users: number;
  total_foods: number;
  total_categories: number;
  total_quiz_attempts: number;
  average_quiz_score: number;
  total_favorites: number;
}

export interface FoodPopularityItem {
  food_id: number;
  food_name: string;
  category_name: string;
  favorite_count: number;
  view_count: number;
}

export interface CategoryDistributionItem {
  category_id: number;
  category_name: string;
  food_count: number;
}

export interface FoodAnalytics {
  most_favorited_foods: FoodPopularityItem[];
  most_viewed_foods: FoodPopularityItem[];
  category_distribution: CategoryDistributionItem[];
}

export interface QuizScoreDistributionItem {
  score_range: string;
  attempt_count: number;
}

export interface QuizPerformanceTrendItem {
  date: string;
  average_percentage: number;
  total_attempts: number;
}

export interface QuizAnalyticsAdmin {
  total_attempts: number;
  average_score: number;
  highest_score: number;
  score_distribution: QuizScoreDistributionItem[];
  performance_over_time: QuizPerformanceTrendItem[];
}

export interface UserRegistrationTrendItem {
  date: string;
  new_users: number;
}

export interface RecentActivityItem {
  activity_type: string;
  description: string;
  timestamp: string;
  user_name?: string;
}

export interface UserAnalyticsAdmin {
  total_users: number;
  admin_users_count: number;
  regular_users_count: number;
  registration_trend: UserRegistrationTrendItem[];
  recent_activity: RecentActivityItem[];
}

export interface UserPersonalInsights {
  total_quizzes_attempted: number;
  average_quiz_score: number;
  best_quiz_score: number;
  favorite_foods_count: number;
  score_trend: QuizPerformanceTrendItem[];
}

export interface NavItem {
  label: string;
  href: string;
}
