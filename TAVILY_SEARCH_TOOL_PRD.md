# Tavily Search Tool Integration PRD

## Overview

This document outlines the implementation plan for integrating the Tavily search tool into our LangGraph-based agent system. The Tavily search tool will be used exclusively by a new dedicated search agent, enhancing our system's ability to provide up-to-date information and relevant results to users.

## Background

Our current agent system incorporates various specialized tools and agents (writer, email, chat) but lacks real-time web search capabilities. Adding a dedicated search agent powered by the Tavily search tool will significantly enhance our system by providing access to current information from the web.

## Goals

1. Implement a dedicated Tavily search agent that exclusively uses the search tool
2. Create a clean UI component for displaying search results
3. Ensure proper error handling and rate limiting for API calls
4. Add appropriate documentation for developers

## Technical Requirements

### Dependencies

```bash
pnpm add @langchain/langgraph langchain @tavily/core
```

### Environment Configuration

- Add `TAVILY_API_KEY` to the `.env` file
- Update `.env.example` to document this requirement
- Update any configuration documentation

### Implementation Components

1. **Tavily Search Tool**
   - Create a new file at `src/agent/search-tool/index.ts` that implements the Tavily search tool
   - Use Zod for type validation of search parameters
   - Support all Tavily search parameters (includeImages, searchDepth, etc.)
   - This tool will be used exclusively by the search agent

2. **Search Agent**
   - Create a new dedicated agent implementation at `src/agent/search-agent/index.ts`
   - Implement a graph with nodes for:
     - Preparing the search query
     - Executing the search
     - Formatting search results
   - Add appropriate edges between nodes
   - Expose the agent in the GenerativeUIAnnotation's `next` options

3. **UI Component**
   - Create a new UI component at `src/agent-uis/components/SearchResults.tsx`
   - Display search results in a clean, formatted manner
   - Support displaying images when available
   - Include source attribution and links
   - Add the component to the ComponentMap in `src/agent-uis/index.ts`

4. **Types**
   - Update `src/agent/types.ts` to include search-related types
   - Add 'searchAgent' to the `next` Annotation options

## Implementation Plan

### Phase 1: Core Tool Implementation

1. Create the basic Tavily search tool implementation
2. Set up environment variable handling
3. Implement basic error handling and retry logic
4. Write unit tests for the tool

### Phase 2: Agent Implementation

1. Create the search agent graph
2. Implement each node in the graph
3. Add appropriate edges and compile the graph
4. Test the agent functionality with various queries

### Phase 3: UI Integration

1. Create the search results UI component
2. Implement responsive design for different screen sizes
3. Test the component with various result formats
4. Integrate with the existing UI framework

### Phase 4: Testing and Documentation

1. Write comprehensive tests for the search agent
2. Document API and parameters
3. Add examples to the documentation
4. Create integration tests with other agents

## Technical Design

### Tavily Search Tool Implementation

```typescript
import { z } from 'zod';
import { Tavily } from '@langchain/community/tools/tavily_search';

// Schema for search parameters
export const TavilySearchSchema = z.object({
  query: z.string().describe('The search query to use'),
  includeImages: z.boolean().optional().describe('Whether to include images in the search results'),
  searchDepth: z.enum(['basic', 'advanced']).optional().describe('The depth of the search'),
  timeRange: z.enum(['1d', '1w', '1m', '1y']).optional().describe('Time range for the search results'),
  includeDomains: z.array(z.string()).optional().describe('Domains to include in the search'),
  excludeDomains: z.array(z.string()).optional().describe('Domains to exclude from the search'),
});

export type TavilySearchParams = z.infer<typeof TavilySearchSchema>;

// Initialize Tavily search with API key validation
export const createTavilySearch = () => {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY environment variable is not set');
  }
  
  return new Tavily({
    apiKey
  });
};
```

### Search Agent Implementation

```typescript
import {
  Annotation,
  START,
  StateGraph,
  type LangGraphRunnableConfig,
} from '@langchain/langgraph';
import { ChatAnthropic } from '@langchain/anthropic';
import { typedUi } from '@langchain/langgraph-sdk/react-ui/server';
import { GenerativeUIAnnotation } from '../types';
import { createTavilySearch, TavilySearchSchema } from '../search-tool';
import { v4 as uuidv4 } from 'uuid';

const MODEL_NAME = 'claude-3-5-sonnet-latest';

const SearchAnnotation = Annotation.Root({
  messages: GenerativeUIAnnotation.spec.messages,
  ui: GenerativeUIAnnotation.spec.ui,
  context: Annotation<{ search?: { results?: any } } | undefined>(),
});

type SearchState = typeof SearchAnnotation.State;
type SearchUpdate = Promise<typeof SearchAnnotation.Update>;

// Search preparation node
async function prepareSearch(
  state: SearchState,
  config: LangGraphRunnableConfig,
): SearchUpdate {
  // Implementation details...
}

// Search execution node
async function executeSearch(
  state: SearchState,
  config: LangGraphRunnableConfig,
): SearchUpdate {
  // Implementation details...
}

// Format results node
async function formatResults(
  state: SearchState,
  config: LangGraphRunnableConfig,
): SearchUpdate {
  // Implementation details...
}

// Create and export the graph
export const graph = new StateGraph(SearchAnnotation)
  .addNode('prepareSearch', prepareSearch)
  .addNode('executeSearch', executeSearch)
  .addNode('formatResults', formatResults)
  .addEdge(START, 'prepareSearch')
  .addEdge('prepareSearch', 'executeSearch')
  .addEdge('executeSearch', 'formatResults')
  .compile();
```

## UI Components

### SearchResults Component

```tsx
type SearchResultsProps = {
  results: Array<{
    title: string;
    url: string;
    content: string;
    image?: string;
  }>;
  query: string;
  isGenerating?: boolean;
};

export function SearchResults({ 
  results, 
  query, 
  isGenerating = false 
}: SearchResultsProps) {
  // Component implementation...
}
```

## Integration with Existing System

The search agent will be a standalone agent in our system:

1. Add 'searchAgent' to the `next` Annotation options in `src/agent/types.ts`
2. Update the main application to route to the search agent when appropriate
3. Ensure the search agent can be invoked directly from the user interface

## Error Handling and Rate Limiting

1. Implement exponential backoff for API rate limits
2. Add graceful error handling for network issues
3. Provide user-friendly error messages for failed searches
4. Cache search results where appropriate to reduce API usage

## Success Metrics

1. Successful integration of the search tool and agent
2. Improved agent responses with real-time information
3. User engagement with search results
4. Reduction in "I don't know" responses from agents

## Future Enhancements

1. Support for more advanced Tavily features as they become available
2. Integration with other search providers
3. Implementation of search result caching
4. Personalized search based on user preferences

## Conclusion

The dedicated Tavily search agent will significantly enhance our system's capabilities by providing access to real-time information from the web. This implementation follows our existing agent patterns and will integrate seamlessly with our current LangGraph framework while maintaining clear separation of concerns between different agent types.
