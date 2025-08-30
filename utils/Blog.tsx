import { Blog, Comment, User } from '../types';
import { storage } from './storage';
import { aiService } from './ai';

export const blogService = {
  createBlog: async (blogData: Partial<Blog>, author: User): Promise<Blog> => {
    const blogs = storage.getBlogs();
    
    const newBlog: Blog = {
      id: (blogs.length + 1).toString(),
      title: blogData.title || '',
      content: blogData.content || '',
      summary: await aiService.generateSummary(blogData.content || ''),
      author,
      tags: blogData.tags || [],
      status: 'pending',
      likes: [],
      bookmarks: [],
      views: 0,
      readTime: aiService.calculateReadTime(blogData.content || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featuredImage: blogData.featuredImage,
      seoKeywords: await aiService.generateKeywords(blogData.content || '')
    };
    
    blogs.push(newBlog);
    storage.setBlogs(blogs);
    
    return newBlog;
  },

  updateBlogStatus: (blogId: string, status: Blog['status']): Blog | null => {
    const blogs = storage.getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) return null;
    
    blogs[blogIndex].status = status;
    blogs[blogIndex].updatedAt = new Date().toISOString();
    storage.setBlogs(blogs);
    
    return blogs[blogIndex];
  },

  getBlogs: (filters?: { status?: Blog['status']; author?: string; tags?: string[] }): Blog[] => {
    let blogs = storage.getBlogs();
    
    if (filters?.status) {
      blogs = blogs.filter(b => b.status === filters.status);
    }
    
    if (filters?.author) {
      blogs = blogs.filter(b => b.author.id === filters.author);
    }
    
    if (filters?.tags?.length) {
      blogs = blogs.filter(b => 
        filters.tags!.some(tag => b.tags.includes(tag))
      );
    }
    
    return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBlogById: (id: string): Blog | null => {
    const blogs = storage.getBlogs();
    return blogs.find(b => b.id === id) || null;
  },

  likeBlog: (blogId: string, userId: string): Blog | null => {
    const blogs = storage.getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) return null;
    
    const blog = blogs[blogIndex];
    const isLiked = blog.likes.includes(userId);
    
    if (isLiked) {
      blog.likes = blog.likes.filter(id => id !== userId);
    } else {
      blog.likes.push(userId);
    }
    
    storage.setBlogs(blogs);
    return blog;
  },

  bookmarkBlog: (blogId: string, userId: string): Blog | null => {
    const blogs = storage.getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex === -1) return null;
    
    const blog = blogs[blogIndex];
    const isBookmarked = blog.bookmarks.includes(userId);
    
    if (isBookmarked) {
      blog.bookmarks = blog.bookmarks.filter(id => id !== userId);
    } else {
      blog.bookmarks.push(userId);
    }
    
    storage.setBlogs(blogs);
    return blog;
  },

  addView: (blogId: string): void => {
    const blogs = storage.getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex !== -1) {
      blogs[blogIndex].views += 1;
      storage.setBlogs(blogs);
    }
  }
};

export const commentService = {
  addComment: (blogId: string, content: string, author: User): Comment => {
    const comments = storage.getComments();
    
    const newComment: Comment = {
      id: (comments.length + 1).toString(),
      blogId,
      author,
      content,
      likes: [],
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    storage.setComments(comments);
    
    return newComment;
  },

  getCommentsByBlogId: (blogId: string): Comment[] => {
    const comments = storage.getComments();
    return comments
      .filter(c => c.blogId === blogId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  likeComment: (commentId: string, userId: string): Comment | null => {
    const comments = storage.getComments();
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) return null;
    
    const comment = comments[commentIndex];
    const isLiked = comment.likes.includes(userId);
    
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id !== userId);
    } else {
      comment.likes.push(userId);
    }
    
    storage.setComments(comments);
    return comment;
  }
};