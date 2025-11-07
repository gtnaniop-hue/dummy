import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MapPinIcon, ScaleIcon, ClockIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { Species } from '../types/species';

interface SpeciesDetailModalProps {
  species: Species | null;
  isOpen: boolean;
  onClose: () => void;
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

export function SpeciesDetailModal({ species, isOpen, onClose }: SpeciesDetailModalProps) {
  if (!species) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  <img
                    src={species.imageUrl || 'https://picsum.photos/seed/species/800/400.jpg'}
                    alt={species.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-gray-900">
                        {species.name}
                      </Dialog.Title>
                      <p className="text-lg text-gray-600 italic mt-1">{species.scientificName}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${conservationStatusColors[species.conservationStatus]}`}>
                      {conservationStatusLabels[species.conservationStatus]}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{species.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Habitat & Region</h4>
                          <p className="text-gray-600">{species.habitat} • {species.region}</p>
                        </div>
                      </div>

                      {species.lifespan && (
                        <div className="flex items-start space-x-3">
                          <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Lifespan</h4>
                            <p className="text-gray-600">{species.lifespan}</p>
                          </div>
                        </div>
                      )}

                      {species.diet && (
                        <div className="flex items-start space-x-3">
                          <BeakerIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Diet</h4>
                            <p className="text-gray-600">{species.diet}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {species.size && (
                        <div className="flex items-start space-x-3">
                          <ScaleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Size</h4>
                            {species.size.length && (
                              <p className="text-gray-600">Length: {species.size.length}</p>
                            )}
                            {species.size.weight && (
                              <p className="text-gray-600">Weight: {species.size.weight}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {species.population && (
                        <div className="flex items-start space-x-3">
                          <div className="h-5 w-5 text-gray-400 mt-0.5 flex items-center justify-center">
                            <span className="text-sm font-bold">👥</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Population</h4>
                            <p className="text-gray-600">{species.population.toLocaleString()} individuals</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {species.threats && species.threats.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Threats</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {species.threats.map((threat, index) => (
                          <li key={index} className="text-gray-600">{threat}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {species.facts && species.facts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Interesting Facts</h4>
                      <ul className="space-y-2">
                        {species.facts.map((fact, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-600">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}