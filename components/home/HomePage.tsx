import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Users, BookOpen, Award } from 'lucide-react';
import { Blog } from '../../types';
import { blogService } from '../../utils/blog';
import { gamificationService } from '../../utils/gamification';
import BlogCard from '../Blog/BlogCard';

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const approvedBlogs = blogService.getBlogs({ status: 'approved' });
    setBlogs(approvedBlogs.slice(0, 6));
    
    // Trending blogs (sort by likes + recent activity)
    const trending = approvedBlogs
      .sort((a, b) => {
        const aScore = a.likes.length * 2 + a.views * 0.1;
        const bScore = b.likes.length * 2 + b.views * 0.1;
        return bScore - aScore;
      })
      .slice(0, 3);
    setTrendingBlogs(trending);
    
    const topUsers = gamificationService.getLeaderboard().slice(0, 5);
    setLeaderboard(topUsers);
    
    setLoading(false);
  };

  const stats = [
    { label: 'Active Writers', value: '1.2K+', icon: Users, color: 'text-blue-600' },
    { label: 'Published Articles', value: '5.8K+', icon: BookOpen, color: 'text-green-600' },
    { label: 'Community Engagement', value: '98%', icon: Star, color: 'text-yellow-600' },
    { label: 'Badges Earned', value: '3.2K+', icon: Award, color: 'text-purple-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Next-Gen
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Blogging </span>
              Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Write, share, and discover amazing content with AI-powered tools and gamification that makes blogging fun and rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/write"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Start Writing
              </Link>
              <Link
                to="/explore"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Explore Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Trending Section */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-8">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
              </div>
              
              <div className="grid gap-6">
                {trendingBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} onUpdate={loadData} />
                ))}
              </div>
            </section>

            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
                <Link
                  to="/explore"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  View all →
                </Link>
              </div>
              
              <div className="grid gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} onUpdate={loadData} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Authors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Authors</h3>
              </div>
              
              <div className="space-y-4">
                {leaderboard.map((item, index) => (
                  <div key={item.user.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/author/${item.user.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {item.user.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.stats.xp} XP • {item.stats.blogs} articles
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to="/leaderboard"
                className="block mt-6 text-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                View Full Leaderboard →
              </Link>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Popular Tags</h3>
              
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Node.js', 'TypeScript', 'CSS', 'Python', 'DevOps', 'AI/ML'].map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Join CTA */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Join the Community</h3>
              <p className="text-purple-100 mb-4 text-sm leading-relaxed">
                Connect with fellow developers, share your knowledge, and grow your skills together.
              </p>
              <Link
                to="/signup"
                className="block w-full py-2 bg-white text-purple-600 rounded-lg font-medium text-center hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;