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
- **Health Checks**: Optimized root endpoint responding in <3ms for deployment systems

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
- **Server Startup**: Non-blocking startup with migrations running post-listen

### Recent Deployment Fixes (September 4, 2025)
- ✓ Moved database migration to run after server starts listening to avoid blocking health checks
- ✓ Simplified root endpoint to respond immediately with 200 status for deployment health verification
- ✓ Restructured server startup to eliminate async wrapper complexity that could delay responses
- ✓ Updated deployment script to ensure static files are correctly positioned for production serving
- ✓ Verified health check endpoints respond in under 3 milliseconds consistently

## SEO Implementation

### Search Engine Optimization
- **Sitemap.xml**: Dynamic generation with automatic URL discovery and timestamps
- **Robots.txt**: Proper crawler guidance with sitemap reference
- **Meta Tags**: Comprehensive SEO meta tags including title, description, keywords
- **Open Graph**: Social media sharing optimization for Facebook, LinkedIn
- **Twitter Cards**: Enhanced Twitter sharing with summary cards
- **JSON-LD**: Structured data for search engines using Schema.org WebApplication
- **Favicon**: SVG favicon with animated AI circuit design

### Recent SEO Updates (January 23, 2025)
- ✓ Added dynamic sitemap.xml generation at /sitemap.xml
- ✓ Implemented robots.txt with proper crawler directives
- ✓ Enhanced HTML head with comprehensive meta tags
- ✓ Added Open Graph and Twitter Card meta properties
- ✓ Implemented JSON-LD structured data for better search understanding
- ✓ Created animated SVG favicon with AI-themed design
- ✓ Configured proper canonical URLs and content indexing directives

## Recent Feature Updates (January 9, 2026)

### Theme System
- **Dark/Light Mode Toggle**: Dual theme system with localStorage persistence
- **Theme Provider**: React context-based theme management with smooth transitions
- **CSS Variables**: Dynamic theming using CSS custom properties for colors and backgrounds

### Community Features
- **Community Predictions**: User-submitted singularity predictions with upvoting system
- **Leaderboard**: Top predictions ranked by upvotes with aggregated statistics
- **Average Prediction Date**: Computed from all community submissions

### Interactive Tools
- **What If Scenario Explorer**: Adjust prediction variables with interactive sliders
- **Historical Timeline**: Key AI milestones from 2012-2025 with detailed descriptions
- **Shareable Cards**: Downloadable prediction cards with social media sharing (Twitter, LinkedIn)

### Embeddable Widgets
- **Countdown Widget**: Embeddable timer with multiple integration options
- **iframe Embed**: Full countdown display for external websites
- **JavaScript Embed**: Lightweight script-based widget
- **Badge Embed**: Compact countdown badge

### Email Newsletter
- **Weekly Digest System**: Automated email digest generation
- **HTML/Plain Text Templates**: Dual format email support
- **Digest Preview API**: Preview endpoints for testing
- **Content Aggregation**: Combines predictions, news, metrics, and community data

### Database Updates
- **community_predictions table**: Stores user predictions with upvotes
- **newsletter_subscriptions table**: Manages email subscriptions

### API Endpoints Added
- `GET/POST /api/community-predictions` - Community predictions CRUD
- `POST /api/community-predictions/:id/upvote` - Upvote predictions
- `GET /api/community-predictions/stats` - Aggregated statistics
- `GET /api/newsletter/digest/preview` - HTML digest preview
- `GET /api/newsletter/digest/preview-json` - JSON digest content
- `POST /api/newsletter/digest/send` - Trigger digest sending