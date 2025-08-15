import {useEffect, useState} from 'react';
import {seriesApi} from '../lib/api';
import type {SeriesDTO} from '../types/api';
import {LoadingSpinner} from '../components/ui/LoadingSpinner';
import {SearchInput} from '../components/ui/SearchInput';
import {MediaCard} from '../components/ui/MediaCard';

export function SeriesPage() {
    const [series, setSeries] = useState<SeriesDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const loadSeries = async (title?: string) => {
        setLoading(true);
        try {
            const results = await seriesApi.search(title ? {title} : {});
            setSeries(results);
        } catch (error) {
            console.error('Failed to load series:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSeries();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        loadSeries(query || undefined);
    };

    const seriesToMedia = (series: SeriesDTO) => ({
        id: series.id,
        name: series.title,
        posterUrl: series.posterUrl,
        detailsType: 'SERIES' as const,
        detailsId: series.id,
        externalIdType: 'IMBD_ID' as const,
        externalId: series.imbdId
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
                    <p className="text-gray-600 mt-1">Discover and rate your favorite series</p>
                </div>

                <SearchInput
                    placeholder="Search series..."
                    onSearch={handleSearch}
                    className="w-full sm:w-80"
                    defaultValue={searchQuery}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg"/>
                </div>
            ) : series.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {searchQuery ? 'No series found for your search.' : 'No series available.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {series.map((series) => (
                        <MediaCard
                            key={series.id}
                            media={seriesToMedia(series)}
                            details={series}
                            onClick={() => {
                                // Navigate to movie detail page
                                const seriesId = series.imbdId || series.id;
                                window.location.href = `/series/${seriesId}`;
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}