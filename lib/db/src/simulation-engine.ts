/**
 * Simulation Engine
 * Handles the core logic for branching career simulations, including:
 * - Scenario progression
 * - Metrics calculations
 * - Consequence application
 * - Decision history tracking
 */

import { BranchingScenario, Choice } from "./schema/simulations";

export interface SimulationState {
  currentScenarioKey: string;
  careerMetrics: Record<string, number>;
  behavioralMetrics: Record<string, number>;
  decisionHistory: DecisionRecord[];
  score: number;
  completedAt?: Date;
}

export interface DecisionRecord {
  scenarioKey: string;
  choiceId: string;
  choiceText: string;
  consequence?: string;
  metricsImpactApplied: Record<string, number>;
  timestamp: Date;
}

export interface SimulationContext {
  scenarios: Record<string, BranchingScenario>;
  metricsDefinition: Array<{ name: string; initialValue: number }>;
  startingScenarioKey: string;
}

/**
 * Initialize a new simulation session state
 */
export function initializeSimulationState(context: SimulationContext): SimulationState {
  const careerMetrics: Record<string, number> = {};
  context.metricsDefinition.forEach((metric) => {
    careerMetrics[metric.name] = metric.initialValue;
  });

  return {
    currentScenarioKey: context.startingScenarioKey,
    careerMetrics,
    behavioralMetrics: {
      riskTolerance: 50,
      leadership: 50,
      communication: 50,
      problemSolving: 50,
      adaptability: 50,
      resilience: 50,
      strategicThinking: 50,
      collaboration: 50,
    },
    decisionHistory: [],
    score: 0,
  };
}

/**
 * Get the current scenario
 */
export function getCurrentScenario(
  context: SimulationContext,
  state: SimulationState
): BranchingScenario | null {
  return context.scenarios[state.currentScenarioKey] || null;
}

/**
 * Process a player choice and update the simulation state
 */
export function processChoice(
  context: SimulationContext,
  state: SimulationState,
  choiceId: string
): { newState: SimulationState; consequence: string; nextScenario: BranchingScenario | null } {
  const currentScenario = getCurrentScenario(context, state);
  if (!currentScenario) {
    throw new Error(`Scenario not found: ${state.currentScenarioKey}`);
  }

  const choice = currentScenario.choices.find((c) => c.id === choiceId);
  if (!choice) {
    throw new Error(`Choice not found: ${choiceId}`);
  }

  const newState = JSON.parse(JSON.stringify(state)) as SimulationState;

  // Apply metrics impact
  const metricsImpact = choice.metricsImpact || {};
  Object.entries(metricsImpact).forEach(([metricName, impact]) => {
    if (newState.careerMetrics[metricName] !== undefined) {
      newState.careerMetrics[metricName] = Math.max(
        0,
        Math.min(100, newState.careerMetrics[metricName] + impact)
      );
    }
  });

  // Update behavioral metrics based on choice characteristics
  updateBehavioralMetrics(newState, choice);

  // Record the decision
  const decisionRecord: DecisionRecord = {
    scenarioKey: state.currentScenarioKey,
    choiceId,
    choiceText: choice.text,
    consequence: choice.consequence,
    metricsImpactApplied: metricsImpact,
    timestamp: new Date(),
  };
  newState.decisionHistory.push(decisionRecord);

  // Move to next scenario
  newState.currentScenarioKey = choice.nextScenarioKey;

  // Calculate score based on metrics
  newState.score = calculateScore(newState.careerMetrics);

  // Check if simulation is complete
  if (choice.nextScenarioKey === "end") {
    newState.completedAt = new Date();
  }

  const nextScenario = getCurrentScenario(context, newState);
  const consequence = choice.consequence || "Your choice has been recorded.";

  return { newState, consequence, nextScenario };
}

/**
 * Update behavioral metrics based on choice characteristics
 */
function updateBehavioralMetrics(state: SimulationState, choice: Choice): void {
  // Analyze choice text and impact to infer behavioral traits
  const choiceText = choice.text.toLowerCase();
  const impact = choice.metricsImpact || {};

  // Risk tolerance: choices with high negative impact or bold decisions
  if (choiceText.includes("risk") || choiceText.includes("bold") || choiceText.includes("aggressive")) {
    state.behavioralMetrics.riskTolerance = Math.min(100, state.behavioralMetrics.riskTolerance + 5);
  }
  if (choiceText.includes("safe") || choiceText.includes("careful")) {
    state.behavioralMetrics.riskTolerance = Math.max(0, state.behavioralMetrics.riskTolerance - 5);
  }

  // Leadership: choices involving team or people
  if (
    choiceText.includes("lead") ||
    choiceText.includes("team") ||
    choiceText.includes("mentor") ||
    choiceText.includes("manage")
  ) {
    state.behavioralMetrics.leadership = Math.min(100, state.behavioralMetrics.leadership + 5);
  }

  // Communication: choices involving discussion or collaboration
  if (
    choiceText.includes("discuss") ||
    choiceText.includes("communicate") ||
    choiceText.includes("ask") ||
    choiceText.includes("collaborate")
  ) {
    state.behavioralMetrics.communication = Math.min(100, state.behavioralMetrics.communication + 5);
  }

  // Problem-solving: choices involving analysis or solutions
  if (
    choiceText.includes("solve") ||
    choiceText.includes("analyze") ||
    choiceText.includes("optimize") ||
    choiceText.includes("improve")
  ) {
    state.behavioralMetrics.problemSolving = Math.min(100, state.behavioralMetrics.problemSolving + 5);
  }

  // Adaptability: choices involving flexibility or change
  if (
    choiceText.includes("adapt") ||
    choiceText.includes("flexible") ||
    choiceText.includes("balance") ||
    choiceText.includes("sustainable")
  ) {
    state.behavioralMetrics.adaptability = Math.min(100, state.behavioralMetrics.adaptability + 5);
  }

  // Resilience: choices involving recovery or perseverance
  if (
    choiceText.includes("recover") ||
    choiceText.includes("rebuild") ||
    choiceText.includes("persevere") ||
    choiceText.includes("learn")
  ) {
    state.behavioralMetrics.resilience = Math.min(100, state.behavioralMetrics.resilience + 5);
  }

  // Strategic thinking: choices involving long-term planning
  if (
    choiceText.includes("strategy") ||
    choiceText.includes("long-term") ||
    choiceText.includes("plan") ||
    choiceText.includes("initiative")
  ) {
    state.behavioralMetrics.strategicThinking = Math.min(100, state.behavioralMetrics.strategicThinking + 5);
  }

  // Collaboration: choices involving teamwork
  if (
    choiceText.includes("collaborate") ||
    choiceText.includes("team") ||
    choiceText.includes("together") ||
    choiceText.includes("partner")
  ) {
    state.behavioralMetrics.collaboration = Math.min(100, state.behavioralMetrics.collaboration + 5);
  }
}

/**
 * Calculate overall score based on career metrics
 * Score is the average of all metrics, with bonuses for balanced metrics
 */
function calculateScore(careerMetrics: Record<string, number>): number {
  const values = Object.values(careerMetrics);
  if (values.length === 0) return 0;

  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // Calculate variance (lower variance = more balanced = higher score)
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const balanceBonus = Math.max(0, 20 - variance / 5); // Bonus for balanced metrics

  return Math.round(average + balanceBonus);
}

/**
 * Get behavioral profile based on decision history
 * Returns a summary of observed behavioral traits
 */
export function getBehavioralProfile(state: SimulationState): Record<string, number> {
  return state.behavioralMetrics;
}

/**
 * Get decision summary
 */
export function getDecisionSummary(state: SimulationState): {
  totalDecisions: number;
  pathTaken: string[];
  keyDecisions: DecisionRecord[];
} {
  return {
    totalDecisions: state.decisionHistory.length,
    pathTaken: state.decisionHistory.map((d) => d.scenarioKey),
    keyDecisions: state.decisionHistory.slice(-5), // Last 5 decisions
  };
}

/**
 * Determine career recommendations based on behavioral profile
 * This is a simplified version; the full version would use ML
 */
export function getCareerRecommendations(
  behavioralProfile: Record<string, number>
): Array<{ career: string; score: number; reasoning: string }> {
  const recommendations: Array<{ career: string; score: number; reasoning: string }> = [];

  // Software Engineer: high problem-solving, communication, and strategic thinking
  const seScore =
    (behavioralProfile.problemSolving +
      behavioralProfile.communication +
      behavioralProfile.strategicThinking) /
    3;
  recommendations.push({
    career: "Software Engineer",
    score: seScore,
    reasoning: "Strong problem-solving and strategic thinking skills",
  });

  // Manager: high leadership, communication, and collaboration
  const managerScore =
    (behavioralProfile.leadership + behavioralProfile.communication + behavioralProfile.collaboration) / 3;
  recommendations.push({
    career: "Manager",
    score: managerScore,
    reasoning: "Strong leadership and people skills",
  });

  // Entrepreneur: high risk tolerance and strategic thinking
  const entrepreneurScore =
    (behavioralProfile.riskTolerance + behavioralProfile.strategicThinking + behavioralProfile.resilience) / 3;
  recommendations.push({
    career: "Entrepreneur",
    score: entrepreneurScore,
    reasoning: "High risk tolerance and strategic vision",
  });

  // Consultant: high communication and problem-solving
  const consultantScore =
    (behavioralProfile.communication + behavioralProfile.problemSolving + behavioralProfile.adaptability) / 3;
  recommendations.push({
    career: "Consultant",
    score: consultantScore,
    reasoning: "Strong communication and problem-solving abilities",
  });

  // Sort by score and return top 3
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
}
