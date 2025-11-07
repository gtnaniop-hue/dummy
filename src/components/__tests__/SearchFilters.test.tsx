import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SearchFilters } from '../../components/SearchFilters';
import { SpeciesFilters } from '../../types/species';

const mockFilters: SpeciesFilters = {
  search: '',
  habitat: '',
  region: '',
  conservationStatus: ''
};

const mockHabitats = ['Savanna', 'Forest', 'Ocean'];
const mockRegions = ['Africa', 'Asia', 'Europe'];

describe('SearchFilters', () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByLabelText('Search Species')).toBeInTheDocument();
    expect(screen.getByLabelText('Habitat')).toBeInTheDocument();
    expect(screen.getByLabelText('Region')).toBeInTheDocument();
    expect(screen.getByLabelText('Conservation Status')).toBeInTheDocument();
  });

  it('calls onFiltersChange when search input changes', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const searchInput = screen.getByLabelText('Search Species');
    await user.clear(searchInput);
    await user.type(searchInput, 'elephant');

    // Verify that onFiltersChange was called with search value
    expect(mockOnFiltersChange).toHaveBeenCalled();
    const searchCalls = mockOnFiltersChange.mock.calls.filter(call => call[0].search);
    expect(searchCalls.length).toBeGreaterThan(0);
  });

  it('calls onFiltersChange when habitat filter changes', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const habitatSelect = screen.getByLabelText('Habitat');
    await user.selectOptions(habitatSelect, 'Savanna');

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      habitat: 'Savanna'
    });
  });

  it('calls onFiltersChange when region filter changes', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const regionSelect = screen.getByLabelText('Region');
    await user.selectOptions(regionSelect, 'Africa');

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      region: 'Africa'
    });
  });

  it('calls onFiltersChange when conservation status filter changes', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const statusSelect = screen.getByLabelText('Conservation Status');
    await user.selectOptions(statusSelect, 'EN');

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      conservationStatus: 'EN'
    });
  });

  it('shows Clear All button when filters are active', () => {
    const activeFilters = {
      ...mockFilters,
      search: 'elephant'
    };

    render(
      <SearchFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('calls onReset when Clear All button is clicked', async () => {
    const user = userEvent.setup();
    const activeFilters = {
      ...mockFilters,
      search: 'elephant'
    };

    render(
      <SearchFilters
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('populates habitat options correctly', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const habitatOptions = screen.getAllByRole('option', { name: /Savanna|Forest|Ocean/ });
    expect(habitatOptions).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'All Habitats' })).toBeInTheDocument();
  });

  it('populates region options correctly', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        habitats={mockHabitats}
        regions={mockRegions}
        onReset={mockOnReset}
      />
    );

    const regionOptions = screen.getAllByRole('option', { name: /Africa|Asia|Europe/ });
    expect(regionOptions).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'All Regions' })).toBeInTheDocument();
  });
});