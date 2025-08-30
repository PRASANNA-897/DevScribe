import { User } from '../types';
import { storage } from './storage';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = storage.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In real app, verify password hash
    if (password !== 'password') {
      throw new Error('Invalid password');
    }
    
    const token = `fake_jwt_token_${user.id}_${Date.now()}`;
    storage.setCurrentUser(user);
    
    return { user, token };
  },

  signup: async (userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const users = storage.getUsers();
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      followers: [],
      following: [],
      xp: 0,
      badges: [],
      joinedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    storage.setUsers(users);
    storage.setCurrentUser(newUser);
    
    const token = `fake_jwt_token_${newUser.id}_${Date.now()}`;
    
    return { user: newUser, token };
  },

  logout: () => {
    storage.clearCurrentUser();
  },

  getCurrentUser: (): User | null => {
    return storage.getCurrentUser();
  }
};