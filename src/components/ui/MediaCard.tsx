import { Calendar, Clock, User } from 'lucide-react';
import type { MediaDTO, MovieDTO, GameDTO } from '../../types/api';
import { getDefaultPosterUrl, formatRuntime, truncateText } from '../../lib/utils';
import { StarRating } from './StarRating';

interface MediaCardProps {
  media: MediaDTO;
  details?: MovieDTO | GameDTO;
  rating?: number;
  onRate?: (rating: number) => void;
  onClick?: () => void;
}

export function MediaCard({ media, details, rating, onRate, onClick }: MediaCardProps) {
  const posterUrl = media.posterUrl || details?.posterUrl || getDefaultPosterUrl();
  
  const isMovie = (details: MovieDTO | GameDTO | undefined): details is MovieDTO => {
    return media.detailsType === 'MOVIE' && details !== undefined && 'director' in details;
  };

  const isGame = (details: MovieDTO | GameDTO | undefined): details is GameDTO => {
    return media.detailsType === 'GAME' && details !== undefined && 'summary' in details;
  };

  return (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={posterUrl}
          alt={media.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultPosterUrl();
          }}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg leading-tight">
          {truncateText(media.name, 50)}
        </h3>
        
        {isMovie(details) && (
          <div className="space-y-1 text-sm text-gray-600">
            {details.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{details.year}</span>
              </div>
            )}
            {details.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatRuntime(details.runtime)}</span>
              </div>
            )}
            {details.director && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{truncateText(details.director, 30)}</span>
              </div>
            )}
          </div>
        )}
        
        {isGame(details) && details.summary && (
          <p className="text-sm text-gray-600">
            {truncateText(details.summary, 100)}
          </p>
        )}
        
        {rating !== undefined && (
          <div className="pt-2 border-t">
            <StarRating
              rating={rating}
              onRatingChange={onRate}
              readonly={!onRate}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}