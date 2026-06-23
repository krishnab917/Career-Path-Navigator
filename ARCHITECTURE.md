# PathPilot Architecture & Design System Plan

## 1. Overview

PathPilot is transitioning from a lightweight student project to a venture-backed, simulation-first career discovery platform. The goal is to create an experience that feels like a premium consumer product (akin to Duolingo, Notion, Apple, Xbox, and Linear) rather than a traditional school guidance tool.

This document outlines the architectural changes and design system required to achieve this vision, focusing on deep career simulations, behavioral analysis, a large-scale opportunity engine, a comprehensive roadmap builder, and a world-class modern UI.

## 2. Core Architectural Changes

The current architecture is a Vite React SPA with a workspace-generated API client and a Drizzle ORM backend. The existing data model is relatively shallow, relying on linear scenarios and hard-coded data. We need to expand this significantly.

### 2.1. Simulation Engine (Branching & Metrics)

**Current State:** Simulations are linear, 5-stage experiences stored as JSON blobs in the `simulations` table. Decisions have immediate consequences but no persistent state or branching paths.
**Target State:** A dynamic, branching narrative engine with persistent consequences and career-specific metrics.

*   **Data Model Updates:**
    *   `simulations`: Add `metricsDefinition` (JSON) to define career-specific metrics (e.g., Product Quality, Team Morale for Software Engineer).
    *   `scenarios`: Create a dedicated table (or complex JSON structure) for scenarios, supporting a graph structure (nodes and edges) instead of a linear array. Each scenario needs `id`, `title`, `description`, `choices` (array of objects linking to next `scenarioId`), and `metricsImpact`.
    *   `simulation_sessions`: Add `currentMetrics` (JSON) to track the live state of career-specific metrics. Add `history` (JSON array) to track the path taken.
*   **Engine Logic:** The backend (or client-side engine) must evaluate choices, update metrics, and determine the next scenario based on the branching logic.

### 2.2. Behavioral Analysis Engine

**Current State:** Recommendations are based primarily on self-reported interests during onboarding.
**Target State:** Recommendations are driven by observed behavior during simulations.

*   **Data Model Updates:**
    *   `decisions`: Add `behavioralImpact` (JSON) to track how a choice reflects traits like Risk Tolerance, Leadership, etc.
    *   `profiles`: Add `behavioralProfile` (JSON) to aggregate these traits over time.
*   **Analysis Logic:** A scoring system that updates the user's behavioral profile after each simulation session. The recommendation engine will match this profile against ideal profiles for various careers.

### 2.3. Large-Scale Opportunity Engine

**Current State:** A simple listing of opportunities.
**Target State:** A massive database of opportunities (internships, programs, etc.) linked to careers and skills.

*   **Data Model Updates:**
    *   `opportunities`: Expand fields to include `difficulty`, `careerRelevance`, `skillRelevance`, `timeCommitment`, and `applicationLink`.
*   **Generation/Seeding:** We need a robust script to generate or seed hundreds of realistic opportunities across various careers.

### 2.4. Roadmap Builder

**Current State:** Basic AI suggestions and custom milestones.
**Target State:** A "career operating system" resembling Notion.

*   **Data Model Updates:**
    *   `user_roadmap_items`: Enhance to support rich text descriptions, attachments/links, and better organization (by semester/year).
*   **UI/UX:** A drag-and-drop interface, timeline views, and seamless integration with the Opportunity Engine (saving opportunities directly to the roadmap).

## 3. Design System & UI Redesign

The UI must move away from generic templates and adopt a premium, intentional design language.

### 3.1. Inspiration & Aesthetics

*   **Apple/Xbox:** High-end visual hierarchy, large imagery, smooth transitions.
*   **Linear/Notion:** Exceptional spacing, premium typography, consistent component system, focus on productivity and clarity.
*   **Avoid:** Neon colors, glassmorphism, clutter, generic dashboards.

### 3.2. Core Components

*   **Typography:** Use a premium sans-serif font (e.g., Inter or a custom web font) with strict typographic scales.
*   **Spacing:** Implement a rigid 4px/8px grid system for consistent padding and margins.
*   **Colors:** A sophisticated, muted color palette with high-contrast accents for primary actions. Dark mode should be deep and rich, not just inverted colors.
*   **Cards & Containers:** Subtle borders, soft shadows (or flat design with clear boundaries), and clean layouts.
*   **Animations:** Professional, subtle animations (using Framer Motion) for state changes, page transitions, and interactive elements.

### 3.3. Key Pages to Redesign

1.  **Landing Page:** Needs a complete overhaul to be investor-ready. Sections: Hero, Problem, Solution, Interactive Preview, Testimonials, Outcomes, CTA.
2.  **Simulation Interface:** Must feel like a lightweight management game. Clear display of career metrics, stakes, and consequences.
3.  **Roadmap Builder:** Needs a Notion-like feel for organizing milestones and opportunities.
4.  **Dashboard:** Move from a generic summary to a personalized, actionable hub.

## 4. Implementation Plan

1.  **Phase 3:** Update database schemas for branching simulations and build the core engine logic. Update the `update-scenarios.ts` script to seed complex, branching data.
2.  **Phase 4:** Implement the behavioral tracking logic in the simulation engine and update the analysis page to reflect observed behavior.
3.  **Phase 5:** Expand the `opportunities` schema and create a script to generate a large dataset. Update the UI to handle this scale.
4.  **Phase 6:** Enhance the roadmap data model and build the Notion-like UI for managing it.
5.  **Phase 7:** Apply the new design system across all components and build the world-class landing page.
6.  **Phase 8:** Final integration, testing, and pushing to GitHub.
