import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Species, SpeciesFilters, SpeciesListResponse } from '../types/species';
import { speciesApi } from '../services/speciesApi';
import { SpeciesCard } from './SpeciesCard';
import { SearchFilters } from './SearchFilters';
import { Pagination } from './Pagination';
import { SpeciesDetailModal } from './SpeciesDetailModal';
import { LoadingSpinner, LoadingCard } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

const ITEMS_PER_PAGE = 12;

export function SpeciesCatalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SpeciesFilters>({
    search: '',
    habitat: '',
    region: '',
    conservationStatus: ''
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Fetch species data
  const { 
    data: speciesData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<SpeciesListResponse>({
    queryKey: ['species', currentPage, filters],
    queryFn: () => speciesApi.getSpecies(currentPage, ITEMS_PER_PAGE, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch filter options
  const { data: habitats = [] } = useQuery({
    queryKey: ['habitats'],
    queryFn: () => speciesApi.getHabitats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => speciesApi.getRegions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleFilterChange = (newFilters: SpeciesFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      habitat: '',
      region: '',
      conservationStatus: ''
    });
  };

  const handleViewDetails = (species: Species) => {
    setSelectedSpecies(species);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpecies(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState 
          type="error" 
          message="Failed to load species data. Please try again."
        />
      );
    }

    if (!speciesData?.data || speciesData.data.length === 0) {
      return (
        <EmptyState 
          type={filters.search || filters.habitat || filters.region || filters.conservationStatus ? 'search' : 'general'}
        />
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {speciesData.data.map((species) => (
            <SpeciesCard
              key={species.id}
              species={species}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {speciesData.pagination && (
          <Pagination
            currentPage={speciesData.pagination.page}
            totalPages={speciesData.pagination.totalPages}
            totalItems={speciesData.pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Species Catalog</h1>
          <p className="text-lg text-gray-600">
            Explore our comprehensive database of wildlife species from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            habitats={habitats}
            regions={regions}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results Header */}
        {speciesData && !isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {speciesData.pagination.total} species
              {filters.search && ` matching "${filters.search}"`}
              {(filters.habitat || filters.region || filters.conservationStatus) && (
                <span> with applied filters</span>
              )}
            </div>
            <button
              onClick={() => refetch()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Content */}
        {renderContent()}

        {/* Detail Modal */}
        <SpeciesDetailModal
          species={selectedSpecies}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}