import { Calendar, Clock, User, Star, ExternalLink } from 'lucide-react';
import type { MediaDTO } from '../../types/api';
import { getDefaultPosterUrl, truncateText } from '../../lib/utils';

interface MediaDisplayCardProps {
  media: MediaDTO;
  onClick?: () => void;
}

export function MediaDisplayCard({ media, onClick }: MediaDisplayCardProps) {
  const posterUrl = media.posterUrl || getDefaultPosterUrl();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MOVIE':
        return 'bg-blue-100 text-blue-800';
      case 'GAME':
        return 'bg-green-100 text-green-800';
      case 'SERIES':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-100 relative">
        <img
          src={posterUrl}
          alt={media.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultPosterUrl();
          }}
        />
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(media.detailsType)}`}>
            {media.detailsType}
          </span>
        </div>

        {/* External ID Badge */}
        {media.externalId && (
          <div className="absolute top-2 right-2">
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {media.externalIdType === 'IMBD_ID' ? 'IMDB' : 'IGDB'}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary-600 transition-colors">
          {truncateText(media.name, 50)}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>ID: {media.id?.slice(0, 8)}...</span>
          {media.detailsId && (
            <span>Details: {media.detailsId.slice(0, 8)}...</span>
          )}
        </div>

        {media.externalId && (
          <div className="text-xs text-gray-500">
            External ID: {truncateText(media.externalId, 20)}
          </div>
        )}
      </div>
    </div>
  );
}