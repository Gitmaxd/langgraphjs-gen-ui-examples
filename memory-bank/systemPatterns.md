# Next.js System Patterns

## Naming Conventions

### React Components
- Use **PascalCase** for both filenames and component names
  - Examples: `Button.tsx`, `UserProfile.tsx`
- For complex components, use folder structure with PascalCase index files
  - Example: `UserProfile/index.tsx` + other component files

### Pages and Routes
- Use **kebab-case** for page files 
  - Example: `about-us.tsx`
- Use **snake_case** for dynamic route segments 
  - Example: `[product_id].tsx`
- Use **lowercase** for special Next.js files
  - Examples: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Utility and Config Files
- Use **kebab-case** for utility files
  - Examples: `api-helpers.ts`, `date-utils.ts`

### Documentation Files
- Use **kebab-case** for markdown files
  - Example: `getting-started.md`

## Next.js App Router Patterns

### Component Types
- **Server Components** (default): Use for components that:
  - Fetch data
  - Access backend resources directly
  - Handle sensitive information
  - Don't need client-side interactivity
  ```tsx
  // Example server component
  async function ProductList() {
    const products = await getProducts();
    
    return (
      <div>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  }
  ```

- **Client Components**: Use for components that:
  - Use React hooks
  - Add event listeners
  - Use browser-only APIs
  - Maintain client-side state
  ```tsx
  'use client';
  
  import { useState } from 'react';
  
  export default function Counter() {
    const [count, setCount] = useState(0);
    
    return (
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    );
  }
  ```

### Data Fetching Patterns
- **Server Components** - Use direct async/await:
  ```tsx
  async function ProductPage({ params }) {
    const product = await getProduct(params.id);
    return <ProductDetails product={product} />;
  }
  ```

- **Server Actions** - Use for data mutations:
  ```tsx
  'use server';
  
  export async function updateProduct(formData) {
    const product = formDataToProduct(formData);
    await db.products.update(product);
    revalidatePath('/products');
  }
  ```

### Routing Patterns
- Use **layout.tsx** for shared UI across routes
- Use **loading.tsx** for loading states
- Use **error.tsx** for error boundaries
- Use **not-found.tsx** for 404 handling
- Use **route.ts/js** for API endpoints
- Use route groups with **(folder)** for organization without affecting URL structure

### State Management
- Server components: Fetch data directly
- Client components: React hooks, context, or minimal state libraries
- Cross-component state: React Context with client components
- Server-client state: Form actions with useFormState/useOptimistic

## LangGraph.js System Patterns

## Naming Conventions

### React Components
- Use **PascalCase** for both filenames and component names
  - Examples: `StockPrice.tsx`, `AccommodationSelector.tsx`
- For complex components, use folder structure with index files
  - Example: `stockbroker/buy-stock/index.tsx`

### Agent Modules
- Use **kebab-case** for directories
  - Examples: `trip-planner`, `open-code`
- Use **camelCase** for TypeScript files
  - Examples: `index.ts`, `types.ts`
- Use **kebab-case** for style files
  - Examples: `index.css`, `styles.css`

### Utility and Config Files
- Use **kebab-case** for utility files
  - Examples: `api-helpers.ts`, `format-messages.ts`

## LangGraph.js Agent Patterns

### Agent Structure
- **Entry Point Pattern**: Each agent has a standardized entry point
  ```typescript
  // Entry point (index.ts)
  import { StateGraph } from "@langchain/langgraph";
  
  // Define graph nodes and structure
  const builder = new StateGraph(AgentAnnotation, AgentConfig)
    .addNode("nodeA", nodeA)
    .addNode("nodeB", nodeB)
    .addEdge("nodeA", "nodeB")
    .addEdge(START, "nodeA")
    .addEdge("nodeB", END);
  
  export const graph = builder.compile();
  graph.name = "Agent Name";
  ```

- **Types Pattern**: Separate types file for each agent
  ```typescript
  // types.ts
  import { z } from "zod";
  
  export const AgentConfig = {
    channels: {
      messages: z.array(z.object({
        content: z.string(),
        role: z.enum(["user", "assistant", "system", "function"])
      })),
      // Other state channels
    }
  };
  
  export interface AgentState {
    messages: Message[];
    // Other state properties
  }
  
  export const AgentAnnotation = {
    // Annotation for type-safe operations
  };
  ```

- **Nodes Pattern**: Individual node functions in separate files
  ```typescript
  // nodes/extraction.ts
  export async function extraction(state: AgentState) {
    // Node implementation that transforms state
    return { ...state, extractedData };
  }
  ```

### Supervisor Pattern
- Central router that delegates to specialized agents
- Uses conditional edges based on query classification
- Implements tool descriptions for agent selection
```typescript
// Example from supervisor/index.ts
const builder = new StateGraph(SupervisorAnnotation, SupervisorConfig)
  .addNode("router", router)
  .addNode("agentA", agentAGraph)
  .addNode("agentB", agentBGraph)
  .addConditionalEdges("router", handleRoute, [
    "agentA",
    "agentB",
    "generalInput",
  ])
  .addEdge(START, "router")
  .addEdge("agentA", END)
  .addEdge("agentB", END)
  .addEdge("generalInput", END);
```

### Tool Implementation Pattern
- Tools defined as functions with clear input/output types
- Tools return structured data for UI rendering
```typescript
// Example tool pattern
export async function getTool({ param1, param2 }) {
  // Tool implementation
  return {
    type: "tool_result",
    data: {
      // Structured data for UI rendering
    }
  };
}
```

## Generative UI Patterns

### UI Component Registry
- Central registry connects agent outputs to UI components
- Components are mapped by type identifier
```tsx
// Example from agent-uis/index.tsx
export const uiComponents = {
  "stockbroker:buy-stock": BuyStock,
  "stockbroker:stock-price": StockPrice,
  "trip-planner:accommodation-selector": AccommodationSelector,
  // Other UI components
};
```

### State Management Pattern
- Components receive initial state from agent output
- UI interactions update local state
- Final state submitted back to agent
```tsx
// Component state pattern
function ComponentName({ data, onSubmit }) {
  const [state, setState] = useState(data);
  
  const handleChange = (newValue) => {
    setState({ ...state, value: newValue });
  };
  
  const handleSubmit = () => {
    onSubmit(state);
  };
  
  return (
    // Component rendering
  );
}
```

### Styling Pattern
- Component-scoped CSS with BEM-inspired class names
- Tailwind utility classes for common styling
- CSS modules for component-specific styles
```tsx
// Styling pattern example
import "./index.css";
import { cn } from "@/lib/utils";

function ComponentName() {
  return (
    <div className={cn(
      "component__container",
      "p-4 rounded-lg border border-gray-200"
    )}>
      {/* Component content */}
    </div>
  );
}
```

## Data Flow Patterns

### Agent-to-UI Data Flow
1. User sends message to agent
2. Agent processes message and determines appropriate response
3. If UI is needed, agent returns structured data with UI type
4. Agent Chat UI maps data to appropriate UI component
5. UI component renders with data
6. User interacts with UI
7. UI sends updated data back to agent
8. Agent continues processing with new data

### Error Handling Pattern
- Try/catch blocks for async operations
- Structured error responses
- Fallback to text-based responses when UI fails
```typescript
try {
  const result = await someAsyncOperation();
  return { type: "ui_component", data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return { type: "text", content: "Sorry, there was an error processing your request." };
}
```

## Testing Patterns
- Unit tests for utility functions
- Component tests for UI elements
- Integration tests for agent flows
- Mock LLM responses for deterministic testing
```typescript
// Example test pattern
test("agent routes to correct subgraph", async () => {
  // Setup mock LLM that returns predictable response
  const mockLLM = new MockLLM([{ response: "stockbroker" }]);
  
  // Test router with mock
  const result = await routerNode({ messages: [{ role: "user", content: "Show me AAPL stock price" }] }, { llm: mockLLM });
  
  // Assert correct routing
  expect(result.next).toBe("stockbroker");
});

## TypeScript Patterns

### Type Definitions
- Keep types close to where they're used
- Use interface for public APIs, type for internal
- Export shared types from dedicated files

```tsx
// types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Usage in component
import type { Product } from '@/types';
```

### Props Typing
```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  // Component implementation
}
```

## CSS and Styling

### CSS Modules
- Use CSS modules for component-specific styling
- File naming: `ComponentName.module.css`

```tsx
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

// Button.tsx
import styles from './Button.module.css';

export function Button({ variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click me
    </button>
  );
}
```

### Tailwind CSS
- Use utility classes for rapid styling
- Extract common patterns to components

```tsx
export function Card({ title, children }) {
  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

## Testing Patterns

### Component Testing
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Page Testing
```tsx
// page.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock server component data
jest.mock('@/lib/api', () => ({
  getData: () => Promise.resolve({ title: 'Test data' })
}));

describe('HomePage', () => {
  it('renders page with data', async () => {
    render(await HomePage());
    expect(screen.getByText('Test data')).toBeInTheDocument();
  });
});
```
