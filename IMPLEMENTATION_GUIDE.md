# PathPilot Next-Generation Implementation Guide

## Overview

This guide provides a comprehensive roadmap for implementing the next-generation version of PathPilot. The project has been redesigned as a simulation-first career discovery platform with advanced features including branching narratives, behavioral analysis, a large-scale opportunity engine, and a premium UI.

## Architecture Summary

### Core Components

#### 1. **Simulation Engine** (`lib/db/src/simulation-engine.ts`)
The heart of PathPilot. This engine:
- Processes branching scenario logic
- Tracks career-specific metrics in real-time
- Infers behavioral traits from player choices
- Calculates scores based on metric balance
- Maintains decision history for narrative persistence

**Key Functions:**
- `initializeSimulationState()` - Start a new simulation
- `processChoice()` - Handle player decisions and update state
- `getCurrentScenario()` - Get the current scenario
- `getBehavioralProfile()` - Extract behavioral traits
- `getCareerRecommendations()` - Generate career matches

#### 2. **Behavioral Analysis Engine** (`lib/db/src/behavioral-analysis.ts`)
Analyzes player behavior to generate intelligent recommendations:
- Tracks 8 behavioral traits (risk tolerance, leadership, communication, etc.)
- Generates career matches with confidence scores
- Extracts decision patterns and reasoning
- Produces detailed analysis reports

**Key Functions:**
- `analyzeBehavioralProfile()` - Extract behavioral profile from simulation
- `generateCareerRecommendations()` - Generate top 3 career matches
- `generateAnalysisReport()` - Create detailed analysis report

#### 3. **Roadmap Builder** (`lib/db/src/roadmap-builder.ts`)
Provides Notion-like roadmap management:
- Creates customizable phases and milestones
- Supports drag-and-drop reordering
- Integrates opportunities into roadmap
- Generates AI-suggested roadmaps based on behavioral profile
- Tracks completion percentage

**Key Functions:**
- `generateRoadmapTemplate()` - Create roadmap for a career path
- `addOpportunityToRoadmap()` - Save opportunities to roadmap
- `reorderMilestones()` - Drag-and-drop reordering
- `generateAiRoadmap()` - Personalized roadmap generation

#### 4. **Design System** (`artifacts/pathpilot/src/lib/design-system.ts`)
Premium design language inspired by Apple, Linear, Notion, and Stripe:
- Sophisticated color palette (deep blacks, vibrant blue accents)
- Premium typography with Inter font
- Rigid 4px/8px spacing grid
- Subtle shadows and smooth transitions
- Component variants for buttons, cards, inputs

## Database Schema Updates

### New/Updated Tables

#### `simulations`
```sql
ALTER TABLE simulations ADD COLUMN metrics_definition JSONB DEFAULT '[]';
ALTER TABLE simulations ADD COLUMN starting_scenario_key TEXT DEFAULT 'start';
```

#### `simulation_sessions`
```sql
ALTER TABLE simulation_sessions ADD COLUMN career_metrics JSONB DEFAULT '{}';
ALTER TABLE simulation_sessions ADD COLUMN current_scenario_key TEXT DEFAULT 'start';
ALTER TABLE simulation_sessions ADD COLUMN decision_history JSONB DEFAULT '[]';
```

#### `scenarios` (New)
```sql
CREATE TABLE scenarios (
  id SERIAL PRIMARY KEY,
  simulation_id INTEGER NOT NULL REFERENCES simulations(id),
  scenario_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  choices JSONB NOT NULL DEFAULT '[]',
  metrics_impact JSONB NOT NULL DEFAULT '{}',
  consequence TEXT,
  citation TEXT,
  time_limit INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `opportunities_expanded` (New)
```sql
CREATE TABLE opportunities_expanded (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  career_categories TEXT[] DEFAULT '{}',
  skill_relevance TEXT[] DEFAULT '{}',
  difficulty TEXT DEFAULT 'intermediate',
  deadline TIMESTAMP WITH TIME ZONE,
  location TEXT,
  time_commitment TEXT,
  application_link TEXT,
  relevance_score REAL DEFAULT 0.5,
  why_it_matches TEXT,
  stipend TEXT,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  testimonials JSONB DEFAULT '[]',
  application_count INTEGER DEFAULT 0,
  acceptance_rate REAL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Implementation Phases

### Phase 1: Backend Integration
1. Run database migrations to update schemas
2. Integrate `simulation-engine.ts` into the API
3. Create API endpoints:
   - `POST /api/simulations/:id/start` - Initialize simulation
   - `POST /api/simulations/sessions/:sessionId/choose` - Process choice
   - `GET /api/simulations/sessions/:sessionId` - Get current state
   - `GET /api/simulations/sessions/:sessionId/analysis` - Get analysis

### Phase 2: Frontend Integration
1. Update simulation UI to use new branching engine
2. Integrate behavioral analysis into analysis page
3. Update roadmap page to use new roadmap builder
4. Implement design system across all components

### Phase 3: Opportunity Engine
1. Seed opportunities database with sample data
2. Create API endpoints:
   - `GET /api/opportunities` - List opportunities
   - `GET /api/opportunities/:id` - Get opportunity details
   - `POST /api/opportunities/:id/save` - Save opportunity
   - `GET /api/opportunities/recommendations` - Get personalized recommendations

### Phase 4: Landing Page
1. Replace current landing page with new premium design
2. Add interactive simulation preview
3. Add testimonials section
4. Optimize for conversions

## Sample Scenario Structure

```typescript
{
  scenarioKey: "se_intro",
  title: "Welcome to TechCorp",
  description: "You've just joined TechCorp as a junior software engineer...",
  stageNumber: 1,
  choices: [
    {
      id: "se_intro_a",
      text: "Ask Sarah about the current codebase and architecture",
      nextScenarioKey: "se_codebase",
      metricsImpact: { "Product Quality": 5, "Technical Debt": -5 },
      consequence: "Sarah appreciates your initiative and gives you a thorough overview.",
      riskLevel: "low"
    },
    {
      id: "se_intro_b",
      text: "Jump into the first task without asking questions",
      nextScenarioKey: "se_first_bug",
      metricsImpact: { "Deadline Progress": 10, "Product Quality": -10 },
      consequence: "You start working quickly, but you miss important context.",
      riskLevel: "high"
    }
  ]
}
```

## API Endpoints Reference

### Simulations

#### Start Simulation
```
POST /api/simulations/:id/start
Response: { sessionId, currentScenario, careerMetrics, behavioralMetrics }
```

#### Process Choice
```
POST /api/simulations/sessions/:sessionId/choose
Body: { choiceId }
Response: { newState, consequence, nextScenario, metricsUpdated }
```

#### Get Session State
```
GET /api/simulations/sessions/:sessionId
Response: { currentScenario, careerMetrics, behavioralMetrics, decisionHistory, score }
```

#### Get Analysis
```
GET /api/simulations/sessions/:sessionId/analysis
Response: { primaryMatch, secondaryMatch, confidenceScore, strengths, growthAreas, summary }
```

### Opportunities

#### List Opportunities
```
GET /api/opportunities?category=internship&careerCategory=software_engineer
Response: { opportunities: [...], total, page }
```

#### Get Recommendations
```
GET /api/opportunities/recommendations
Response: { recommended: [...], saved: [...], applied: [...] }
```

#### Save Opportunity
```
POST /api/opportunities/:id/save
Body: { notes }
Response: { saved: true, addedAt }
```

### Roadmap

#### Get Roadmap
```
GET /api/roadmap
Response: { phases, milestones, completionPercentage }
```

#### Update Milestone
```
PATCH /api/roadmap/milestones/:id
Body: { status, notes, dueDate }
Response: { updated: true }
```

#### Add Opportunity to Roadmap
```
POST /api/roadmap/add-opportunity
Body: { opportunityId, phaseId }
Response: { milestone: {...} }
```

## Frontend Components to Update

### Simulation Page (`/simulate/:sessionId`)
- Replace linear scenario display with branching engine
- Add real-time metric visualization
- Show decision consequences
- Track decision history

### Analysis Page (`/analysis/:sessionId`)
- Display behavioral profile visualization
- Show career recommendations with reasoning
- Display decision patterns
- Link to opportunities and roadmap

### Roadmap Page (`/roadmap`)
- Implement Notion-like interface
- Add drag-and-drop milestone reordering
- Show phase timelines
- Integrate opportunity saving

### Landing Page (`/`)
- Replace with premium design
- Add interactive simulation preview
- Add testimonials
- Optimize for conversions

## Performance Considerations

1. **Scenario Caching**: Cache branching scenarios in memory to reduce database queries
2. **Metric Calculations**: Pre-calculate metric impacts to avoid runtime computation
3. **Behavioral Analysis**: Run analysis asynchronously after simulation completion
4. **Opportunity Matching**: Use vector similarity for efficient opportunity recommendations

## Testing Strategy

### Unit Tests
- Test simulation engine logic
- Test behavioral analysis calculations
- Test roadmap builder functions

### Integration Tests
- Test API endpoints
- Test database operations
- Test end-to-end simulation flow

### User Testing
- Test with sample student users
- Gather feedback on simulation realism
- Validate recommendation accuracy

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Backend API endpoints implemented and tested
- [ ] Frontend components updated and styled
- [ ] Landing page deployed
- [ ] Opportunities database seeded
- [ ] Sample scenarios loaded
- [ ] Analytics tracking implemented
- [ ] Error handling and logging configured
- [ ] Performance optimizations applied
- [ ] Security review completed
- [ ] User documentation created
- [ ] Beta testing completed

## Next Steps

1. **Immediate**: Run database migrations and deploy backend changes
2. **Week 1**: Integrate simulation engine into frontend
3. **Week 2**: Implement behavioral analysis and update analysis page
4. **Week 3**: Build opportunity engine and integrate into UI
5. **Week 4**: Deploy landing page and optimize for conversions
6. **Week 5**: Beta testing and user feedback
7. **Week 6**: Final polish and production deployment

## Support & Resources

- **Design System**: See `artifacts/pathpilot/src/lib/design-system.ts`
- **Simulation Engine**: See `lib/db/src/simulation-engine.ts`
- **Behavioral Analysis**: See `lib/db/src/behavioral-analysis.ts`
- **Roadmap Builder**: See `lib/db/src/roadmap-builder.ts`
- **Sample Scenarios**: See `scripts/src/branching-scenarios.ts`

## Questions & Feedback

For questions about the implementation, refer to the ARCHITECTURE.md file or the inline code documentation.
