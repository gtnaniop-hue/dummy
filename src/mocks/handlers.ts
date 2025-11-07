import { rest } from 'msw';
import { mockSpecies, mockHabitats, mockRegions } from '../data/mockData';
import { Species, SpeciesFilters } from '../types/species';

const API_BASE_URL = 'http://localhost:3000';

export const handlers = [
  rest.get(`${API_BASE_URL}/species`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 20;
    const search = req.url.searchParams.get('search') || '';
    const habitat = req.url.searchParams.get('habitat') || '';
    const region = req.url.searchParams.get('region') || '';
    const conservationStatus = req.url.searchParams.get('conservationStatus') || '';

    let filteredSpecies = mockSpecies.filter((species: Species) => {
      const matchesSearch = !search || 
        species.name.toLowerCase().includes(search.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        species.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesHabitat = !habitat || species.habitat === habitat;
      const matchesRegion = !region || species.region === region;
      const matchesConservationStatus = !conservationStatus || species.conservationStatus === conservationStatus;

      return matchesSearch && matchesHabitat && matchesRegion && matchesConservationStatus;
    });

    const total = filteredSpecies.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredSpecies.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      })
    );
  }),

  rest.get(`${API_BASE_URL}/species/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const species = mockSpecies.find(s => s.id === id);
    
    if (!species) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Species not found' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(species)
    );
  }),

  rest.get(`${API_BASE_URL}/habitats`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockHabitats)
    );
  }),

  rest.get(`${API_BASE_URL}/regions`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockRegions)
    );
  }),
];