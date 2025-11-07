import { Species, SpeciesFilters, SpeciesListResponse } from '../types/species';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class SpeciesApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getSpecies(
    page: number = 1,
    limit: number = 20,
    filters: Partial<SpeciesFilters> = {}
  ): Promise<SpeciesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.habitat && { habitat: filters.habitat }),
      ...(filters.region && { region: filters.region }),
      ...(filters.conservationStatus && { conservationStatus: filters.conservationStatus }),
    });

    const response = await fetch(`${this.baseUrl}/species?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch species: ${response.statusText}`);
    }

    return response.json();
  }

  async getSpeciesById(id: string): Promise<Species> {
    const response = await fetch(`${this.baseUrl}/species/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch species: ${response.statusText}`);
    }

    return response.json();
  }

  async getHabitats(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/habitats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch habitats: ${response.statusText}`);
    }

    return response.json();
  }

  async getRegions(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/regions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch regions: ${response.statusText}`);
    }

    return response.json();
  }
}

export const speciesApi = new SpeciesApiService();