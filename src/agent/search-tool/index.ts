import { z } from 'zod';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// Schema for search parameters
export const TavilySearchSchema = z.object({
  query: z.string().describe('The search query to use'),
  includeImages: z.boolean().optional().describe('Whether to include images in the search results'),
  searchDepth: z.enum(['basic', 'advanced']).optional().describe('The depth of the search'),
  maxResults: z.number().optional().describe('Maximum number of results to return'),
});

export type TavilySearchParams = z.infer<typeof TavilySearchSchema>;

// Create a Tavily search tool instance
export const createTavilySearchTool = () => {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY environment variable is not set');
  }
  
  return new TavilySearchResults({
    apiKey,
    maxResults: 5,
    includeImages: true,
  });
};

// Execute a search with the Tavily tool
export const executeSearch = async (params: TavilySearchParams) => {
  const tool = createTavilySearchTool();
  
  try {
    const results = await tool.invoke(params.query);
    return results;
  } catch (error) {
    console.error('Error searching with Tavily:', error);
    throw error;
  }
};
