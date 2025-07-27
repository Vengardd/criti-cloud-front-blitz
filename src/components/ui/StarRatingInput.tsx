import { useState } from 'react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  initialRating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRatingInput({
  initialRating,
  onChange,
  size = 'md'
}: StarRatingInputProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating: number) => {
    setRating(newRating);
    onChange(newRating);
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div 
      className="flex items-center gap-2"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHoverRating(value)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`${sizes[size]} ${value <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
interface StarRatingInputProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function StarRatingInput({
  initialRating = 0,
  onChange,
  size = 'md',
  disabled = false
}: StarRatingInputProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: { star: 'h-4 w-4', gap: 'gap-1' },
    md: { star: 'h-5 w-5', gap: 'gap-1.5' },
    lg: { star: 'h-7 w-7', gap: 'gap-2' }
  };

  const handleClick = (newRating: number) => {
    if (disabled) return;
    setRating(newRating);
    onChange(newRating);
  };

  return (
    <div 
      className={`flex items-center ${sizes[size].gap} ${disabled ? 'opacity-70' : ''}`}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className={`focus:outline-none transition-transform ${!disabled && 'hover:scale-110'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            disabled={disabled}
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
