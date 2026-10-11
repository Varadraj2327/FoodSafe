import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import { PageContainer } from './components/layout/PageContainer';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { FoodList } from './pages/FoodList';
import { FoodDetails } from './pages/FoodDetails';
import { SearchFoods } from './pages/SearchFoods';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

import { UserProfile } from './pages/UserProfile';
import { Favorites } from './pages/Favorites';
import { Quiz } from './pages/Quiz';
import { QuizHistory } from './pages/QuizHistory';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { FoodManagement } from './pages/admin/FoodManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { QuizManagement } from './pages/admin/QuizManagement';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes wrapped in PageContainer */}
            <Route
              path="/"
              element={
                <PageContainer>
                  <Home />
                </PageContainer>
              }
            />
            <Route
              path="/login"
              element={
                <PageContainer>
                  <Login />
                </PageContainer>
              }
            />
            <Route
              path="/register"
              element={
                <PageContainer>
                  <Register />
                </PageContainer>
              }
            />
            <Route
              path="/foods"
              element={
                <PageContainer>
                  <FoodList />
                </PageContainer>
              }
            />
            <Route
              path="/foods/:id"
              element={
                <PageContainer>
                  <FoodDetails />
                </PageContainer>
              }
            />
            <Route
              path="/search"
              element={
                <PageContainer>
                  <SearchFoods />
                </PageContainer>
              }
            />
            <Route
              path="/about"
              element={
                <PageContainer>
                  <About />
                </PageContainer>
              }
            />
            <Route
              path="/contact"
              element={
                <PageContainer>
                  <Contact />
                </PageContainer>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageContainer>
                  <PrivacyPolicy />
                </PageContainer>
              }
            />
            <Route
              path="/terms"
              element={
                <PageContainer>
                  <Terms />
                </PageContainer>
              }
            />

            {/* User Profile & Favorites (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageContainer>
                    <UserProfile />
                  </PageContainer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <PageContainer>
                    <Favorites />
                  </PageContainer>
                </ProtectedRoute>
              }
            />

            {/* Quiz & Awareness Routes */}
            <Route
              path="/quiz"
              element={
                <PageContainer>
                  <Quiz />
                </PageContainer>
              }
            />
            <Route
              path="/quiz/history"
              element={
                <ProtectedRoute>
                  <PageContainer>
                    <QuizHistory />
                  </PageContainer>
                </ProtectedRoute>
              }
            />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="foods" element={<FoodManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="quiz" element={<QuizManagement />} />
            </Route>

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <PageContainer>
                  <NotFound />
                </PageContainer>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
