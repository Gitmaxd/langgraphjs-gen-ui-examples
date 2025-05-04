# Technical Context

## Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Agent Framework**: LangGraph.js, LangChain.js
- **Build System**: Vite, esbuild
- **UI Components**: Custom components, Recharts, Radix UI
- **State Management**: LangGraph state management, React context and hooks
- **Routing**: React Router DOM
- **LLM Providers**: OpenAI, Google GenAI, Anthropic (optional)

## Architecture Overview
The project implements an agent-based architecture using LangGraph.js with the following key components:

1. **Supervisor Agent**: Central coordinator that routes requests to specialized agents
2. **Specialized Agents**: Domain-specific implementations (Stockbroker, Trip Planner, etc.)
3. **Generative UI Components**: React components rendered based on agent responses
4. **LangGraph Runtime**: Manages graph execution and state transitions
5. **Agent UI Registry**: Connects agent outputs to appropriate UI components

The agent system works by passing user queries through a routing mechanism that determines which specialized agent should handle the request. Each agent has access to specific tools and can trigger generative UI components to enhance the interaction beyond simple text responses.

## Development Environment
- **Node.js Version:** 20.x
- **Package Manager:** pnpm (v10.5.1+)
- **Required Tools:** 
  - LangGraph CLI (`langgraphjs`)
  - TypeScript
  - Vite
- **IDE Recommendations:** VS Code with TypeScript and ESLint extensions

## APIs and External Services
- **OpenAI API**: Required for most agent functionality
- **Google GenAI API**: Required for the router implementation
- **Financial Datasets API**: Optional, used for stockbroker agent
- **Anthropic API**: Optional, used for some agent examples
- **LangSmith**: Optional, for tracing and observability

## Configuration Management
- **Environment Variables**: Managed via `.env` file (see `.env.example` for required variables)
- **LangGraph Configuration**: Defined in `langgraph.json` at project root
- **Graph Definitions**: Located in respective agent directories under `src/agent/`
- **Component Configuration**: UI component settings in individual component directories

## Development Workflow
1. Start LangGraph server: `pnpm agent`
2. Access API at http://localhost:2024
3. Use with Agent Chat UI (https://agentchat.vercel.app)
4. Test different agents using the appropriate graph IDs:
   - `agent`: Main supervisor agent with all tools
   - `chat`: Simple chat agent
   - `email_agent`: Email assistant with HITL capabilities

## Deployment Considerations
- The project is designed to be used with the Agent Chat UI
- LangGraph.js server must be running to use the agents
- API keys must be properly configured in the environment
- Models must have sufficient capabilities for agent reasoning

## System Architecture Diagram
```
┌─────────────────────────────────────┐
│           Agent Chat UI             │
│    (External Consumer Application)   │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│         LangGraph.js Server         │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Supervisor │───▶│ Stockbroker │ │
│  │    Agent    │    │    Agent    │ │
│  └──────┬──────┘    └─────────────┘ │
│         │                           │
│         │           ┌─────────────┐ │
│         ├──────────▶│Trip Planner │ │
│         │           │    Agent    │ │
│         │           └─────────────┘ │
│         │                           │
│         │           ┌─────────────┐ │
│         └──────────▶│  Other      │ │
│                     │  Agents     │ │
│                     └─────────────┘ │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│        Generative UI Registry       │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │ Stockbroker │    │Trip Planner │ │
│  │     UI      │    │     UI      │ │
│  └─────────────┘    └─────────────┘ │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │  Open Code  │    │    Other    │ │
│  │     UI      │    │     UIs     │ │
│  └─────────────┘    └─────────────┘ │
└─────────────────────────────────────┘
