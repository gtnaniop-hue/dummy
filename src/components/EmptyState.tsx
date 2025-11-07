import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  type: 'search' | 'error' | 'general';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto" />;
      default:
        return <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'search':
        return 'No species found';
      case 'error':
        return 'Something went wrong';
      default:
        return 'No species available';
    }
  };

  const getDescription = () => {
    if (message) return message;
    
    switch (type) {
      case 'search':
        return 'Try adjusting your search terms or filters to find what you\'re looking for.';
      case 'error':
        return 'Please try again later or contact support if the problem persists.';
      default:
        return 'Check back later for new species additions.';
    }
  };

  return (
    <div className="text-center py-12">
      {getIcon()}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{getTitle()}</h3>
      <p className="mt-2 text-sm text-gray-500">{getDescription()}</p>
    </div>
  );
}