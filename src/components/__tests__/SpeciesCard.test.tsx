import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SpeciesCard } from '../../components/SpeciesCard';
import { Species } from '../../types/species';

const mockSpecies: Species = {
  id: '1',
  name: 'African Elephant',
  scientificName: 'Loxodonta africana',
  description: 'The African elephant is the largest land animal on Earth.',
  habitat: 'Savanna',
  region: 'Africa',
  imageUrl: 'https://example.com/elephant.jpg',
  conservationStatus: 'VU',
  population: 415000,
  lifespan: '60-70 years',
  diet: 'Herbivore',
  size: {
    length: '6-7 meters',
    weight: '6,000-7,000 kg'
  }
};

describe('SpeciesCard', () => {
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders species information correctly', () => {
    render(
      <SpeciesCard
        species={mockSpecies}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('African Elephant')).toBeInTheDocument();
    expect(screen.getByText('Loxodonta africana')).toBeInTheDocument();
    expect(screen.getByText('The African elephant is the largest land animal on Earth.')).toBeInTheDocument();
    expect(screen.getByText('Habitat:')).toBeInTheDocument();
    expect(screen.getByText('Savanna')).toBeInTheDocument();
    expect(screen.getByText('Region:')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
  });

  it('displays conservation status with correct styling', () => {
    render(
      <SpeciesCard
        species={mockSpecies}
        onViewDetails={mockOnViewDetails}
      />
    );

    const statusBadge = screen.getByText('Vulnerable');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('renders species image with correct alt text', () => {
    render(
      <SpeciesCard
        species={mockSpecies}
        onViewDetails={mockOnViewDetails}
      />
    );

    const image = screen.getByAltText('African Elephant');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/elephant.jpg');
  });

  it('renders fallback image when imageUrl is not provided', () => {
    const speciesWithoutImage = { ...mockSpecies };
    delete speciesWithoutImage.imageUrl;

    render(
      <SpeciesCard
        species={speciesWithoutImage}
        onViewDetails={mockOnViewDetails}
      />
    );

    const image = screen.getByAltText('African Elephant');
    expect(image).toHaveAttribute('src', 'https://picsum.photos/seed/species/400/300.jpg');
  });

  it('calls onViewDetails when View Details button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SpeciesCard
        species={mockSpecies}
        onViewDetails={mockOnViewDetails}
      />
    );

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockSpecies);
  });

  it('truncates long descriptions', () => {
    const longDescription = 'A'.repeat(200);
    const speciesWithLongDescription = {
      ...mockSpecies,
      description: longDescription
    };

    render(
      <SpeciesCard
        species={speciesWithLongDescription}
        onViewDetails={mockOnViewDetails}
      />
    );

    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  it('displays correct conservation status labels', () => {
    const testCases = [
      { status: 'LC', label: 'Least Concern' },
      { status: 'NT', label: 'Near Threatened' },
      { status: 'VU', label: 'Vulnerable' },
      { status: 'EN', label: 'Endangered' },
      { status: 'CR', label: 'Critically Endangered' },
      { status: 'EW', label: 'Extinct in Wild' },
      { status: 'EX', label: 'Extinct' }
    ];

    testCases.forEach(({ status, label }) => {
      const { unmount } = render(
        <SpeciesCard
          species={{ ...mockSpecies, conservationStatus: status as any }}
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });
});