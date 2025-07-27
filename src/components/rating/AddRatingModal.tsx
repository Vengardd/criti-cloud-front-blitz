import { useState } from 'react';
import { X } from 'lucide-react';
import {MediaDTO, NewRatingRequestDTO, RatingDTO} from '../../types/api';
import { ratingApi } from '../../lib/api';
import { StarRatingInput } from '../ui/StarRatingInput';
import { useAuth } from '../../contexts/AuthContext';

interface AddRatingModalProps {
  media: MediaDTO;
  onClose: () => void;
  onSuccess: (rating: RatingDTO) => void;
}

export function AddRatingModal({ media, onClose, onSuccess }: AddRatingModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!user) {
      setError('You must be logged in to rate media');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newRating: NewRatingRequestDTO = {
        mediaId: media.id || 'null',
        rating: rating,
        source: 'APP'
      };

      const createdRating = await ratingApi.create(newRating);
      onSuccess(createdRating);
      onClose();
    } catch (err) {
      console.error('Failed to add rating:', err);
      setError('Failed to add rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Rate {media.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center py-4">
            <StarRatingInput 
              onChange={setRating}
              initialRating={1}
              size="lg"
            />
            <p className="mt-2 text-gray-600">
              {rating === 0 ? 'Select a rating' : `Your rating: ${rating}/5`}
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
