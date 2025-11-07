import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { SpeciesCatalog } from '../../components/SpeciesCatalog';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { mockSpecies, mockHabitats, mockRegions } from '../../data/mockData';

const server = setupServer(
  rest.get('http://localhost:3000/species', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 20;
    
    return res(
      ctx.status(200),
      ctx.json({
        data: mockSpecies.slice((page - 1) * limit, page * limit),
        pagination: {
          page,
          limit,
          total: mockSpecies.length,
          totalPages: Math.ceil(mockSpecies.length / limit)
        }
      })
    );
  }),
  rest.get('http://localhost:3000/habitats', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockHabitats));
  }),
  rest.get('http://localhost:3000/regions', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockRegions));
  }),
  rest.get('http://localhost:3000/species/:id', (req, res, ctx) => {
    const { id } = req.params;
    const species = mockSpecies.find(s => s.id === id);
    
    if (!species) {
      return res(ctx.status(404), ctx.json({ error: 'Species not found' }));
    }

    return res(ctx.status(200), ctx.json(species));
  })
);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('SpeciesCatalog Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders catalog with species data', async () => {
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('Species Catalog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
      expect(screen.getByText('Bengal Tiger')).toBeInTheDocument();
    });

    expect(screen.getByText(/Showing \d+ species/)).toBeInTheDocument();
  });

  it('filters species by search term', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search Species');
    await user.type(searchInput, 'Elephant');

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
      expect(screen.queryByText('Bengal Tiger')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/matching "Elephant"/)).toBeInTheDocument();
  });

  it('filters species by habitat', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const habitatSelect = screen.getByLabelText('Habitat');
    await user.selectOptions(habitatSelect, 'Savanna');

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
      expect(screen.queryByText('Blue Whale')).not.toBeInTheDocument();
    });
  });

  it('filters species by region', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const regionSelect = screen.getByLabelText('Region');
    await user.selectOptions(regionSelect, 'Asia');

    await waitFor(() => {
      expect(screen.getByText('Bengal Tiger')).toBeInTheDocument();
      expect(screen.queryByText('African Elephant')).not.toBeInTheDocument();
    });
  });

  it('filters species by conservation status', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText('Conservation Status');
    await user.selectOptions(statusSelect, 'CR');

    await waitFor(() => {
      expect(screen.getByText('Mountain Gorilla')).toBeInTheDocument();
      expect(screen.getByText('Red Wolf')).toBeInTheDocument();
      expect(screen.queryByText('African Elephant')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no species match filters', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search Species');
    await user.type(searchInput, 'NonExistentSpecies');

    await waitFor(() => {
      expect(screen.getByText('No species found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search terms or filters/)).toBeInTheDocument();
    });
  });

  it('opens species detail modal when View Details is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
      expect(screen.getByText('Loxodonta africana')).toBeInTheDocument();
      expect(screen.getByText('Vulnerable')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Loxodonta africana')).not.toBeInTheDocument();
    });
  });

  it('navigates between pages', async () => {
    const user = userEvent.setup();
    
    // Mock a larger dataset for pagination testing
    server.use(
      rest.get('http://localhost:3000/species', (req, res, ctx) => {
        const page = Number(req.url.searchParams.get('page')) || 1;
        const limit = Number(req.url.searchParams.get('limit')) || 2;
        
        return res(
          ctx.status(200),
          ctx.json({
            data: mockSpecies.slice((page - 1) * limit, page * limit),
            pagination: {
              page,
              limit,
              total: mockSpecies.length,
              totalPages: Math.ceil(mockSpecies.length / limit)
            }
          })
        );
      })
    );

    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Blue Whale')).toBeInTheDocument();
    });
  });

  it('clears all filters when Clear All is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('African Elephant')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search Species');
    await user.type(searchInput, 'Elephant');

    await waitFor(() => {
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('http://localhost:3000/species', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    renderWithQueryClient(<SpeciesCatalog />);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to load species data. Please try again.')).toBeInTheDocument();
    });
  });
});