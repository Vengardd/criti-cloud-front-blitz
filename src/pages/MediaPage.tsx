import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { mediaApi } from '../lib/api';
import type { MediaDTO, MediaType } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SearchInput } from '../components/ui/SearchInput';
import { MediaCard } from '../components/ui/MediaCard';

export function MediaPage() {
  const [media, setMedia] = useState<MediaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showExternal, setShowExternal] = useState(false);

  const loadMedia = async (params: {
    title?: string;
    type?: MediaType;
    external?: boolean;
    page?: number;
  } = {}) => {
    setLoading(true);
    try {
      const results = await mediaApi.search({
        title: params.title || undefined,
        type: params.type || undefined,
        external: params.external,
        page: params.page || 1,
        size: 20
      });
      setMedia(results);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia({
      title: searchQuery || undefined,
      type: selectedType || undefined,
      external: showExternal,
      page: currentPage
    });
  }, [searchQuery, selectedType, showExternal, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: MediaType | '') => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleExternalToggle = () => {
    setShowExternal(!showExternal);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Media</h1>
            <p className="text-gray-600 mt-1">Browse all types of media content</p>
          </div>
          
          <SearchInput
            placeholder="Search media..."
            onSearch={handleSearch}
            className="w-full sm:w-80"
            defaultValue={searchQuery}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as MediaType | '')}
            className="input w-auto min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="MOVIE">Movies</option>
            <option value="SERIES">Series</option>
            <option value="GAME">Games</option>
            <option value="MEDIA">Media</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showExternal}
              onChange={handleExternalToggle}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Include External
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery || selectedType ? 'No media found for your search.' : 'No media available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                onClick={() => {
                  // Navigate to media detail page
                  window.location.href = `/media/${item.id}`;
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-outline px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-600">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={media.length < 20}
              className="btn-outline px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}