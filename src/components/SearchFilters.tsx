import { SpeciesFilters } from '../types/species';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  filters: SpeciesFilters;
  onFiltersChange: (filters: SpeciesFilters) => void;
  habitats: string[];
  regions: string[];
  onReset: () => void;
}

const conservationStatusOptions = [
  { value: '', label: 'All Status' },
  { value: 'LC', label: 'Least Concern' },
  { value: 'NT', label: 'Near Threatened' },
  { value: 'VU', label: 'Vulnerable' },
  { value: 'EN', label: 'Endangered' },
  { value: 'CR', label: 'Critically Endangered' },
  { value: 'EW', label: 'Extinct in Wild' },
  { value: 'EX', label: 'Extinct' }
];

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  habitats, 
  regions, 
  onReset 
}: SearchFiltersProps) {
  const handleFilterChange = (field: keyof SpeciesFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const hasActiveFilters = filters.search || filters.habitat || filters.region || filters.conservationStatus;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Species
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, scientific name, or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Habitat Filter */}
          <div>
            <label htmlFor="habitat" className="block text-sm font-medium text-gray-700 mb-1">
              Habitat
            </label>
            <select
              id="habitat"
              value={filters.habitat}
              onChange={(e) => handleFilterChange('habitat', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Habitats</option>
              {habitats.map((habitat) => (
                <option key={habitat} value={habitat}>
                  {habitat}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Conservation Status Filter */}
          <div>
            <label htmlFor="conservationStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Conservation Status
            </label>
            <select
              id="conservationStatus"
              value={filters.conservationStatus}
              onChange={(e) => handleFilterChange('conservationStatus', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {conservationStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}