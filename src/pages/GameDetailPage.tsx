import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import { gameApi, ratingApi } from '../lib/api';
import type { GameDTO, RatingDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StarRating } from '../components/ui/StarRating';
import { getDefaultPosterUrl } from '../lib/utils';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDTO | null>(null);
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  useEffect(() => {
    const loadGameData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const gameData = await gameApi.getById(id);
        setGame(gameData);
        
        // Load ratings for this game
        setRatingsLoading(true);
        try {
          const gameRatings = await ratingApi.search({ mediaId: id });
          setRatings(gameRatings);
        } catch (error) {
          console.error('Failed to load ratings:', error);
        } finally {
          setRatingsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Game not found.</p>
        <Link to="/all-media" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          ← Back to Media
        </Link>
      </div>
    );
  }

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link 
        to="/all-media" 
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Media
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Poster */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <img
              src={game.posterUrl || getDefaultPosterUrl()}
              alt={game.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultPosterUrl();
              }}
            />
          </div>
        </div>

        {/* Game Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{game.title}</h1>
            
            {game.igdbId && (
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">IGDB ID: {game.igdbId}</span>
              </div>
            )}

            {/* Average Rating */}
            {ratings.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">
                  Based on {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Summary */}
          {game.summary && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{game.summary}</p>
            </div>
          )}

          {/* Ratings Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Ratings</h2>
            
            {ratingsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : ratings.length === 0 ? (
              <p className="text-gray-500">No ratings yet. Be the first to rate this game!</p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">{rating.user.nickname}</p>
                      <p className="text-sm text-gray-600">User ID: {rating.user.id?.slice(0, 8)}...</p>
                    </div>
                    <StarRating rating={rating.rating} readonly size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}