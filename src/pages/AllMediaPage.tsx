import { useEffect, useState } from 'react';
import { Filter, Film, Gamepad2, Monitor, Search, Globe, Database } from 'lucide-react';
import { mediaApi } from '../lib/api';
import type { MediaDTO, MediaType } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SearchInput } from '../components/ui/SearchInput';
import { MediaDisplayCard } from '../components/ui/MediaDisplayCard';

export function AllMediaPage() {
  const [media, setMedia] = useState<MediaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMode, setSearchMode] = useState<'internal' | 'external'>('internal');

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
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset type selection when switching to internal mode
    if (searchMode === 'internal' && selectedType && !['MOVIE', 'GAME', 'MEDIA'].includes(selectedType)) {
      setSelectedType('');
    }
    
    // For external search, ensure a specific type is selected
    if (searchMode === 'external' && (!selectedType || selectedType === 'MEDIA')) {
      return; // Don't search until user selects Movie or Game for external search
    }
    
    loadMedia({
      title: searchQuery || undefined,
      type: selectedType || undefined,
      external: searchMode === 'external',
      page: currentPage
    });
  }, [searchQuery, selectedType, searchMode, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: MediaType | '') => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleSearchModeChange = (mode: 'internal' | 'external') => {
    setSearchMode(mode);
    setCurrentPage(1);
    
    // Reset type selection when switching modes
    if (mode === 'external' && (!selectedType || selectedType === 'MEDIA')) {
      setSelectedType('MOVIE'); // Default to Movie for external search
    } else if (mode === 'internal') {
      // Keep current selection for internal search
    }
  };

  const getAvailableTypes = () => {
    if (searchMode === 'external') {
      return [
        { value: 'MOVIE', label: 'Movies' },
        { value: 'GAME', label: 'Games' }
      ];
    } else {
      return [
        { value: '', label: 'All Types' },
        { value: 'MOVIE', label: 'Movies' },
        { value: 'GAME', label: 'Games' },
        { value: 'MEDIA', label: 'Media' }
      ];
    }
  };

  const canSearch = () => {
    if (searchMode === 'internal') {
      return true; // Internal search always works
    } else {
      return selectedType === 'MOVIE' || selectedType === 'GAME'; // External requires specific type
    }
    setCurrentPage(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOVIE':
        return Film;
      case 'GAME':
        return Gamepad2;
      default:
        return Monitor;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MOVIE':
        return 'bg-blue-500';
      case 'GAME':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  const groupedMedia = media.reduce((acc, item) => {
    const type = item.detailsType || 'MEDIA';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {} as Record<string, MediaDTO[]>);

  return (
    <div className="space-y-8">
      <div className="card-glass p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="section-title mb-2">All Media</h1>
            <p className="text-slate-600 text-lg">
              {searchMode === 'internal' 
                ? 'Browse media from our internal database' 
                : 'Search external databases for new content'
              }
            </p>
          </div>
          
          <SearchInput
            placeholder={searchMode === 'internal' ? 'Search internal media...' : 'Search external databases...'}
            onSearch={handleSearch}
            className="w-full sm:w-80"
            defaultValue={searchQuery}
          />
        </div>

        {/* Search Mode Toggle */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Search Mode:</span>
            <div className="flex bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-1">
              <button
                onClick={() => handleSearchModeChange('internal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchMode === 'internal'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Database className="h-4 w-4" />
                Internal Database
              </button>
              <button
                onClick={() => handleSearchModeChange('external')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchMode === 'external'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Globe className="h-4 w-4" />
                External Search
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Content Type:</span>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value as MediaType | '')}
              className="input w-auto min-w-[140px]"
            >
              {getAvailableTypes().map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {searchMode === 'external' && (!selectedType || selectedType === 'MEDIA') && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm text-yellow-700 font-medium">
                  ⚠️ Please select Movies or Games for external search
                </span>
              </div>
            )}

            {searchMode === 'internal' && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Database className="h-4 w-4" />
                <span>Searching internal database</span>
              </div>
            )}

            {searchMode === 'external' && canSearch() && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Globe className="h-4 w-4" />
                <span>Searching external {selectedType?.toLowerCase()} databases</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!canSearch() ? (
        <div className="text-center py-12 card">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">External Search Configuration</h3>
          <p className="text-slate-500 mb-4">
            To search external databases, please select either <strong>Movies</strong> or <strong>Games</strong> from the content type filter above.
          </p>
          <p className="text-sm text-slate-400">
            External search requires a specific content type to query the appropriate databases (IMDB for movies, IGDB for games).
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-500">
              {searchMode === 'internal' ? 'Loading from internal database...' : 'Searching external databases...'}
            </p>
          </div>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 card">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Found</h3>
          <p className="text-slate-500 mb-4">
            {searchQuery || selectedType 
              ? `No ${searchMode} media found for your search criteria.` 
              : `No ${searchMode} media available.`
            }
          </p>
          {searchMode === 'internal' && searchQuery && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Can't find what you're looking for?</p>
              <button
                onClick={() => handleSearchModeChange('external')}
                className="btn-outline text-sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                Try External Search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMedia).map(([type, items]) => {
            const Icon = getTypeIcon(type);
            const colorClass = getTypeColor(type);
            
            return (
              <div key={type} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${colorClass} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    {type === 'MOVIE' ? 'Movies' : type === 'GAME' ? 'Games' : 'Media'}
                  </h2>
                  <span className="badge badge-default text-base px-4 py-2">
                    {items.length} items
                  </span>
                  {searchMode === 'external' && (
                    <span className="badge bg-green-100 text-green-800 text-sm px-3 py-1">
                      External Results
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="media-card p-0 overflow-hidden">
                      <MediaDisplayCard
                      media={item}
                      onClick={() => {
                        // Navigate to specific detail page based on type
                        if (item.detailsType === 'MOVIE') {
                          window.location.href = `/movie/${item.externalId || item.detailsId || item.id}`;
                        } else if (item.detailsType === 'GAME') {
                          window.location.href = `/game/${item.externalId || item.detailsId || item.id}`;
                        } else {
                          window.location.href = `/media/${item.id}`;
                        }
                      }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-outline px-6 py-3 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-6 py-3 text-sm font-medium text-slate-600 bg-white/60 backdrop-blur-sm rounded-xl">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={media.length < 20}
              className="btn-outline px-6 py-3 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}