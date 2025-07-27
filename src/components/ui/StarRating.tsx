import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
  rating,
  readonly = true,
  onRatingChange,
  size = 'md'
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: { star: 'h-4 w-4', gap: 'gap-1' },
    md: { star: 'h-5 w-5', gap: 'gap-1.5' },
    lg: { star: 'h-7 w-7', gap: 'gap-2' }
  };

  const handleClick = (newRating: number) => {
    if (readonly) return;
    onRatingChange?.(newRating);
  };

  return (
    <div 
      className={`flex items-center ${sizes[size].gap}`}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className={`focus:outline-none transition-transform ${!readonly && 'hover:scale-110'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            disabled={readonly}
          >
            <Star 
              className={`${sizes[size].star} ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors`} 
            />
          </button>
        );
      })}
    </div>
  );
}