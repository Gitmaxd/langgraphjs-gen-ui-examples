import { FC } from 'react';

type SearchProps = {
  query: string;
  isSearching?: boolean;
};

export const Search: FC<SearchProps> = ({ 
  query, 
  isSearching = false 
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        {isSearching && (
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        )}
        <h3 className="text-lg font-medium">
          {isSearching 
            ? `Searching for "${query}"...` 
            : `Preparing to search for "${query}"`}
        </h3>
      </div>
    </div>
  );
};

export default Search;
