import { Species } from '../types/species';
import { EyeIcon } from '@heroicons/react/24/outline';

interface SpeciesCardProps {
  species: Species;
  onViewDetails: (species: Species) => void;
}

const conservationStatusColors = {
  'LC': 'bg-green-100 text-green-800',
  'NT': 'bg-yellow-100 text-yellow-800',
  'VU': 'bg-orange-100 text-orange-800',
  'EN': 'bg-red-100 text-red-800',
  'CR': 'bg-red-200 text-red-900',
  'EW': 'bg-gray-100 text-gray-800',
  'EX': 'bg-black text-white'
};

const conservationStatusLabels = {
  'LC': 'Least Concern',
  'NT': 'Near Threatened',
  'VU': 'Vulnerable',
  'EN': 'Endangered',
  'CR': 'Critically Endangered',
  'EW': 'Extinct in Wild',
  'EX': 'Extinct'
};

export function SpeciesCard({ species, onViewDetails }: SpeciesCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-12">
        <img
          src={species.imageUrl || 'https://picsum.photos/seed/species/400/300.jpg'}
          alt={species.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{species.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${conservationStatusColors[species.conservationStatus]}`}>
            {conservationStatusLabels[species.conservationStatus]}
          </span>
        </div>
        <p className="text-sm text-gray-600 italic mb-2">{species.scientificName}</p>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{species.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <strong>Habitat:</strong> {species.habitat}
          </span>
          <span className="flex items-center">
            <strong>Region:</strong> {species.region}
          </span>
        </div>
        <button
          onClick={() => onViewDetails(species)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  );
}