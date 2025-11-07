export interface Species {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  habitat: string;
  region: string;
  imageUrl?: string;
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';
  population?: number;
  lifespan?: string;
  diet?: string;
  size?: {
    length?: string;
    weight?: string;
  };
  threats?: string[];
  facts?: string[];
}

export interface SpeciesFilters {
  search: string;
  habitat: string;
  region: string;
  conservationStatus: string;
}

export interface SpeciesListResponse {
  data: Species[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}