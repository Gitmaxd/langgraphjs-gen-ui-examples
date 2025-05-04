# Git Repository Management

## Repository Structure

This project is maintained as a fork of the original LangGraph.js Generative UI Examples repository with additional features and enhancements.

### Repository Relationship
- **Original Repository**: [langchain-ai/langgraphjs-gen-ui-examples](https://github.com/langchain-ai/langgraphjs-gen-ui-examples)
- **Our Fork**: [Gitmaxd/langgraphjs-gen-ui-examples](https://github.com/Gitmaxd/langgraphjs-gen-ui-examples)

### Remote Configuration
- **origin**: Points to our fork (https://github.com/Gitmaxd/langgraphjs-gen-ui-examples.git)
- **upstream**: Points to the original repository (https://github.com/langchain-ai/langgraphjs-gen-ui-examples.git)

## Development Workflow

### Standard Development Process
1. Create feature branches from our main branch
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. Make changes and commit following conventional commit format
   ```bash
   git commit -m "feat(scope): brief description" -m "Detailed explanation of the changes made"
   ```

3. Push changes to our fork
   ```bash
   git push origin feature/new-feature-name
   ```

4. Create pull requests against our fork's main branch
   - This maintains good version control practices
   - Enables code review within our team

### Staying in Sync with Upstream (Optional)
To incorporate changes from the original repository:

1. Fetch the latest changes from upstream
   ```bash
   git fetch upstream
   ```

2. Switch to our main branch
   ```bash
   git checkout main
   ```

3. Merge upstream changes
   ```bash
   git merge upstream/main
   ```

4. Push the updated main to our fork
   ```bash
   git push origin main
   ```

5. Rebase feature branches as needed
   ```bash
   git checkout feature/branch-name
   git rebase main
   ```

## Commit Standards

### Commit Format
```
<type>[scope]: <description>

[body]

[footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring without behavior changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Routine maintenance tasks
- `revert`: Reverting previous commits

### Guidelines
- **Subject line**: Imperative mood, lowercase, no period, maximum 50 characters
- **Body**: Explain WHY the change was made (not HOW), wrap at 72 characters
- **Footer**: Reference issues with "Fixes #123" or note breaking changes

### Examples
```
feat(search): implement Tavily search integration

Added search agent with Tavily API integration to provide real-time
web search results with structured UI display.

Fixes #45
```

## Branch Naming Conventions

- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Documentation: `docs/subject`
- Releases: `release/version-number`

## Key Project Branches

- **main**: Stable, production-ready code
- **tavily-search-tool**: Implementation of Tavily search agent and UI
- [Additional project-specific branches as they're created]

## Important Notes

- Our fork is now the primary development repository
- All new features should be developed in our fork
- Consider updating documentation to clarify fork relationship
- Maintain clean commit history with conventional formatting
