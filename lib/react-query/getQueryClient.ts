import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance with optimized defaults for server-side prefetching
 * Use this in Server Components for prefetching data
 */
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 60 seconds
        staleTime: 60 * 1000,
        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests once
        retry: 1,
        // Don't refetch on mount if data is already cached
        refetchOnMount: false,
        // Don't refetch when window regains focus
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Only dehydrate successful queries
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}
