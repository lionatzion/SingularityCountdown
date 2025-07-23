# Singularity Tracker

## Overview
A modern single-page web application that tracks and predicts the technological singularity through real-time AI metrics, news analysis, and machine learning predictions. The application presents data visualizations, countdown timers, and AI-powered analysis in a sleek, futuristic interface.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight routing)
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Charts**: Chart.js for data visualizations
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints with TypeScript schema validation
- **AI Integration**: OpenAI GPT-4o for singularity prediction analysis

### Design System
- **Theme**: Dark space-themed UI with cyberpunk aesthetics
- **Colors**: Neon green, tech purple, deep purple, bright pink accents
- **Typography**: Inter (body), JetBrains Mono (code/data), Orbitron (headers)
- **Layout**: Responsive grid-based design with CSS custom properties

## Key Components

### Data Visualization
- **Singularity Progression Chart**: Interactive timeline showing AI capability growth from 2020-2040
- **Real-time Metrics**: Computing power, GPU performance, neural capacity tracking
- **News Integration**: Live AI news feed with categorization and impact analysis

### Machine Learning Features
- **Prediction Engine**: OpenAI-powered analysis combining metrics and news data
- **Trend Analysis**: Multi-factor assessment including GPU growth, research velocity, investment trends
- **Confidence Scoring**: Statistical confidence ratings for predictions

### User Interface
- **Dashboard**: Single-page layout with metrics grid, charts, countdown timer
- **Interactive Elements**: Hover effects, progressive disclosure, real-time updates
- **Responsive Design**: Mobile-first approach with breakpoint-specific optimizations

## Data Flow

### Frontend Data Management
1. **TanStack Query** handles all server state with automatic caching and background updates
2. **API requests** use fetch with error handling and authentication support
3. **Real-time updates** through periodic refetching (5-30 minute intervals)

### Backend Data Pipeline
1. **News Fetching**: External News API integration with rate limiting and caching
2. **Data Storage**: PostgreSQL with Drizzle ORM for type-safe database operations
3. **ML Processing**: OpenAI API integration for predictive analysis
4. **Response Caching**: Built-in cooldown periods to manage API costs

### Database Schema
- **news_articles**: Title, summary, source, URL, category, impact, timestamps
- **metrics**: GPU performance, neural capacity, processing speed, AI benchmarks
- **predictions**: Model version, predicted date, confidence score, analysis factors

## External Dependencies

### Core Runtime
- **Database**: PostgreSQL (via Neon serverless)
- **AI Service**: OpenAI API (GPT-4o model)
- **News Data**: News API for real-time AI news aggregation

### Development Tools
- **Package Manager**: npm with lockfile
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint integration via Replit environment
- **Build Process**: Vite with optimized bundling

### UI Libraries
- **Component System**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Charts**: Chart.js for performant data visualization

## Deployment Strategy

### Production Build
- **Frontend**: Vite production build with code splitting and asset optimization
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served through Express with proper caching headers

### Environment Configuration
- **Database**: Connection via DATABASE_URL environment variable
- **API Keys**: OpenAI and News API keys via environment variables
- **Development**: Hot module replacement with Vite dev server
- **Production**: Single-process Node.js server with static file serving

### Performance Optimizations
- **Query Caching**: TanStack Query with stale-while-revalidate strategy
- **Rate Limiting**: Built-in cooldowns for external API calls
- **Bundle Optimization**: Code splitting and lazy loading for optimal loading
- **Database**: Indexed queries and connection pooling via Neon serverless