/**
 * Behavioral Analysis Engine
 * Analyzes user behavior during simulations to generate career recommendations
 * based on observed traits rather than self-reported interests
 */

import { SimulationState } from "./simulation-engine";

export interface BehavioralProfile {
  riskTolerance: number;
  leadership: number;
  communication: number;
  problemSolving: number;
  adaptability: number;
  resilience: number;
  strategicThinking: number;
  collaboration: number;
}

export interface CareerMatch {
  career: string;
  category: string;
  score: number; // 0-100
  confidence: number; // 0-100
  reasoning: string[];
  strengths: string[];
  growthAreas: string[];
  decisionPatterns: string[];
}

/**
 * Analyze behavioral profile from simulation session
 */
export function analyzeBehavioralProfile(simulationState: SimulationState): BehavioralProfile {
  return simulationState.behavioralMetrics as unknown as BehavioralProfile;
}

/**
 * Generate career recommendations based on behavioral profile
 */
export function generateCareerRecommendations(
  behavioralProfile: BehavioralProfile,
  simulationMetrics: Record<string, number>
): CareerMatch[] {
  const matches: CareerMatch[] = [];

  // Software Engineer match
  const seScore = calculateCareerScore(behavioralProfile, {
    problemSolving: 0.25,
    strategicThinking: 0.2,
    communication: 0.15,
    collaboration: 0.15,
    adaptability: 0.15,
    resilience: 0.1,
  });

  matches.push({
    career: "Software Engineer",
    category: "Technology",
    score: seScore,
    confidence: calculateConfidence(seScore, simulationMetrics),
    reasoning: [
      "Strong problem-solving and analytical thinking",
      "Ability to break down complex problems",
      "Collaborative approach to development",
    ],
    strengths: [
      "Problem-solving",
      "Strategic thinking",
      "Communication",
      "Collaboration",
    ],
    growthAreas: [
      "Leadership",
      "Risk tolerance",
      "Resilience under pressure",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "technical"),
  });

  // Product Manager match
  const pmScore = calculateCareerScore(behavioralProfile, {
    communication: 0.25,
    leadership: 0.2,
    strategicThinking: 0.2,
    collaboration: 0.15,
    adaptability: 0.15,
    problemSolving: 0.05,
  });

  matches.push({
    career: "Product Manager",
    category: "Business",
    score: pmScore,
    confidence: calculateConfidence(pmScore, simulationMetrics),
    reasoning: [
      "Strong communication and leadership skills",
      "Strategic thinking and vision",
      "Ability to collaborate across teams",
    ],
    strengths: [
      "Communication",
      "Leadership",
      "Strategic thinking",
      "Collaboration",
    ],
    growthAreas: [
      "Technical depth",
      "Problem-solving",
      "Resilience",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "leadership"),
  });

  // Data Scientist match
  const dsScore = calculateCareerScore(behavioralProfile, {
    problemSolving: 0.3,
    strategicThinking: 0.2,
    adaptability: 0.15,
    communication: 0.15,
    collaboration: 0.1,
    resilience: 0.1,
  });

  matches.push({
    career: "Data Scientist",
    category: "Technology",
    score: dsScore,
    confidence: calculateConfidence(dsScore, simulationMetrics),
    reasoning: [
      "Exceptional problem-solving abilities",
      "Analytical and strategic thinking",
      "Ability to adapt to new challenges",
    ],
    strengths: [
      "Problem-solving",
      "Analytical thinking",
      "Adaptability",
      "Strategic thinking",
    ],
    growthAreas: [
      "Communication",
      "Leadership",
      "Collaboration",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "analytical"),
  });

  // Entrepreneur match
  const entrepreneurScore = calculateCareerScore(behavioralProfile, {
    riskTolerance: 0.25,
    strategicThinking: 0.25,
    resilience: 0.2,
    leadership: 0.15,
    adaptability: 0.15,
  });

  matches.push({
    career: "Entrepreneur",
    category: "Business",
    score: entrepreneurScore,
    confidence: calculateConfidence(entrepreneurScore, simulationMetrics),
    reasoning: [
      "High risk tolerance and strategic vision",
      "Resilience in face of challenges",
      "Leadership and adaptability",
    ],
    strengths: [
      "Risk tolerance",
      "Strategic thinking",
      "Resilience",
      "Leadership",
    ],
    growthAreas: [
      "Communication",
      "Collaboration",
      "Problem-solving",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "risk"),
  });

  // Manager/Leader match
  const managerScore = calculateCareerScore(behavioralProfile, {
    leadership: 0.3,
    communication: 0.25,
    collaboration: 0.2,
    strategicThinking: 0.15,
    adaptability: 0.1,
  });

  matches.push({
    career: "Manager/Leader",
    category: "Business",
    score: managerScore,
    confidence: calculateConfidence(managerScore, simulationMetrics),
    reasoning: [
      "Strong leadership and communication skills",
      "Excellent collaboration abilities",
      "Strategic vision and adaptability",
    ],
    strengths: [
      "Leadership",
      "Communication",
      "Collaboration",
      "Strategic thinking",
    ],
    growthAreas: [
      "Problem-solving",
      "Resilience",
      "Risk tolerance",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "people"),
  });

  // Consultant match
  const consultantScore = calculateCareerScore(behavioralProfile, {
    communication: 0.2,
    problemSolving: 0.2,
    strategicThinking: 0.2,
    adaptability: 0.2,
    collaboration: 0.2,
  });

  matches.push({
    career: "Consultant",
    category: "Business",
    score: consultantScore,
    confidence: calculateConfidence(consultantScore, simulationMetrics),
    reasoning: [
      "Well-rounded skill set",
      "Strong communication and problem-solving",
      "Adaptability to different industries",
    ],
    strengths: [
      "Communication",
      "Problem-solving",
      "Strategic thinking",
      "Adaptability",
      "Collaboration",
    ],
    growthAreas: [
      "Leadership",
      "Risk tolerance",
      "Resilience",
    ],
    decisionPatterns: extractDecisionPatterns(simulationMetrics, "balanced"),
  });

  // Sort by score and return top 3
  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Calculate career match score based on behavioral profile
 */
function calculateCareerScore(
  profile: BehavioralProfile,
  weights: Record<string, number>
): number {
  let score = 0;
  let totalWeight = 0;

  for (const [trait, weight] of Object.entries(weights)) {
    const traitValue = (profile as unknown as Record<string, number>)[trait] || 50;
    score += traitValue * weight;
    totalWeight += weight;
  }

  return Math.round(score / totalWeight);
}

/**
 * Calculate confidence in recommendation
 * Based on how well the profile matches the career requirements
 */
function calculateConfidence(
  score: number,
  simulationMetrics: Record<string, number>
): number {
  // Higher score = higher confidence
  const scoreConfidence = Math.min(100, score + 20);

  // Check metric balance (lower variance = higher confidence)
  const metricValues = Object.values(simulationMetrics);
  const average = metricValues.reduce((a, b) => a + b, 0) / metricValues.length;
  const variance =
    metricValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / metricValues.length;
  const balanceConfidence = Math.max(0, 100 - variance / 2);

  // Average the two confidence measures
  return Math.round((scoreConfidence + balanceConfidence) / 2);
}

/**
 * Extract decision patterns from simulation metrics
 */
function extractDecisionPatterns(
  metrics: Record<string, number>,
  pattern: string
): string[] {
  const patterns: string[] = [];

  switch (pattern) {
    case "technical":
      if (metrics["Product Quality"] > 60) {
        patterns.push("Prioritizes code quality and correctness");
      }
      if (metrics["Technical Debt"] < 40) {
        patterns.push("Proactively manages technical debt");
      }
      if (metrics["Team Morale"] > 60) {
        patterns.push("Maintains positive team dynamics");
      }
      break;

    case "leadership":
      if (metrics["Team Morale"] > 70) {
        patterns.push("Strong ability to motivate teams");
      }
      if (metrics["Deadline Progress"] > 70) {
        patterns.push("Effective at driving results");
      }
      break;

    case "analytical":
      if (metrics["Product Quality"] > 70) {
        patterns.push("High attention to detail");
      }
      if (metrics["User Satisfaction"] > 65) {
        patterns.push("Focuses on user-centric solutions");
      }
      break;

    case "risk":
      if (metrics["Deadline Progress"] > 75) {
        patterns.push("Willing to take calculated risks for speed");
      }
      if (metrics["Technical Debt"] > 50) {
        patterns.push("Accepts short-term trade-offs for long-term gains");
      }
      break;

    case "people":
      if (metrics["Team Morale"] > 75) {
        patterns.push("Excels at building strong teams");
      }
      if (metrics["User Satisfaction"] > 70) {
        patterns.push("Customer-focused mindset");
      }
      break;

    case "balanced":
      if (
        Math.abs(metrics["Product Quality"] - 50) < 20 &&
        Math.abs(metrics["Deadline Progress"] - 50) < 20
      ) {
        patterns.push("Maintains balance between quality and speed");
      }
      break;
  }

  return patterns.length > 0 ? patterns : ["Demonstrates adaptability"];
}

/**
 * Generate detailed analysis report
 */
export function generateAnalysisReport(
  behavioralProfile: BehavioralProfile,
  simulationMetrics: Record<string, number>,
  recommendations: CareerMatch[]
): {
  primaryMatch: CareerMatch;
  secondaryMatch: CareerMatch;
  confidenceScore: number;
  strengths: string[];
  growthAreas: string[];
  summary: string;
} {
  const primaryMatch = recommendations[0];
  const secondaryMatch = recommendations[1];
  const confidenceScore = primaryMatch.confidence;

  // Aggregate strengths and growth areas
  const strengths = Array.from(
    new Set([...primaryMatch.strengths, ...secondaryMatch.strengths])
  );
  const growthAreas = Array.from(
    new Set([...primaryMatch.growthAreas, ...secondaryMatch.growthAreas])
  );

  const summary = `Based on your simulation performance, you show strong aptitude for ${primaryMatch.career} with secondary interest in ${secondaryMatch.career}. Your behavioral profile indicates ${primaryMatch.reasoning[0].toLowerCase()}. We recommend focusing on ${growthAreas[0].toLowerCase()} to further develop your skills.`;

  return {
    primaryMatch,
    secondaryMatch,
    confidenceScore,
    strengths,
    growthAreas,
    summary,
  };
}
