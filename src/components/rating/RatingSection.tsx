import { useState, useEffect } from 'react';
import { Star, PlusCircle, Edit, AlertCircle } from 'lucide-react';
import { MediaDTO, RatingDTO } from '../../types/api';
import { useRatings } from '../../hooks/useRatings';
import { useAuth } from '../../contexts/AuthContext';
import { StarRating } from '../ui/StarRating';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RatingSectionProps {
  media: MediaDTO;
  initialRatings?: RatingDTO[];
}

export function RatingSection({ media, initialRatings = [] }: RatingSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    ratings,
    userRating,
    averageRating,
    loading,
    error,
    loadRatings,
    addRating
  } = useRatings();

  // Initialize ratings if provided
  useEffect(() => {
    if (initialRatings.length > 0) {
      console.log("isAuthenticated: " + isAuthenticated)
      // Find user's rating if they're authenticated
      if (isAuthenticated && user) {
        const existingUserRating = initialRatings.find(rating => 
          rating.user.id === user.id
        );
        if (existingUserRating) {
          setRatingValue(existingUserRating.rating);
        }
      }
    } else if (media.id) {
      // Load ratings if not provided
      loadRatings(media.id);
    }
  }, [media.id, initialRatings]);

  const handleRatingSubmit = async () => {
    if (ratingValue === 0) return;

    setSubmitting(true);
    try {
      await addRating(media, ratingValue);
      setShowRatingInput(false);
    } catch (err) {
      console.error('Rating submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRatings = initialRatings.length > 0 ? initialRatings : ratings;
  const displayAverageRating = initialRatings.length > 0 
    ? initialRatings.reduce((sum, r) => sum + r.rating, 0) / initialRatings.length 
    : averageRating;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Ratings</h2>
        {isAuthenticated && !showRatingInput && (
          <button
            onClick={() => {
              setRatingValue(userRating?.rating || 0);
              setShowRatingInput(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {userRating ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Rating
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add Rating
              </>
            )}
          </button>
        )}
      </div>

      {/* Rating Input */}
      {showRatingInput && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-700">Rate this {media.detailsType.toLowerCase()}:</p>
            <StarRating
              rating={ratingValue}
              readonly={false}
              onRatingChange={setRatingValue}
              size="lg"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingInput(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                disabled={ratingValue === 0 || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {error && (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Average Rating */}
      {displayRatings.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold">{displayAverageRating.toFixed(1)}</span>
          </div>
          <span className="text-gray-600">
            Based on {displayRatings.length} rating{displayRatings.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Ratings List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : displayRatings.length === 0 ? (
        <p className="text-gray-500">No ratings yet. Be the first to rate this {media.detailsType.toLowerCase()}!</p>
      ) : (
        <div className="space-y-4">
          {displayRatings.map((rating) => (
            <div key={rating.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">{rating.user.nickname}</p>
                {rating.user.id === user?.id && (
                  <p className="text-xs text-blue-600">(You)</p>
                )}
              </div>
              <StarRating rating={rating.rating} readonly size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
