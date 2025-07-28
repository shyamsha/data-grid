# Custom Data Grid Component

A fully-featured, custom data grid component built with Next.js 14, TypeScript, and Tailwind CSS. This implementation provides advanced features similar to MUI DataGrid but built entirely from scratch.

## Features

### Core Functionality

- ✅ Dynamic column rendering based on data structure
- ✅ Row virtualization for handling large datasets (1000+ rows)
- ✅ Multi-column sorting with visual indicators
- ✅ Column-specific filtering (text, number, date, select)
- ✅ Client-side pagination with customizable page sizes
- ✅ Global search across all columns

### Column Management

- ✅ Show/Hide columns with toggle functionality
- ✅ Column reordering via drag and drop
- ✅ Column pinning (left/right)
- ✅ Column resizing with drag handles
- ✅ Column grouping support

### Advanced Features

- ✅ Single and multi-row selection
- ✅ Inline cell editing
- ✅ Custom cell renderers
- ✅ Row actions (edit, view, delete)
- ✅ Bulk operations on selected rows
- ✅ Export functionality (CSV/JSON)
- ✅ Density control (compact, standard, comfortable)

### State Management

- ✅ React Context API for global state
- ✅ useReducer for complex state updates
- ✅ Custom hooks for reusable logic
- ✅ LocalStorage persistence for user preferences
- ✅ Optimistic updates for better UX

### UI/UX

- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme toggle
- ✅ Loading states with skeleton loaders
- ✅ Error handling with retry options
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Touch support for mobile devices

### Animations

- ✅ Smooth transitions for all interactions
- ✅ Micro-interactions and hover effects
- ✅ Loading animations
- ✅ Staggered row animations
- ✅ Gesture feedback

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **Animations**: Framer Motion + CSS transitions
- **API Integration**: Custom mock API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd custom-data-grid
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/
│   ├── DataGrid/
│   │   ├── DataGrid.tsx          # Main grid component
│   │   ├── DataGridHeader.tsx    # Column headers
│   │   ├── DataGridRow.tsx       # Data rows
│   │   ├── DataGridCell.tsx      # Individual cells
│   │   ├── DataGridToolbar.tsx   # Top toolbar
│   │   ├── ColumnManager.tsx     # Column management panel
│   │   ├── FilterPanel.tsx       # Filtering panel
│   │   └── Pagination.tsx        # Pagination controls
│   └── ui/
│       ├── Button.tsx            # Reusable button component
│       ├── Input.tsx             # Input component
│       ├── Select.tsx            # Select dropdown
│       └── Modal.tsx             # Modal component
├── contexts/
│   ├── DataGridContext.tsx       # Grid state management
│   └── ThemeContext.tsx          # Theme management
├── hooks/
│   ├── useApi.ts                 # API integration hook
│   ├── useVirtualScroll.ts       # Virtual scrolling logic
│   └── useLocalStorage.ts        # LocalStorage hook
├── types/
│   ├── grid.types.ts             # Grid-related types
│   └── api.types.ts              # API types
├── utils/
│   ├── gridHelpers.ts            # Grid utility functions
│   └── mockApi.ts                # Mock API implementation
└── app/
    ├── layout.tsx                # Root layout
    ├── page.tsx                  # Home page
    └── globals.css               # Global styles
```

## Usage Examples

### Basic Implementation

```tsx
import { DataGrid } from "./components/DataGrid/DataGrid";
import { DataGridProvider } from "./contexts/DataGridContext";

function App() {
  return (
    <DataGridProvider>
      <DataGrid />
    </DataGridProvider>
  );
}
```

### Custom Column Configuration

```tsx
const columns: Column[] = [
  {
    field: "name",
    headerName: "Full Name",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: "salary",
    headerName: "Salary",
    width: 120,
    type: "number",
    renderCell: (params) => `${params.value.toLocaleString()}`,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    type: "actions",
    renderCell: (params) => (
      <div>
        <button onClick={() => handleEdit(params.row)}>Edit</button>
        <button onClick={() => handleDelete(params.row)}>Delete</button>
      </div>
    ),
  },
];
```

## Performance Considerations

- **Virtual Scrolling**: Efficiently handles 10,000+ rows
- **Debounced Search**: 300ms debounce for search input
- **Memoization**: Prevents unnecessary re-renders
- **Lazy Loading**: Data loaded as needed
- **Smart Caching**: API responses cached appropriately

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Future Enhancements

- [ ] Server-side sorting and filtering
- [ ] WebSocket integration for real-time updates
- [ ] Advanced filtering with date ranges
- [ ] Keyboard shortcuts for power users
- [ ] Internationalization support
- [ ] Print-friendly layouts
- [ ] Custom themes beyond dark/light
