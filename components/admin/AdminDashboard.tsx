import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Eye, Heart, TrendingUp, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';
import { Blog, Analytics } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../utils/blog';
import { storage } from '../../utils/storage';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    const pending = blogService.getBlogs({ status: 'pending' });
    setPendingBlogs(pending);

    // Generate analytics
    const allBlogs = blogService.getBlogs();
    const users = storage.getUsers();
    const approvedBlogs = allBlogs.filter(b => b.status === 'approved');
    
    const totalViews = approvedBlogs.reduce((sum, blog) => sum + blog.views, 0);
    const totalLikes = approvedBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);

    const topAuthors = users
      .filter(u => u.role === 'user')
      .map(user => {
        const userBlogs = approvedBlogs.filter(b => b.author.id === user.id);
        const userViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const userLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
        
        return {
          user,
          blogCount: userBlogs.length,
          totalViews: userViews,
          totalLikes: userLikes
        };
      })
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5);

    const analyticsData: Analytics = {
      totalBlogs: approvedBlogs.length,
      totalUsers: users.filter(u => u.role === 'user').length,
      totalViews,
      totalLikes,
      topAuthors,
      recentActivity: [
        { type: 'blog_published', description: 'New blog published', timestamp: new Date().toISOString() },
        { type: 'user_joined', description: 'New user joined', timestamp: new Date().toISOString() }
      ]
    };

    setAnalytics(analyticsData);
    setLoading(false);
  };

  const handleApproveBlog = (blogId: string) => {
    blogService.updateBlogStatus(blogId, 'approved');
    loadDashboardData();
  };

  const handleRejectBlog = (blogId: string) => {
    blogService.updateBlogStatus(blogId, 'rejected');
    loadDashboardData();
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Published Blogs', value: analytics.totalBlogs, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Views', value: analytics.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Likes', value: analytics.totalLikes.toLocaleString(), icon: Heart, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage content, users, and platform analytics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Pending Approvals ({pendingBlogs.length})
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  {pendingBlogs.length > 0 ? (
                    <div className="space-y-6">
                      {pendingBlogs.map((blog) => (
                        <div key={blog.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {blog.summary}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>By {blog.author.name}</span>
                                <span>•</span>
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{blog.readTime} min read</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApproveBlog(blog.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectBlog(blog.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No pending approvals
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        All submitted articles have been reviewed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Top Authors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Authors</h3>
                </div>
                
                <div className="space-y-4">
                  {analytics.topAuthors.map((author, index) => (
                    <div key={author.user.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      {author.user.avatar ? (
                        <img
                          src={author.user.avatar}
                          alt={author.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                          {author.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {author.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {author.blogCount} articles • {author.totalViews} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Quick Actions</span>
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Export Analytics</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Download platform metrics</div>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">View and moderate users</div>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="font-medium text-gray-900 dark:text-white">Platform Settings</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Configure site settings</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;