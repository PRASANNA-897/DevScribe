import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Users, Award, Eye, Heart, BookOpen, Calendar, Settings } from 'lucide-react';
import { Blog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../utils/blog';
import BlogCard from '../Blog/BlogCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'drafts'>('published');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserBlogs();
    }
  }, [user, activeTab]);

  const loadUserBlogs = () => {
    if (!user) return;
    
    let status: Blog['status'];
    switch (activeTab) {
      case 'published':
        status = 'approved';
        break;
      case 'pending':
        status = 'pending';
        break;
      case 'drafts':
        status = 'draft';
        break;
    }
    
    const userBlogs = blogService.getBlogs({ author: user.id, status });
    setBlogs(userBlogs);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please log in</h1>
          <Link to="/login" className="text-purple-600 hover:text-purple-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const publishedBlogs = blogService.getBlogs({ author: user.id, status: 'approved' });
  const totalViews = publishedBlogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = publishedBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    {user.bio && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {publishedBlogs.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalViews}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {totalLikes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {user.xp}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">XP Points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {user.badges.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Badges ({user.badges.length})</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-sm font-medium"
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                {[
                  { key: 'published', label: 'Published', count: blogService.getBlogs({ author: user.id, status: 'approved' }).length },
                  { key: 'pending', label: 'Pending', count: blogService.getBlogs({ author: user.id, status: 'pending' }).length },
                  { key: 'drafts', label: 'Drafts', count: blogService.getBlogs({ author: user.id, status: 'draft' }).length }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : blogs.length > 0 ? (
                <div className="space-y-6">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} onUpdate={loadUserBlogs} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No {activeTab} articles yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {activeTab === 'published' && "Start writing to share your knowledge with the community."}
                    {activeTab === 'pending' && "Your submitted articles will appear here while awaiting approval."}
                    {activeTab === 'drafts' && "Save drafts here to continue working on them later."}
                  </p>
                  <Link
                    to="/write"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Write Article</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;