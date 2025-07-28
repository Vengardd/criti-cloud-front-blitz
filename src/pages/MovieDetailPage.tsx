import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Star } from 'lucide-react';
import { movieApi, ratingApi, mediaApi } from '../lib/api';
import type { MovieDTO, RatingDTO, MediaDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RatingSection } from '../components/rating/RatingSection';
import { getDefaultPosterUrl, formatRuntime } from '../lib/utils';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDTO | null>(null);
  const [mediaItem, setMediaItem] = useState<MediaDTO | null>(null);
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Try to get movie data
        let movieData: MovieDTO;
        
        if (id.startsWith('tt')) {
          // IMDB ID - search by imbdId
          const movies = await movieApi.search({ imbdId: id });
          if (movies.length === 0) {
            throw new Error('Movie not found');
          }
          movieData = movies[0];
        } else {
          // Internal ID
          movieData = await movieApi.getById(id);
        }
        
        setMovie(movieData);
        
        // Try to find the corresponding media item
        try {
          const mediaResults = await mediaApi.search({ 
            type: 'MOVIE',
            title: movieData.title 
          });
          
          // Find media item that matches this movie
          const matchingMedia = mediaResults.find(media => 
            media.externalId === movieData.imbdId || 
            media.detailsId === movieData.id ||
            media.name === movieData.title
          );
          
          if (matchingMedia) {
            setMediaItem(matchingMedia);
            
            // Load ratings for the media item
            setRatingsLoading(true);
            try {
              const movieRatings = await ratingApi.search({ mediaId: matchingMedia.id });
              setRatings(movieRatings);
            } catch (error) {
              console.error('Failed to load ratings:', error);
            } finally {
              setRatingsLoading(false);
            }
          }
        } catch (error) {
          console.error('Failed to find media item:', error);
        }
        
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Movie not found.</p>
        <Link to="/all-media" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          ← Back to Media
        </Link>
      </div>
    );
  }

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link 
        to="/all-media" 
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Media
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <img
              src={movie.posterUrl || getDefaultPosterUrl()}
              alt={movie.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultPosterUrl();
              }}
            />
          </div>
        </div>

        {/* Movie Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              {movie.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.director && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{movie.director}</span>
                </div>
              )}
            </div>

            {/* Average Rating */}
            {ratings.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">
                  Based on {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Plot */}
          {movie.plot && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Plot</h2>
              <p className="text-gray-700 leading-relaxed">{movie.plot}</p>
            </div>
          )}

          {/* Ratings Section */}
          {ratingsLoading ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Ratings</h2>
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            </div>
          ) : !mediaItem ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Ratings</h2>
              <p className="text-gray-500">No media item found for this movie. Ratings are not available.</p>
            </div>
          ) : (
            <RatingSection media={mediaItem} initialRatings={ratings} />
          )}
          </div>
        </div>
      </div>
  );
}