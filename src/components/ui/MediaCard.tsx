import { Calendar, Clock, User, ExternalLink } from 'lucide-react';
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

  const getTypeBadge = () => {
    switch (media.detailsType) {
      case 'MOVIE':
        return 'badge-movie';
      case 'GAME':
        return 'badge-game';
      case 'SERIES':
        return 'badge-series';
      default:
        return 'badge-default';
    }
  };

  return (
    <div 
      className="group cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
        <img
          src={posterUrl}
          alt={media.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultPosterUrl();
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${getTypeBadge()}`}>
            {media.detailsType}
          </span>
        </div>

        {/* External ID Badge */}
        {media.externalId && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1 backdrop-blur-sm">
              <ExternalLink className="h-3 w-3" />
              {media.externalIdType === 'IMBD_ID' ? 'IMDB' : 'IGDB'}
            </div>
          </div>
        )}

        {/* Hover content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="font-semibold text-sm mb-1 line-clamp-2">
            {media.name}
          </h4>
          {isMovie(details) && details.year && (
            <p className="text-xs text-white/80">{details.year}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-3 px-1">
        <h3 className="font-semibold text-lg leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {truncateText(media.name, 50)}
        </h3>
        
        {isMovie(details) && (
          <div className="space-y-2 text-sm text-slate-600">
            {details.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-blue-500" />
                <span>{details.year}</span>
              </div>
            )}
            {details.runtime && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-green-500" />
                <span>{formatRuntime(details.runtime)}</span>
              </div>
            )}
            {details.director && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-purple-500" />
                <span className="line-clamp-1">{truncateText(details.director, 25)}</span>
              </div>
            )}
          </div>
        )}
        
        {isGame(details) && details.summary && (
          <p className="text-sm text-slate-600 line-clamp-3">
            {truncateText(details.summary, 100)}
          </p>
        )}
        
        {rating !== undefined && (
          <div className="pt-3 border-t border-slate-200">
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