import { Star, StarHalf } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();

  const handleClick = (newRating: number, isHalf: boolean) => {
    if (!isAuthenticated) {
      alert('Please log in to rate content');
      return;
    }
    const finalRating = isHalf ? newRating - 0.5 : newRating;
    setRating(finalRating);
    onChange(finalRating);
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const renderStar = (value: number) => {
    const isActive = value <= Math.floor(hoverRating || rating);
    const hasHalf = !isActive && (value - 0.5) <= (hoverRating || rating);

    return (
      <div 
        key={value}
        className="relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const isHalf = (e.clientX - rect.left) < rect.width / 2;
          setHoverRating(isHalf ? value - 0.5 : value);
        }}
      >
        <button
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const isHalf = (e.clientX - rect.left) < rect.width / 2;
            handleClick(value, isHalf);
          }}
        >
          {hasHalf ? (
            <StarHalf
              className={`${sizes[size]} text-yellow-400 fill-[#facc15] transition-colors`}
            />
          ) : (
            <Star
              className={`${sizes[size]} ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors`}
            />
          )}
        </button>
      </div>
    );
  };

  return (
    <div 
      className="flex items-center gap-2"
      onMouseLeave={() => setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => renderStar(value))}
    </div>
  );
}
