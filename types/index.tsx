export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  xp: number;
  badges: Badge[];
  joinedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: User;
  tags: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  likes: string[];
  bookmarks: string[];
  views: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  featuredImage?: string;
  seoKeywords: string[];
}

export interface Comment {
  id: string;
  blogId: string;
  author: User;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'blog_approved' | 'blog_rejected' | 'new_comment' | 'new_follower' | 'badge_earned';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Analytics {
  totalBlogs: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  topAuthors: Array<{
    user: User;
    blogCount: number;
    totalViews: number;
    totalLikes: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}