# Species Catalog

A modern, responsive web application for browsing and exploring wildlife species from around the world.

## Features

- **Search & Filtering**: Search species by name, scientific name, or description. Filter by habitat, region, and conservation status.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Species Details**: Detailed modal view with comprehensive species information including habitat, diet, population, and conservation threats.
- **Pagination**: Efficient pagination for handling large datasets.
- **Loading States**: Skeleton loaders and empty states for better user experience.
- **Comprehensive Testing**: Full test coverage for components and integration scenarios.

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: Headless UI + Heroicons
- **Testing**: Vitest + React Testing Library + MSW
- **API Integration**: RESTful API with mock service workers for development

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:ui
```

Run tests once:
```bash
npm run test:run
```

## API Integration

The application is designed to work with a RESTful API with the following endpoints:

- `GET /species` - Get paginated list of species with filtering support
- `GET /species/:id` - Get detailed information about a specific species
- `GET /habitats` - Get list of available habitats
- `GET /regions` - Get list of available regions

### Query Parameters for `/species`

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term for name, scientific name, or description
- `habitat` (string): Filter by habitat
- `region` (string): Filter by region
- `conservationStatus` (string): Filter by conservation status (LC, NT, VU, EN, CR, EW, EX)

## Component Structure

```
src/
├── components/
│   ├── SpeciesCatalog.tsx      # Main catalog component
│   ├── SpeciesCard.tsx         # Individual species card
│   ├── SearchFilters.tsx       # Search and filter controls
│   ├── Pagination.tsx          # Pagination component
│   ├── SpeciesDetailModal.tsx   # Species detail modal
│   ├── LoadingSpinner.tsx      # Loading states
│   └── EmptyState.tsx          # Empty state component
├── services/
│   └── speciesApi.ts           # API service layer
├── types/
│   └── species.ts              # TypeScript type definitions
├── data/
│   └── mockData.ts             # Mock data for development
├── mocks/
│   ├── handlers.ts             # MSW API handlers
│   └── browser.ts              # MSW browser setup
└── components/__tests__/       # Component tests
```

## Conservation Status Categories

- **LC** - Least Concern
- **NT** - Near Threatened
- **VU** - Vulnerable
- **EN** - Endangered
- **CR** - Critically Endangered
- **EW** - Extinct in Wild
- **EX** - Extinct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.