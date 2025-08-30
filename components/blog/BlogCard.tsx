import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, MessageCircle, Eye, Clock } from 'lucide-react';
import { Blog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { blogService } from '../../utils/blog';

interface BlogCardProps {
  blog: Blog;
  onUpdate?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onUpdate }) => {
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    blogService.likeBlog(blog.id, user.id);
    onUpdate?.();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    blogService.bookmarkBlog(blog.id, user.id);
    onUpdate?.();
  };

  const isLiked = user ? blog.likes.includes(user.id) : false;
  const isBookmarked = user ? blog.bookmarks.includes(user.id) : false;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group">
      <Link to={`/blog/${blog.id}`}>
        {blog.featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Author & Meta */}
          <div className="flex items-center space-x-3 mb-4">
            {blog.author.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                {blog.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {blog.author.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Summary */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {blog.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {blog.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{blog.views}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">12</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">{blog.likes.length}</span>
              
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;