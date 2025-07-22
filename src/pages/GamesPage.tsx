import { useEffect, useState } from 'react';
import { gameApi } from '../lib/api';
import type { GameDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SearchInput } from '../components/ui/SearchInput';
import { MediaCard } from '../components/ui/MediaCard';

export function GamesPage() {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadGames = async (title?: string) => {
    setLoading(true);
    try {
      const results = await gameApi.search(title ? { title } : {});
      setGames(results);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadGames(query || undefined);
  };

  const gameToMedia = (game: GameDTO) => ({
    id: game.id,
    name: game.title,
    posterUrl: game.posterUrl,
    detailsType: 'GAME' as const,
    detailsId: game.id,
    externalIdType: 'IGDB_ID' as const,
    externalId: game.igdbId
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games</h1>
          <p className="text-gray-600 mt-1">Explore and review video games</p>
        </div>
        
        <SearchInput
          placeholder="Search games..."
          onSearch={handleSearch}
          className="w-full sm:w-80"
          defaultValue={searchQuery}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No games found for your search.' : 'No games available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {games.map((game) => (
            <MediaCard
              key={game.id}
              media={gameToMedia(game)}
              details={game}
              onClick={() => {
                // Navigate to game detail page
                window.location.href = `/games/${game.id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}