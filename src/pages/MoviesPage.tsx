import { useEffect, useState } from 'react';
import { movieApi } from '../lib/api';
import type { MovieDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SearchInput } from '../components/ui/SearchInput';
import { MediaCard } from '../components/ui/MediaCard';

export function MoviesPage() {
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMovies = async (title?: string) => {
    setLoading(true);
    try {
      const results = await movieApi.search(title ? { title } : {});
      setMovies(results);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadMovies(query || undefined);
  };

  const movieToMedia = (movie: MovieDTO) => ({
    id: movie.id,
    name: movie.title,
    posterUrl: movie.posterUrl,
    detailsType: 'MOVIE' as const,
    detailsId: movie.id,
    externalIdType: 'IMBD_ID' as const,
    externalId: movie.imbdId
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
          <p className="text-gray-600 mt-1">Discover and rate your favorite movies</p>
        </div>
        
        <SearchInput
          placeholder="Search movies..."
          onSearch={handleSearch}
          className="w-full sm:w-80"
          defaultValue={searchQuery}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No movies found for your search.' : 'No movies available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              media={movieToMedia(movie)}
              details={movie}
              onClick={() => {
                // Navigate to movie detail page
                window.location.href = `/movies/${movie.id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}