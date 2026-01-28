# ROI Forecasting Tool

An internal-facing tool designed to enable consultants to input client project data across 15 service offerings and generate ROI forecasts leveraging industry knowledge bases, historical engagement data, and market-specific benchmarks.

## Features

- **Multi-step wizard form** for capturing project data
- **15 service offerings** across Marketing & Advertising Enablement and Technology & Data Excellence domains
- **Real-time ROI calculations** that update as you modify inputs
- **Knowledge base integration** with industry benchmarks, service profiles, and cross-service synergies
- **Three forecast scenarios**: Conservative, Base, and Optimistic
- **Export functionality**: PDF and CSV reports
- **Auto-save drafts** every 30 seconds

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Storage**: JSON file-based storage
- **Knowledge Base**: Editable JSON configuration files

## Project Structure

```
ROI_Toolv1/
├── backend/
│   ├── data/
│   │   ├── knowledge-base/     # Editable KB configuration files
│   │   │   ├── service-offerings.json
│   │   │   ├── industry-benchmarks.json
│   │   │   ├── modifiers.json
│   │   │   ├── synergies.json
│   │   │   └── form-options.json
│   │   ├── projects.json       # Stored projects
│   │   └── drafts.json         # Saved drafts
│   ├── routes/
│   │   ├── projects.js         # CRUD operations for projects
│   │   ├── calculations.js     # ROI calculation endpoints
│   │   ├── knowledgeBase.js    # KB data endpoints
│   │   └── exports.js          # PDF/CSV export endpoints
│   ├── services/
│   │   ├── storage.js          # JSON file storage
│   │   ├── roiCalculator.js    # ROI calculation engine
│   │   └── knowledgeBase.js    # KB data access
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── steps/          # Wizard step components
│   │   │   ├── ROIDashboard.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript types
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ROI_Toolv1
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (runs on port 3001)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (runs on port 3000)
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/drafts` - Save a draft
- `GET /api/projects/drafts/:id` - Get a draft

### Calculations
- `POST /api/calculations/roi` - Calculate ROI for a project
- `POST /api/calculations/roi/scenarios` - Calculate all three scenarios
- `POST /api/calculations/quick-estimate` - Quick ROI estimate

### Knowledge Base
- `GET /api/knowledge-base` - Get full knowledge base
- `GET /api/knowledge-base/service-offerings` - Get all service offerings
- `GET /api/knowledge-base/service-offerings/:id` - Get a service profile
- `GET /api/knowledge-base/industry-benchmarks` - Get all industry benchmarks
- `GET /api/knowledge-base/form-options` - Get form dropdown options
- `POST /api/knowledge-base/insights` - Get contextual insights

### Exports
- `POST /api/exports/csv` - Export project to CSV
- `POST /api/exports/pdf` - Export project to PDF
- `POST /api/exports/executive-summary` - Get executive summary

## Service Offerings

### Marketing and Advertising Enablement
1. Martech Strategy & Implementation
2. Agentic-Powered Marketing Operating Model
3. Personalization at Scale
4. Marketing Data & Analytics Foundation
5. AdTech Strategy & Implementation
6. Full-Funnel Commerce
7. Performance Content Automation
8. Content Supply Chain Management

### Technology and Data Excellence
1. Enterprise Data Strategy & Implementation
2. Digital Product Strategy & Engineering
3. Scaled Delivery Excellence
4. Technology Modernization
5. Service Model Innovation
6. AI Strategy & Value Realization
7. Agentic Workflow Design

## ROI Calculation Logic

The ROI calculation engine applies multiple modifiers based on:

1. **Service Offering** - Implementation complexity and typical ROI ranges
2. **Industry Vertical** - Success rate modifiers and benchmarks
3. **Company Size** - Achievement modifiers and timeline adjustments
4. **Organizational Maturity** - Ramp-up and change management factors
5. **Engagement Type** - Value realization timing
6. **Cross-Service Synergies** - Value multipliers for complementary services
7. **Risk Factors** - Probability-weighted reductions

### Forecast Modes
- **Conservative**: 60% of modeled value
- **Base Case**: 80% of modeled value
- **Optimistic**: 100% of modeled value

## Customizing the Knowledge Base

All knowledge base data is stored in editable JSON files in `backend/data/knowledge-base/`:

- **service-offerings.json** - Service profiles with ROI ranges, complexity, metrics
- **industry-benchmarks.json** - Industry-specific success rates and KPIs
- **modifiers.json** - Company size, maturity, and engagement type adjustments
- **synergies.json** - Cross-service value multipliers
- **form-options.json** - Dropdown options for forms

Edit these files directly to update benchmarks, add new services, or adjust modifiers.

## License

Internal use only.
