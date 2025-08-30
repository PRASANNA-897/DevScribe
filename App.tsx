import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeSampleData } from './utils/storage';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './components/Home/HomePage';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import BlogEditor from './components/Blog/BlogEditor';
import BlogDetail from './components/Blog/BlogDetail';
import ProfilePage from './components/User/ProfilePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import LeaderboardPage from './components/Leaderboard/LeaderboardPage';
import SearchPage from './components/Search/SearchPage';

function App() {
  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/write" element={<BlogEditor />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/explore" element={<SearchPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;