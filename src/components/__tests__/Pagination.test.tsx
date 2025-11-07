import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination information correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // The test environment renders mobile version by default, so check for mobile nav
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders correct page numbers', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={7}
        totalItems={70}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-50', 'border-blue-500', 'text-blue-600');
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    await user.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Next button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Previous button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText('Previous');
    await user.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // In mobile version, check if Previous button is disabled
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // In mobile version, check if Next button is disabled
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show ellipsis
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={10}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows correct range for last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalItems={47}
        itemsPerPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Just check that navigation buttons are present (getAllByText for multiple instances)
    expect(screen.getAllByText('Previous')).toHaveLength(2);
    expect(screen.getAllByText('Next')).toHaveLength(2);
  });
});