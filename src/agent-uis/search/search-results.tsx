import { FC } from 'react';

type SearchResult = {
  title: string;
  url: string;
  content: string;
  image?: string;
};

type SearchResultsProps = {
  results: SearchResult[];
  query: string;
  isGenerating?: boolean;
  isSearching?: boolean;
  error?: string;
};

export const SearchResults: FC<SearchResultsProps> = ({ 
  results, 
  query, 
  isGenerating = false,
  isSearching = false,
  error
}) => {
  if (isSearching || isGenerating) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <h3 className="text-lg font-medium">Searching for "{query}"...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Search error</h3>
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
        <p className="text-gray-500 dark:text-gray-400">Please try a different search query.</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium">No results found for "{query}"</h3>
        <p className="text-gray-500 dark:text-gray-400">Try a different search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Search results for "{query}"</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{results.length} results</span>
      </div>
      
      <div className="grid gap-4">
        {results.map((result, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {result.image && (
                <div className="flex-shrink-0 w-full md:w-32 h-24 overflow-hidden rounded-md">
                  <img 
                    src={result.image} 
                    alt={result.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-1">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {result.title}
                </a>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {result.url}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {result.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        Search powered by Tavily
      </div>
    </div>
  );
};

export default SearchResults;
