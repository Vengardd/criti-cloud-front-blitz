import { useEffect, useState } from 'react';
import { ratingApi } from '../lib/api';
import type { RatingDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StarRating } from '../components/ui/StarRating';
import { getDefaultPosterUrl, truncateText } from '../lib/utils';

export function RatingsPage() {
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const results = await ratingApi.search();
        setRatings(results);
      } catch (error) {
        console.error('Failed to load ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Ratings</h1>
        <p className="text-gray-600 mt-1">View all user ratings and reviews</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : ratings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No ratings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="card">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={rating.media.posterUrl || getDefaultPosterUrl()}
                    alt={rating.media.name}
                    className="w-16 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getDefaultPosterUrl();
                    }}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {truncateText(rating.media.name, 60)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rated by {rating.user.nickname}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {rating.media.detailsType}
                        </span>
                        <span className="text-xs text-gray-500">
                          Source: {rating.source}
                        </span>
                      </div>
                    </div>
                    
                    <StarRating
                      rating={rating.rating}
                      readonly
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}