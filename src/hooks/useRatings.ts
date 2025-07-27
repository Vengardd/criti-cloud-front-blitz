import { useState } from 'react';
import { ratingApi } from '../lib/api';
import {RatingDTO, MediaDTO, NewRatingRequestDTO} from '../types/api';
import { useAuth } from '../contexts/AuthContext';

export function useRatings() {
  const { user, isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<RatingDTO | null>(null);

  const loadRatings = async (mediaId: string) => {
    if (!mediaId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedRatings = await ratingApi.search({ mediaId });
      setRatings(fetchedRatings);

      // Find user's rating if they're authenticated
      if (isAuthenticated && user) {
        const userRating = fetchedRatings.find(rating => 
          rating.user.id === user.id
        );
        setUserRating(userRating || null);
      }
    } catch (err) {
      console.error('Failed to load ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const addRating = async (media: MediaDTO, rating: number) => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to rate');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const newRating: NewRatingRequestDTO = {
        mediaId: media.id || 'null',
        rating: rating,
        source: 'APP'
      };

      const createdRating = await ratingApi.create(newRating);

      // Update the ratings list
      if (userRating) {
        // Replace existing user rating
        setRatings(prevRatings => 
          prevRatings.map(r => r.user.id === user.id ? createdRating : r)
        );
      } else {
        // Add new rating
        setRatings(prevRatings => [...prevRatings, createdRating]);
      }

      setUserRating(createdRating);
      return createdRating;
    } catch (err) {
      console.error('Failed to add rating:', err);
      setError('Failed to add rating');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  return {
    ratings,
    userRating,
    averageRating,
    loading,
    error,
    loadRatings,
    addRating
  };
}
