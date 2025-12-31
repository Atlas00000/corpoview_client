# 🎨 CorpoView Client

<div align="center">

**Next.js Frontend Application for CorpoView Dashboard**

*Stunning, interactive, and performant React application with real-time data visualization*

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Setup](#-setup) • [Development](#-development) • [Components](#-components) • [Testing](#-testing) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup](#-setup)
- [Development](#-development)
- [Components](#-components)
- [Styling & Design](#-styling--design)
- [Performance Optimizations](#-performance-optimizations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## 🎯 Overview

The CorpoView Client is a modern Next.js 14+ application built with React 18+, TypeScript, and Tailwind CSS. It provides a stunning, interactive interface for visualizing financial market data with real-time updates, interactive charts, and comprehensive analytics.

### Key Highlights

- 🎨 **Stunning UI** - Modern, executive-grade design with animations
- 📊 **Interactive Charts** - D3.js and Recharts visualizations
- ⚡ **High Performance** - Lazy loading, code splitting, optimizations
- 📱 **Responsive** - Mobile-first design, touch-optimized
- 🔄 **Real-time Data** - Live market updates with SWR
- 🧪 **Tested** - Comprehensive test coverage

---

## ✨ Features

### Market Data Display

- **Stock Market Dashboard**
  - Real-time stock quotes
  - Interactive price charts (line, candlestick)
  - Company profiles and overviews
  - Financial statements viewer
  - Earnings calendar

- **Cryptocurrency Dashboard**
  - Global market statistics
  - Price history charts
  - Top performers
  - Market movers

- **Foreign Exchange Dashboard**
  - Major currency pairs
  - Exchange rate trends
  - Currency converter
  - Historical data

### Data Visualization

- **Interactive Charts**
  - D3.js line charts with zoom, pan, brush
  - Candlestick charts for OHLC data
  - Recharts (pie, bar, area, radar charts)
  - Customizable time ranges

- **Advanced Analytics**
  - Correlation analysis
  - Volatility indicators
  - Volume analysis
  - Performance attribution

### User Experience

- **Responsive Design**
  - Mobile-first approach
  - Touch-friendly interactions
  - Adaptive layouts
  - Dedicated mobile layout components

- **Performance**
  - Component lazy loading
  - Image optimization
  - Code splitting
  - React optimizations (memo, useMemo, useCallback)

- **Error Handling**
  - Error boundaries
  - Error tracking
  - Graceful degradation
  - User-friendly error messages

---

## 🛠 Technology Stack

### Core Framework

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework | 14+ |
| **React** | UI library | 18+ |
| **TypeScript** | Type safety | 5.3+ |

### Styling & UI

| Technology | Purpose | Version |
|------------|---------|---------|
| **Tailwind CSS** | Utility-first CSS | 3+ |
| **Framer Motion** | Animations | 10+ |
| **Radix UI** | Accessible components | Latest |

### Data Visualization

| Technology | Purpose | Version |
|------------|---------|---------|
| **D3.js** | Custom charts | 7+ |
| **Recharts** | Chart library | 2.10+ |

### State & Data

| Technology | Purpose | Version |
|------------|---------|---------|
| **Zustand** | State management | 4.4+ |
| **SWR** | Data fetching | 2.2+ |
| **Axios** | HTTP client | 1.6+ |

### Utilities

| Technology | Purpose | Version |
|------------|---------|---------|
| **date-fns** | Date manipulation | 2.30+ |
| **lodash** | Utility functions | 4.17+ |
| **use-debounce** | Debouncing hooks | 10+ |
| **react-hot-toast** | Notifications | 2.4+ |

---

## 📁 Project Structure

```
client/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── loading.tsx          # Loading UI
│   ├── not-found.tsx        # 404 page
│   ├── stocks/              # Stock pages
│   │   └── [symbol]/
│   ├── crypto/              # Crypto pages
│   │   └── [id]/
│   ├── fx/                  # FX pages
│   │   └── [from]/[to]/
│   ├── corporate/           # Corporate pages
│   ├── financial/           # Financial pages
│   ├── news/                # News pages
│   ├── analytics/           # Analytics pages
│   ├── compare/             # Comparison pages
│   └── storytelling/        # Storytelling pages
│
├── components/              # React components
│   ├── market/              # Market data components
│   │   ├── MarketOverviewSection.tsx
│   │   ├── EnhancedStockCard.tsx
│   │   ├── EnhancedCryptoCard.tsx
│   │   └── ...
│   ├── charts/              # Chart components
│   │   ├── d3/              # D3.js charts
│   │   ├── recharts/        # Recharts components
│   │   └── gallery/         # Chart gallery
│   ├── corporate/           # Corporate components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── shared/              # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── effects/             # Animation components
│   │   ├── FadeIn.tsx
│   │   ├── SlideUp.tsx
│   │   └── ...
│   └── layout/              # Layout components
│       ├── Container.tsx
│       └── GradientBackground.tsx
│
├── lib/                     # Utilities and helpers
│   ├── api/                 # API client
│   │   └── client.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useStockData.ts
│   │   ├── useCryptoData.ts
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   └── ...
│   ├── charts/              # Chart utilities
│   │   └── d3Helpers.ts
│   ├── animations/          # Animation configs
│   │   └── variants.ts
│   ├── storage/             # Storage utilities
│   │   ├── localStorage.ts
│   │   └── sessionStorage.ts
│   └── tracking/            # Error tracking
│       └── errorTracker.ts
│
├── public/                  # Static assets
│   └── icons/
│
├── types/                   # TypeScript types
│
└── stores/                  # Zustand stores (if any)
```

---

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

---

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm type-check       # Type check without emitting
```

### Development Workflow

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Make Changes**
   - Edit files in `app/`, `components/`, or `lib/`
   - Changes hot-reload automatically

3. **Type Check**
   ```bash
   pnpm type-check
   ```

4. **Lint Code**
   ```bash
   pnpm lint
   ```

5. **Build for Production**
   ```bash
   pnpm build
   ```

---

## 🧩 Components

### Component Architecture

The application follows a modular, component-based architecture:

#### **Base UI Components** (`components/ui/`)
- `Button` - Button with variants and states
- `Card` - Card component with glassmorphism
- `Input` - Form input with validation
- `Badge` - Badge component
- `IconButton` - Icon-only button

#### **Market Components** (`components/market/`)
- `MarketOverviewSection` - Main market overview
- `EnhancedStockCard` - Stock quote card
- `EnhancedCryptoCard` - Crypto quote card
- `EnhancedFXPairCard` - FX pair card
- `MarketStatus` - Market status indicator

#### **Chart Components** (`components/charts/`)
- **D3.js Charts** (`charts/d3/`)
  - `LineChart` - Interactive line chart
  - `CandlestickChart` - OHLC candlestick chart
- **Recharts** (`charts/recharts/`)
  - `PieChart` - Pie chart
  - `BarChart` - Bar chart

#### **Shared Components** (`components/shared/`)
- `Header` - Navigation header
- `Footer` - Site footer
- `ErrorBoundary` - Error boundary wrapper
- `LoadingScreen` - Loading screen
- `LazySuspense` - Lazy loading wrapper

### Component Usage Example

```tsx
import { EnhancedStockCard } from '@/components/market/EnhancedStockCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function StockPage() {
  return (
    <div>
      <EnhancedStockCard symbol="AAPL" name="Apple Inc." />
      <Card>
        <Card.Header>
          <Card.Title>Stock Information</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Content goes here</p>
        </Card.Body>
      </Card>
    </div>
  )
}
```

---

## 🎨 Styling & Design

### Design System

The application uses a custom design system built on Tailwind CSS:

**Color Palette:**
- Primary: Blue shades (`primary-50` to `primary-900`)
- Secondary: Purple/Indigo shades
- Success: Green/Emerald shades
- Danger: Red/Rose shades
- Neutral: Slate shades

**Typography:**
- Font Family: Inter (primary), JetBrains Mono (monospace)
- Font Weights: 400, 500, 600, 700

**Spacing:**
- Consistent spacing scale (4px base)
- Responsive spacing utilities

**Effects:**
- Glassmorphism for cards
- Gradient backgrounds
- Shadow system (elevation)
- Smooth animations

### Tailwind Configuration

The Tailwind config (`tailwind.config.js`) includes:
- Custom color palette
- Custom animations
- Extended theme configuration
- Plugin configurations

### CSS Architecture

- **Global Styles** (`app/globals.css`)
  - CSS variables for colors
  - Base styles
  - Utility classes

- **Component Styles**
  - Tailwind utility classes
  - Inline styles for dynamic values
  - CSS modules (if needed)

---

## ⚡ Performance Optimizations

### Code Splitting & Lazy Loading

- **Route-based splitting** - Automatic via Next.js
- **Component lazy loading** - React.lazy() for heavy components
- **Dynamic imports** - Load libraries on demand

```tsx
// Example: Lazy load chart component
const LineChart = lazy(() => import('@/components/charts/d3/LineChart'))

<Suspense fallback={<Skeleton />}>
  <LineChart data={data} />
</Suspense>
```

### React Optimizations

- **React.memo** - Prevent unnecessary re-renders
- **useMemo** - Memoize expensive computations
- **useCallback** - Memoize callback functions

```tsx
// Example: Memoized component
export default memo(StockCard, (prevProps, nextProps) => {
  return prevProps.symbol === nextProps.symbol
})
```

### Image Optimization

- **Next.js Image** - Automatic image optimization
- **Lazy loading** - Images load on demand
- **Responsive images** - Multiple sizes

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
  loading="lazy"
/>
```

### Caching

- **SWR** - Data fetching with caching and revalidation
- **localStorage** - Client-side storage for preferences
- **HTTP Cache** - Browser caching via headers

---

## 🧪 Testing

### Testing Strategy

The client follows industry best practices for testing:

#### **Unit Tests**
- **Framework**: Vitest
- **Coverage**: Utilities, helpers, hooks
- **Location**: `lib/**/*.test.ts`

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

#### **Component Tests**
- **Framework**: React Testing Library + Vitest
- **Coverage**: React components, user interactions
- **Location**: `components/**/*.test.tsx`

```bash
pnpm test:components   # Run component tests
```

#### **End-to-End Tests**
- **Framework**: Playwright
- **Coverage**: User flows, critical paths
- **Location**: `e2e/`

```bash
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run with UI
```

### Test Examples

#### **Unit Test**
```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/utils/format'

describe('formatPrice', () => {
  it('should format price with 2 decimals', () => {
    expect(formatPrice(123.456)).toBe('$123.46')
  })
})
```

#### **Component Test**
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

#### **Hook Test**
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useStockQuote } from '@/lib/hooks/useStockData'

describe('useStockQuote', () => {
  it('fetches stock quote', async () => {
    const { result } = renderHook(() => useStockQuote('AAPL'))
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

### Testing Best Practices

✅ **Accessibility**
- Test with screen readers
- Test keyboard navigation
- Test ARIA attributes

✅ **User-Centric**
- Test user interactions
- Test error states
- Test loading states

✅ **Coverage Goals**
- Unit tests: >80% coverage
- Component tests: Critical components 100%
- E2E tests: Critical user flows

---

## 🚢 Deployment

### Deployment to Vercel

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Set root directory to `client`

2. **Configure Environment Variables**
   - `NEXT_PUBLIC_API_URL` - Backend API URL
   - Optional: Error tracking variables

3. **Deploy**
   - Vercel automatically builds and deploys
   - Preview deployments for PRs

### Build Configuration

The application uses Next.js standalone output for optimized deployments:

```javascript
// next.config.js
output: 'standalone'
```

### Environment Variables

See [Environment Variables](#-environment-variables) section.

---

## 🔐 Environment Variables

### Required Variables

```env
# API Server URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Optional Variables

```env
# Error Tracking
NEXT_PUBLIC_ERROR_TRACKING_PROVIDER=console
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

---

## 📚 Additional Resources

- [Main README](../README.md) - Project overview
- [Server README](../server/README.md) - Backend documentation
- [Deployment Guide](../DEPLOYMENT.md) - Deployment instructions
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

---

<div align="center">

**Built with ❤️ for the CorpoView Dashboard**

[Back to Main README](../README.md) • [Server Documentation](../server/README.md)

</div>

