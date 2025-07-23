import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Gamepad2, Star, TrendingUp, Sparkles, Zap, Activity } from 'lucide-react';
import { mediaApi, testApi } from '../lib/api';
import type { MediaDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MediaCard } from '../components/ui/MediaCard';

export function HomePage() {
  const [recentMedia, setRecentMedia] = useState<MediaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkApiAndLoadData = async () => {
      try {
        // Test API connection
        await testApi.test();
        setApiStatus('online');
        
        // Load recent media
        const media = await mediaApi.search({ size: 6 });
        setRecentMedia(media);
      } catch (error) {
        console.error('Failed to load data:', error);
        setApiStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    checkApiAndLoadData();
  }, []);

  const features = [
    {
      name: 'Movies',
      description: 'Discover and rate your favorite movies with detailed information',
      icon: Film,
      href: '/movies',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      name: 'Games',
      description: 'Explore and review video games from all genres',
      icon: Gamepad2,
      href: '/games',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      name: 'All Media',
      description: 'Browse all types of media content in one place',
      icon: Star,
      href: '/all-media',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Your Ratings',
      description: 'View and manage all your ratings and reviews',
      icon: TrendingUp,
      href: '/ratings',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'online':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <Zap className="h-4 w-4 text-red-500" />;
      default:
        return <LoadingSpinner size="sm" />;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="hero-section relative p-12 text-center">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-16 w-16 text-white/80" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">CritiCloud</span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Your personal media rating platform. Discover, rate, and track movies, games, and more with our beautiful, intuitive interface.
          </p>
          
          {/* API Status */}
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${getStatusColor()} backdrop-blur-sm`}>
            {getStatusIcon()}
            <span className="font-medium">
              API Status: {apiStatus === 'checking' ? 'Checking...' : apiStatus}
            </span>
          </div>

          <div className="pt-6">
            <Link
              to="/all-media"
              className="btn-primary text-lg px-8 py-4 shadow-2xl shadow-white/20 hover:shadow-white/30"
            >
              Start Exploring
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/20 rounded-full blur-xl"></div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="section-title mb-4">Explore Our Features</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Dive into our comprehensive media platform with these powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.name}
                to={feature.href}
                className="feature-card group"
              >
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Media */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">Recent Media</h2>
            <p className="text-slate-600 mt-2">Latest additions to our media collection</p>
          </div>
          <Link
            to="/all-media"
            className="btn-secondary group"
          >
            <span>View all</span>
            <Star className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-slate-500">Loading amazing content...</p>
            </div>
          </div>
        ) : apiStatus === 'offline' ? (
          <div className="text-center py-16 card">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Issue</h3>
            <p className="text-slate-500">Unable to load media. Please check your connection and try again.</p>
          </div>
        ) : recentMedia.length === 0 ? (
          <div className="text-center py-16 card">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Media Yet</h3>
            <p className="text-slate-500 mb-4">No media found. Start by adding some content!</p>
            <Link to="/all-media" className="btn-primary">
              Explore Media
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recentMedia.map((media) => (
              <div key={media.id} className="media-card p-0 overflow-hidden">
                <MediaCard
                  media={media}
                  onClick={() => {
                    // Navigate to media detail page
                    window.location.href = `/media/${media.id}`;
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}