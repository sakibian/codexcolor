# Agency Codex - AI Agent Instructions

## Project Overview

Agency Codex is a modern digital agency website built with HTML, Tailwind CSS, and vanilla JavaScript. The project follows a clean, component-based architecture with a focus on maintainability and performance, using structured development processes for PRDs and task management.

## Development Process

### 1. PRD Creation

When starting a new feature:

1. Ask clarifying questions about:

   - Problem/Goal
   - Target User
   - Core Functionality
   - User Stories
   - Acceptance Criteria
   - Scope/Boundaries
   - Data Requirements
   - Design/UI
   - Edge Cases

2. Generate PRD with structure:

   - Introduction/Overview
   - Goals
   - User Stories
   - Functional Requirements
   - Non-Goals
   - Design Considerations
   - Technical Considerations
   - Success Metrics
   - Open Questions

3. Save as `/tasks/[n]-prd-[feature-name].md`

### 2. Task Generation

For each PRD:

1. Analyze requirements
2. Review existing codebase
3. Create parent tasks (Phase 1)
4. Wait for user confirmation
5. Break into sub-tasks (Phase 2)
6. List relevant files
7. Save as `/tasks/tasks-[prd-file-name].md`

### 3. Implementation Protocol

1. One sub-task at a time
2. Mark tasks completed:
   - Sub-task: Change `[ ]` to `[x]`
   - Parent task when all sub-tasks done:
     1. Run tests
     2. Stage changes
     3. Clean up temporary code
     4. Commit with conventional format:
     ```bash
     git commit -m "feat: description" -m "- Change 1" -m "- Change 2" -m "Task reference"
     ```
3. Wait for user approval between tasks
4. Keep task list updated

## Key Technologies

- HTML5 for semantic markup
- Tailwind CSS for styling (v3.x)
- PostCSS for CSS processing
- Vanilla JavaScript for interactions
- Google Analytics 4 for tracking

## Project Structure

```
agency-codex/
├── css/
│   ├── style.css        # Generated CSS output
│   └── tailwind.css     # Tailwind entry file
├── js/
│   ├── navigation.js    # Navigation and mobile menu
│   ├── analytics.js     # GA4 configuration
│   └── lazy-load.js     # Image lazy loading
├── tasks/               # PRDs and task lists
│   ├── [n]-prd-*.md    # Product requirement docs
│   └── tasks-*.md      # Generated task lists
├── rules/              # Development process rules
├── images/             # Image assets
└── mockup/
    └── png/            # Design mockups
```

## Color System

Colors are defined in `tailwind.config.js`:

- Seasalt (#F7F7F7) - Light background, neutral shade for clean interfaces
- White (#FFFFFF) - Primary background color
- Fulvous (#DD7D1A) - Primary brand color, used for CTAs and emphasis
- Bistre (#291B11) - Dark accent color for text and UI elements
- White Smoke (#F4F4F4) - Secondary background color, subtle contrast

Each color includes shades from 100-900 in the Tailwind configuration. For example:

```js
seasalt: {
  DEFAULT: '#f7f7f7',
  100: '#313131',
  // ... other shades
  900: '#fdfdfd'
}
```

## Development Workflow

1. Start development:

   ```bash
   npm run build:css    # Build CSS
   npm run watch        # Watch CSS changes
   ```

2. Follow component patterns:

   - Use Tailwind's utility classes
   - Follow BEM-like naming for custom components
   - Maintain responsive design patterns

3. Key file conventions:
   - Component styles in `@layer components` in `tailwind.css`
   - JavaScript modules in `js/` directory
   - Pages follow consistent section structure

## Testing & Quality Checks

- Test responsive layouts across breakpoints
- Verify GA4 events fire correctly
- Check cross-browser compatibility
- Validate form functionality
- Run full test suite before commits

## Common Patterns

1. Buttons:

   ```html
   <a
     class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-secondary-500 hover:bg-secondary-600 shadow-lg hover:shadow-xl transition-all duration-300"
   ></a>
   ```

2. Section Headers:

   ```html
   <div class="text-center mb-16">
     <h2 class="text-4xl font-bold mb-6 text-gray-900">Section Title</h2>
     <p class="text-xl text-gray-600 max-w-3xl mx-auto">Description text</p>
   </div>
   ```

3. Card Components:
   ```html
   <div
     class="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
   >
     <!-- Card content -->
   </div>
   ```

## Need Help?

1. Check `/rules/` for process documentation
2. Review PRDs in `/tasks/` directory
3. Check mockups in `mockup/png/` for design reference
4. Follow established patterns in existing components
