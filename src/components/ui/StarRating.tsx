import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();

  const sizes = {
    sm: { star: 'h-4 w-4', gap: 'gap-1' },
    md: { star: 'h-5 w-5', gap: 'gap-1.5' },
    lg: { star: 'h-7 w-7', gap: 'gap-2' }
  };

  const handleClick = (newRating: number, isHalf: boolean) => {
    if (readonly) return;
    if (!isAuthenticated) {
      alert('Please log in to rate content');
      return;
    }
    const finalRating = isHalf ? newRating - 0.5 : newRating;
    onRatingChange?.(finalRating);
  };

  const renderStar = (value: number) => {
    const isActive = value <= Math.floor(hoverRating || rating);
    const hasHalf = !isActive && (value - 0.5) <= (hoverRating || rating);

    return (
      <div 
        key={value}
        className="relative"
        onMouseMove={(e) => {
          if (!readonly) {
            const rect = e.currentTarget.getBoundingClientRect();
            const isHalf = (e.clientX - rect.left) < rect.width / 2;
            setHoverRating(isHalf ? value - 0.5 : value);
          }
        }}
      >
        <button
          type="button"
          className={`focus:outline-none transition-transform ${!readonly && 'hover:scale-110'}`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const isHalf = (e.clientX - rect.left) < rect.width / 2;
            handleClick(value, isHalf);
          }}
          disabled={readonly}
        >
          {hasHalf ? (
            <StarHalf
              className={`${sizes[size].star} text-yellow-400 fill-[#facc15] transition-colors`}
            />
          ) : (
            <Star 
              className={`${sizes[size].star} ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors`}
            />
          )}
        </button>
      </div>
    );
  };

  return (
    <div 
      className={`flex items-center ${sizes[size].gap}`}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => renderStar(star))}
    </div>
  );
}