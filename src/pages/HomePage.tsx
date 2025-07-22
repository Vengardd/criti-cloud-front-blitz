import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Gamepad2, Star, TrendingUp } from 'lucide-react';
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
      description: 'Discover and rate your favorite movies',
      icon: Film,
      href: '/movies',
      color: 'bg-blue-500'
    },
    {
      name: 'Games',
      description: 'Explore and review video games',
      icon: Gamepad2,
      href: '/games',
      color: 'bg-green-500'
    },
    {
      name: 'All Media',
      description: 'Browse all types of media content',
      icon: Star,
      href: '/media',
      color: 'bg-purple-500'
    },
    {
      name: 'Your Ratings',
      description: 'View and manage your ratings',
      icon: TrendingUp,
      href: '/ratings',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to CritiCloud
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your personal media rating platform. Discover, rate, and track movies, games, and more.
        </p>
        
        {/* API Status */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            apiStatus === 'online' ? 'bg-green-500' : 
            apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <span className="text-gray-600">
            API Status: {apiStatus === 'checking' ? 'Checking...' : apiStatus}
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.name}
              to={feature.href}
              className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Media */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Media</h2>
          <Link
            to="/media"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : apiStatus === 'offline' ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Unable to load media. Please check your connection.</p>
          </div>
        ) : recentMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No media found. Start by adding some content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recentMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                onClick={() => {
                  // Navigate to media detail page
                  window.location.href = `/media/${media.id}`;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}