/**
 * ============================================================================
 * SCENARIO REGISTRY
 * ============================================================================
 *
 * Central index of all available simulations.
 * Add new scenarios here for discovery and routing.
 */

import { SimulationScenario } from "../simulation-engine";
import STARTUP_CRISIS_SCENARIO from "./startup-crisis";

export const AVAILABLE_SCENARIOS: Record<string, SimulationScenario> = {
  [STARTUP_CRISIS_SCENARIO.id]: STARTUP_CRISIS_SCENARIO,
};

export const getScenarioById = (id: string): SimulationScenario | null => {
  return AVAILABLE_SCENARIOS[id] || null;
};

export const getScenarios = (): SimulationScenario[] => {
  return Object.values(AVAILABLE_SCENARIOS);
};

export const getScenarioMetadata = () => {
  return getScenarios().map((scenario) => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    role: scenario.role,
    estimated_duration_minutes: scenario.estimated_duration_minutes,
    difficulty: scenario.initial_pressure_level > 0.6 ? "High" : "Medium",
  }));
};
