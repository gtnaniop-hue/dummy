import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeciesCatalog } from './components/SpeciesCatalog';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpeciesCatalog />
    </QueryClientProvider>
  );
}

export default App;