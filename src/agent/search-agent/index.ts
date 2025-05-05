import {
  Annotation,
  START,
  StateGraph,
  type LangGraphRunnableConfig,
} from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { typedUi } from "@langchain/langgraph-sdk/react-ui/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { AIMessageChunk, HumanMessage, ToolMessage } from "@langchain/core/messages";

import { GenerativeUIAnnotation } from "../types";
import { executeSearch } from "../search-tool";

import type ComponentMap from "../../agent-uis/index";

const MODEL_NAME = "claude-3-5-sonnet-latest";

// Define the search agent annotation with proper types
const SearchAnnotation = Annotation.Root({
  messages: GenerativeUIAnnotation.spec.messages,
  ui: GenerativeUIAnnotation.spec.ui,
  searchQuery: Annotation<string | undefined>(),
  searchResults: Annotation<any[] | undefined>(),
  uiId: Annotation<string | undefined>(),
});

type SearchState = typeof SearchAnnotation.State;
type SearchUpdate = Promise<typeof SearchAnnotation.Update>;

// Prepare search node: Extract and optimize the search query
async function prepareSearch(
  state: SearchState,
  config: LangGraphRunnableConfig,
): SearchUpdate {
  const ui = typedUi<typeof ComponentMap>(config);
  const model = new ChatAnthropic({ model: MODEL_NAME });
  const id = uuidv4();

  // Create a tool to extract the search query
  const SearchQueryTool = z.object({
    query: z.string().describe("The optimized search query to use"),
  });

  const initStream = await model
    .bindTools([
      {
        name: "extract_search_query",
        description: "Extract and optimize a search query from the user's message",
        schema: SearchQueryTool,
      } as const,
    ])
    .stream([
      {
        role: "system",
        content: 
          "You are a search query optimizer. Extract the user's search intent and create an optimized search query. " +
          "Focus on the key information needs and use precise, specific terms that will yield relevant results."
      },
      ...state.messages,
    ]);

  let message: AIMessageChunk | undefined;
  let searchQuery: string | undefined;
  let toolCallId: string | undefined;

  for await (const chunk of initStream) {
    message = message ? message.concat(chunk) : chunk;
    
    if (message && message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      if (toolCall?.name === "extract_search_query") {
        try {
          // Handle the args properly - it might be an object or a string
          let args;
          if (typeof toolCall.args === 'string') {
            args = JSON.parse(toolCall.args);
          } else if (typeof toolCall.args === 'object') {
            args = toolCall.args;
          } else {
            console.error("Unexpected args type:", typeof toolCall.args);
            continue;
          }
          
          searchQuery = args.query;
          toolCallId = toolCall.id;
          
          ui.push(
            { id, name: "search", props: { query: searchQuery, isSearching: true } },
            { message, merge: true },
          );
        } catch (e) {
          console.error("Failed to parse tool call args:", e, "Args:", toolCall.args);
        }
      }
    }
  }

  // Create messages array with tool response
  const messages = [];
  if (message) {
    messages.push(message);
  }

  // Add a tool response message if we have a tool call
  if (toolCallId && searchQuery) {
    const toolResponseMessage = new ToolMessage({
      tool_call_id: toolCallId,
      content: JSON.stringify({ success: true, query: searchQuery }),
    });
    messages.push(toolResponseMessage);
  }

  return { 
    messages,
    searchQuery,
    uiId: id,
  };
}

// Execute search node: Perform the search using Tavily
async function executeSearchNode(
  state: SearchState,
  config: LangGraphRunnableConfig,
): SearchUpdate {
  const ui = typedUi<typeof ComponentMap>(config);
  
  if (!state.searchQuery) {
    return {};
  }

  // Use the ID passed from the previous node
  const id = state.uiId;
  if (!id) {
    return {};
  }

  try {
    // Execute the search with Tavily
    const results = await executeSearch({
      query: state.searchQuery,
      includeImages: true,
      searchDepth: "basic",
    });
    
    // Create a human message to attach the UI to
    const humanMessage = new HumanMessage({
      content: `Here are the search results for "${state.searchQuery}"`,
    });

    ui.push(
      { 
        id, 
        name: "search-results", 
        props: { 
          results: results,
          query: state.searchQuery,
          isSearching: false 
        } 
      },
      { message: humanMessage, merge: false },
    );

    return { 
      messages: [humanMessage],
      searchResults: results
    };
  } catch (error) {
    console.error("Search failed:", error);
    
    // Create a human message to attach the UI to
    const humanMessage = new HumanMessage({
      content: `Search failed for "${state.searchQuery}"`,
    });

    ui.push(
      { 
        id, 
        name: "search-results", 
        props: { 
          results: [],
          query: state.searchQuery,
          error: "Search failed. Please try again.",
          isSearching: false 
        } 
      },
      { message: humanMessage, merge: false },
    );

    return {
      messages: [humanMessage]
    };
  }
}

// Format results node: Summarize and format the search results
async function formatResults(
  state: SearchState,
  _config: LangGraphRunnableConfig,
): SearchUpdate {
  if (!state.searchResults || state.searchResults.length === 0) {
    return {};
  }

  
  const model = new ChatAnthropic({ model: MODEL_NAME });
  const resultsString = JSON.stringify(state.searchResults);
  
  const summaryStream = await model.stream([
    {
      role: "system",
      content: 
        "You are a helpful search assistant. Summarize the search results in a clear, concise manner. " +
        "Focus on answering the user's original query with the information provided in the search results. " +
        "Include relevant facts, figures, and quotes from the sources. " +
        "Always cite your sources by mentioning the website names."
    },
    ...state.messages,
    {
      role: "user",
      content: `Here are the search results for "${state.searchQuery}":\n\n${resultsString}\n\nPlease summarize these results to answer my question.`
    }
  ]);

  let summaryMessage: AIMessageChunk | undefined;
  
  for await (const chunk of summaryStream) {
    summaryMessage = summaryMessage ? summaryMessage.concat(chunk) : chunk;
  }

  
  return { 
    messages: summaryMessage ? [summaryMessage] : []
  };
}

// Create the search agent graph
export const graph = new StateGraph(SearchAnnotation)
  .addNode("prepareSearch", prepareSearch)
  .addNode("executeSearch", executeSearchNode)
  .addNode("formatResults", formatResults)
  .addEdge(START, "prepareSearch")
  .addEdge("prepareSearch", "executeSearch")
  .addEdge("executeSearch", "formatResults")
  .compile();

graph.name = "Search Agent";
