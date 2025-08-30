import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { gamificationService } from '../../utils/gamification';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'xp' | 'blogs' | 'likes'>('xp');

  useEffect(() => {
    const data = gamificationService.getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  }, []);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (activeTab) {
      case 'xp':
        return b.stats.xp - a.stats.xp;
      case 'blogs':
        return b.stats.blogs - a.stats.blogs;
      case 'likes':
        return b.stats.likes - a.stats.likes;
      default:
        return 0;
    }
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-sm">{index + 1}</div>;
    }
  };

  const getStatValue = (stats: any) => {
    switch (activeTab) {
      case 'xp':
        return `${stats.xp} XP`;
      case 'blogs':
        return `${stats.blogs} articles`;
      case 'likes':
        return `${stats.likes} likes`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Community Leaderboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Celebrating our most active and engaging community members. Keep writing, sharing, and inspiring others!
            </p>
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                {[
                  { key: 'xp', label: 'XP Points', icon: Star },
                  { key: 'blogs', label: 'Articles', icon: TrendingUp },
                  { key: 'likes', label: 'Likes', icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Leaderboard List */}
            <div className="p-6">
              <div className="space-y-4">
                {sortedLeaderboard.map((item, index) => (
                  <div key={item.user.id} className={`flex items-center space-x-4 p-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800' : 'border border-gray-200 dark:border-gray-700'
                  }`}>
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(index)}
                    </div>

                    {/* Avatar */}
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.user.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{item.stats.blogs} articles</span>
                        <span>•</span>
                        <span>{item.stats.likes} likes</span>
                        <span>•</span>
                        <span>{item.user.badges.length} badges</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {getStatValue(item.stats)}
                      </div>
                      {index < 3 && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          {index === 0 ? '🥇 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex space-x-1">
                      {item.user.badges.slice(0, 3).map((badge: any) => (
                        <div
                          key={badge.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs"
                          title={badge.name}
                        >
                          {badge.icon}
                        </div>
                      ))}
                      {item.user.badges.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-medium">
                          +{item.user.badges.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No rankings yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start writing and engaging to appear on the leaderboard!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;