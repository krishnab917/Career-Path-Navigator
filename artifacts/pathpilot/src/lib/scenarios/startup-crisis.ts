/**
 * ============================================================================
 * SCENARIO: STARTUP ENGINEERING CRISIS
 * ============================================================================
 *
 * A high-pressure product release simulation where the user is an engineer
 * facing critical decisions with 36 hours until launch.
 *
 * Domain: Fast-moving startup, investor scrutiny, technical debt, team morale
 *
 * Features:
 * - 5 decision nodes with branching outcomes
 * - 6+ trait updates across decisions
 * - Hidden system state tracking (bug severity, team morale, investor confidence)
 * - Delayed consequences revealed during later decisions
 * - Information asymmetry (user doesn't see full state)
 */

import {
  SimulationScenario,
  SimulationNode,
  DecisionOption,
} from "../simulation-engine";

// ============================================================================
// SCENARIO SETUP
// ============================================================================

const STARTUP_CRISIS_SCENARIO: SimulationScenario = {
  id: "startup-engineering-crisis",
  name: "Startup Engineering Crisis",
  description: "36 hours to launch. Critical bugs. Investor pressure. Your call.",
  role: "Lead Engineer",
  environment: "Series B startup, Series B funding just closed, board looking closely",
  estimated_duration_minutes: 18,

  initial_state: {
    time_to_launch_hours: 36,
    critical_bugs_count: 3,
    team_morale: 65,
    investor_confidence: 78,
    production_status: "staging",
    incident_reports: 0,
    deployment_count: 0,
    code_review_queue: 12,
  },

  initial_pressure_level: 0.4,

  nodes: {
    // ────────────────────────────────────────────────────────────────
    // NODE 1: INITIAL CRISIS DISCOVERY
    // ────────────────────────────────────────────────────────────────
    "node-1-crisis-discovery": {
      id: "node-1-crisis-discovery",
      type: "decision",
      title: "Critical Bug Discovered",
      context: `You're 36 hours from product launch. Your QA lead just surfaced a critical authentication bug in the payment flow—users can bypass 2FA in certain conditions. 

The bug affects ~5% of users under specific timing windows. It's in core infrastructure, so any fix requires careful refactoring.

Your team is already at 80% capacity. Three other P1 tickets are queued. The board is on a call in 2 hours to review launch readiness.

What do you do?`,
      time_pressure: 0.4,
      uncertainty_level: 0.7,
      hidden_state: {
        actual_bug_severity: "critical",
        affected_user_percentage: 5,
        fix_time_hours: 8,
        detection_method: "manual-qa",
      },
      options: [
        {
          id: "opt-1-1-immediate-fix",
          label: "Immediately start the fix",
          description: "Pull team to focus on the bug. Delay other work.",
          trait_effects: {
            precision: 15,
            analytical_thinking: 12,
            execution_speed: 8,
            risk_tolerance: -5,
            leadership_under_pressure: 10,
          },
          state_changes: {
            critical_bugs_count: 2,
            team_morale: -10,
            code_review_queue: 18,
            time_to_launch_hours: 35,
            focus_mode: "bug_fix",
          },
          immediate_consequence:
            "System alert: Team realigned to critical infrastructure fix. Code review queue growing.",
          delayed_consequence: {
            reveal_at_decision_index: 3,
            message:
              "System: Fix completed but incomplete testing. 2 new regressions detected in staging.",
          },
        },
        {
          id: "opt-1-2-risk-assessment",
          label: "Assess the real impact first",
          description: "Deep-dive into the bug scope. Understand the actual risk.",
          trait_effects: {
            analytical_thinking: 18,
            precision: 10,
            execution_speed: -8,
            stakeholder_management: 12,
            risk_tolerance: 8,
          },
          state_changes: {
            critical_bugs_count: 3,
            team_morale: 5,
            code_review_queue: 12,
            time_to_launch_hours: 34,
            assessment_in_progress: true,
          },
          immediate_consequence:
            "System: Risk assessment initiated. Team waiting on direction. Investor call in 90 minutes.",
          delayed_consequence: {
            reveal_at_decision_index: 2,
            message:
              "System: Assessment revealed the bug is more contained than initially reported. Affects 1.2% of flows.",
          },
        },
        {
          id: "opt-1-3-workaround",
          label: "Ship with a runtime workaround",
          description:
            "Deploy a temporary server-side mitigation. Fix the root cause post-launch.",
          trait_effects: {
            execution_speed: 20,
            risk_tolerance: 18,
            precision: -15,
            leadership_under_pressure: 5,
            analytical_thinking: -10,
          },
          state_changes: {
            critical_bugs_count: 2,
            team_morale: 15,
            code_review_queue: 6,
            time_to_launch_hours: 36,
            workaround_deployed: true,
            technical_debt_increase: "high",
          },
          immediate_consequence:
            "System: Workaround deployed to staging. Authentication flow rerouted. Team unblocked.",
          delayed_consequence: {
            reveal_at_decision_index: 4,
            message:
              "ALERT: Workaround causing 3% of legitimate users to fail authentication. Incident reports rising.",
          },
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // NODE 2: STAKEHOLDER PRESSURE (Response to NODE 1)
    // ────────────────────────────────────────────────────────────────
    "node-2-investor-call": {
      id: "node-2-investor-call",
      type: "decision",
      title: "Investor Board Call",
      context: `The board call is starting in 15 minutes. Your CEO is asking for a status update on launch readiness.

You have three options for framing the situation:
1. Full transparency about the bug and your plan
2. Highlight progress, mention bug as "known and managed"
3. Push for a 48-hour delay to ensure confidence

The board is expecting a "green light" or concerns. They have other portfolio companies to think about.`,
      time_pressure: 0.65,
      uncertainty_level: 0.5,
      hidden_state: {
        board_risk_tolerance: "moderate",
        reputational_risk_high: true,
      },
      options: [
        {
          id: "opt-2-1-full-transparency",
          label: "Full transparency: explain the bug and mitigation plan",
          trait_effects: {
            stakeholder_management: 18,
            leadership_under_pressure: 15,
            risk_tolerance: -10,
            precision: 12,
            analytical_thinking: 8,
          },
          state_changes: {
            investor_confidence: -8,
            team_morale: 12,
            transparency_score: "high",
          },
          immediate_consequence:
            "System: Board informed of critical bug and containment strategy. Questions raised but plan accepted.",
          delayed_consequence: {
            reveal_at_decision_index: 4,
            message:
              "System: Board's transparency appreciated. CEO gains trust. Contingency resources allocated.",
          },
        },
        {
          id: "opt-2-2-managed-framing",
          label: "Managed framing: highlight mitigation, minimize urgency",
          trait_effects: {
            execution_speed: 12,
            risk_tolerance: 16,
            stakeholder_management: 8,
            precision: -12,
            analytical_thinking: -8,
          },
          state_changes: {
            investor_confidence: 15,
            team_morale: 8,
            transparency_score: "low",
            reputation_risk: true,
          },
          immediate_consequence:
            "System: Board approves launch. No concerns flagged. Pressure lifted temporarily.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "CRITICAL: Board discovers undisclosed bug post-launch. Trust damaged. CEO under scrutiny.",
          },
        },
        {
          id: "opt-2-3-request-delay",
          label: "Request 48-hour delay for full validation",
          trait_effects: {
            precision: 20,
            analytical_thinking: 16,
            risk_tolerance: -20,
            execution_speed: -18,
            leadership_under_pressure: -5,
          },
          state_changes: {
            investor_confidence: -15,
            time_to_launch_hours: 84,
            team_morale: -20,
            launch_delayed: true,
          },
          immediate_consequence:
            "System: Board denies delay. Market timing is critical. You're back to 36-hour window.",
          delayed_consequence: {
            reveal_at_decision_index: 3,
            message:
              "System: Investor sentiment shifts negative. Questions about team execution capability.",
          },
        },
      ],
    },

    // ──────────────────────────────────��─────────────────────────────
    // NODE 3: TEAM MANAGEMENT DECISION
    // ────────────────────────────────────────────────────────────────
    "node-3-team-direction": {
      id: "node-3-team-direction",
      type: "decision",
      title: "Team Morale & Direction",
      context: `12 hours until launch. Your team is exhausted. They've been grinding for 72+ hours straight.

You just received news: the bug fix path is more complex than initially assessed. Best-case scenario: 6 more hours of focused work. Worst-case: 14 hours.

The team is questioning whether shipping is the right call. Some want to halt and fix properly. Others are burning out and want to ship and move on.

How do you lead?`,
      time_pressure: 0.8,
      uncertainty_level: 0.6,
      hidden_state: {
        team_fatigue_level: "critical",
        actual_fix_time_remaining: 7,
        team_turnover_risk: "moderate",
      },
      options: [
        {
          id: "opt-3-1-motivate-push",
          label: "Rally the team. Push hard for the next 12 hours.",
          trait_effects: {
            leadership_under_pressure: 22,
            execution_speed: 16,
            risk_tolerance: 12,
            precision: -10,
            stakeholder_management: 10,
          },
          state_changes: {
            team_morale: 20,
            time_to_launch_hours: 12,
            team_fatigue_level: "extreme",
          },
          immediate_consequence:
            "System: Team energized by leadership. Collective focus activated. Productivity surge.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Post-launch, 2 key engineers request sabbaticals. Burnout signals detected.",
          },
        },
        {
          id: "opt-3-2-honest-assessment",
          label: "Be honest: present realistic timeline and let team decide",
          trait_effects: {
            stakeholder_management: 16,
            leadership_under_pressure: 12,
            precision: 14,
            execution_speed: -8,
            analytical_thinking: 10,
          },
          state_changes: {
            team_morale: 12,
            transparency_score: "high",
            team_autonomy: "respected",
          },
          immediate_consequence:
            "System: Team appreciates honesty. Volunteers for additional effort with realistic expectations.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Team remains engaged post-launch. Retention rates stable. Trust reinforced.",
          },
        },
        {
          id: "opt-3-3-split-team",
          label: "Split the team: fix track vs. ship-as-is track",
          trait_effects: {
            analytical_thinking: 18,
            execution_speed: 10,
            leadership_under_pressure: 14,
            precision: 12,
            risk_tolerance: 8,
          },
          state_changes: {
            team_morale: 8,
            team_split: true,
            coordination_complexity: "high",
          },
          immediate_consequence:
            "System: Team splits into parallel work streams. Risk: integration failures.",
          delayed_consequence: {
            reveal_at_decision_index: 4,
            message:
              "System: Parallel work creates merge conflicts. Final 4 hours consumed by integration testing.",
          },
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // NODE 4: FINAL LAUNCH DECISION
    // ────────────────────────────────────────────────────────────────
    "node-4-launch-decision": {
      id: "node-4-launch-decision",
      type: "decision",
      title: "Launch Go/No-Go Decision",
      context: `2 hours until launch window closes. Your team has made progress, but the original authentication bug is still present at reduced severity.

Staging environment shows the fix is ~80% reliable. Production simulation tests pass, but real-world behavior could differ.

You have a critical decision: ship now or request emergency delay. If you delay, the board will likely kill the launch entirely.

This is your call.`,
      time_pressure: 0.95,
      uncertainty_level: 0.8,
      hidden_state: {
        actual_bug_severity_current: "moderate",
        affected_users_if_shipped: 2.5,
        delay_consequences: "product-kill",
      },
      options: [
        {
          id: "opt-4-1-ship-now",
          label: "Ship with current state. Monitor closely.",
          trait_effects: {
            execution_speed: 20,
            risk_tolerance: 22,
            leadership_under_pressure: 18,
            precision: -18,
            analytical_thinking: -12,
          },
          state_changes: {
            production_status: "live",
            deployment_count: 1,
            monitoring_intensity: "high",
          },
          immediate_consequence:
            "System: Launch initiated. Code deployed to production. Rollout at 25% traffic.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: 18 minutes post-launch. Error rate spike detected. Authentication failures at 2.1%. On-call team investigating.",
          },
        },
        {
          id: "opt-4-2-final-fix-attempt",
          label: "One more fix cycle. Final push.",
          trait_effects: {
            precision: 18,
            analytical_thinking: 14,
            execution_speed: -10,
            risk_tolerance: -15,
            leadership_under_pressure: 8,
          },
          state_changes: {
            time_to_launch_hours: 1,
            team_fatigue_level: "critical+",
            code_review_queue: 8,
          },
          immediate_consequence:
            "System: Team mobilized for final fix. 90 minutes on the clock. High-risk, high-reward.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Fix completed 12 minutes before window. Production deployment clean. No incidents.",
          },
        },
        {
          id: "opt-4-3-emergency-delay",
          label: "Request emergency 24-hour delay",
          trait_effects: {
            precision: 20,
            risk_tolerance: -25,
            execution_speed: -22,
            analytical_thinking: 12,
            leadership_under_pressure: -10,
          },
          state_changes: {
            time_to_launch_hours: 24,
            investor_confidence: -30,
            team_morale: -25,
            launch_cancelled: true,
          },
          immediate_consequence:
            "System: Board rejects delay request. Insufficient new information to justify postponement. Launch cancelled.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Startup acquires competitor 3 months later at lower valuation. Market timing critical.",
          },
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // NODE 5: POST-LAUNCH INCIDENT RESPONSE
    // ────────────────────────────────────────────────────────────────
    "node-5-incident-management": {
      id: "node-5-incident-management",
      type: "decision",
      title: "Production Incident Escalation",
      context: `You've been live for 90 minutes. Your monitoring system is lighting up.

Authentication errors are at 2.8% (higher than predicted). Users are complaining on social media. The on-call team is overwhelmed.

Your options:
1. Roll back immediately and investigate
2. Deploy a hotfix while staying live
3. Implement circuit breaker to gracefully degrade service

Each option has different downstream consequences for trust, engineering velocity, and user retention.

What's your move?`,
      time_pressure: 0.98,
      uncertainty_level: 0.9,
      hidden_state: {
        actual_error_rate: 2.8,
        root_cause_identified: true,
        rollback_time: 15,
        hotfix_time: 45,
        affected_sessions_total: 8400,
      },
      options: [
        {
          id: "opt-5-1-immediate-rollback",
          label: "Immediate rollback to previous version",
          trait_effects: {
            risk_tolerance: -20,
            execution_speed: 18,
            precision: 16,
            leadership_under_pressure: 12,
            analytical_thinking: -8,
          },
          state_changes: {
            production_status: "rolled_back",
            user_impact_total: 8400,
            reputational_impact: "moderate",
            recovery_time_minutes: 15,
          },
          immediate_consequence:
            "System: Rollback initiated. Service restored to stable state within 15 minutes. Users redirected.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Rollback decision validated by post-mortem. Team morale restored. Board respects decisive action.",
          },
        },
        {
          id: "opt-5-2-hotfix-deploy",
          label: "Deploy hotfix while service stays live",
          trait_effects: {
            execution_speed: 22,
            risk_tolerance: 18,
            precision: -12,
            leadership_under_pressure: 16,
            analytical_thinking: 10,
          },
          state_changes: {
            production_status: "degraded_then_fixed",
            user_impact_total: 12000,
            reputational_impact: "high",
            recovery_time_minutes: 45,
            code_quality_debt: "significant",
          },
          immediate_consequence:
            "System: Hotfix deployed to production. Service remains degraded during 45-minute fix window.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Hotfix introduced secondary bug. Additional 2-hour incident. Negative press coverage.",
          },
        },
        {
          id: "opt-5-3-circuit-breaker",
          label: "Deploy circuit breaker to gracefully degrade",
          trait_effects: {
            analytical_thinking: 20,
            precision: 18,
            execution_speed: 10,
            risk_tolerance: 5,
            leadership_under_pressure: 14,
          },
          state_changes: {
            production_status: "degraded_gracefully",
            user_impact_total: 2100,
            reputational_impact: "low",
            recovery_time_minutes: 90,
            technical_excellence: "demonstrated",
          },
          immediate_consequence:
            "System: Circuit breaker activated. Service degrades gracefully. 75% of auth flows succeeding.",
          delayed_consequence: {
            reveal_at_decision_index: 5,
            message:
              "System: Incident contained with minimal user impact. Industry recognized as best-practice response.",
          },
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // NODE 6: FINAL ANALYSIS
    // ────────────────────────────────────────────────────────────────
    "node-6-final-analysis": {
      id: "node-6-final-analysis",
      type: "final_analysis",
      title: "Simulation Complete",
      context: `Your simulation is complete. Your trait profile has been analyzed based on your decisions under pressure.

The system has evaluated your:
- Risk tolerance and decision-making in uncertainty
- Analytical depth vs. execution speed trade-offs
- Leadership effectiveness under extreme time pressure
- Precision focus vs. pragmatism
- Stakeholder management and communication clarity

Review your results on the next page.`,
      time_pressure: 1,
      uncertainty_level: 0,
      options: [],
    },
  },

  node_sequence: [
    "node-1-crisis-discovery",
    "node-2-investor-call",
    "node-3-team-direction",
    "node-4-launch-decision",
    "node-5-incident-management",
    "node-6-final-analysis",
  ],
};

export default STARTUP_CRISIS_SCENARIO;

/**
 * ============================================================================
 * SCENARIO DOCUMENTATION
 * ============================================================================
 *
 * TRAIT IMPACT SUMMARY:
 *
 * Risk Tolerance:
 * - Increased by: shipping with workarounds, managed framing, final decision to ship
 * - Decreased by: immediate fix focus, full transparency, final fix attempt
 *
 * Analytical Thinking:
 * - Increased by: risk assessment deep-dive, honest team assessment, circuit breaker
 * - Decreased by: workaround approach, managed framing, ship-now decision
 *
 * Leadership Under Pressure:
 * - Increased by: immediate action, full transparency, team rally, launch decision
 * - Decreased by: delay request, emergency delay, incident hesitation
 *
 * Execution Speed:
 * - Increased by: workaround, managed framing, ship now, hotfix deploy
 * - Decreased by: risk assessment, team honesty, final fix attempt, circuit breaker
 *
 * Precision:
 * - Increased by: immediate fix, full transparency, final fix, circuit breaker
 * - Decreased by: workaround, managed framing, ship now, hotfix deploy
 *
 * Stakeholder Management:
 * - Increased by: full transparency, honest team assessment, circuit breaker
 * - Decreased by: managed framing, team rally (at expense of wellbeing)
 *
 * HIDDEN STATE TRACKING:
 *
 * The scenario tracks multiple hidden variables that affect future options:
 * - critical_bugs_count: modified by decision choices
 * - team_morale: affected by leadership style and pressure
 * - investor_confidence: impacts future resource allocation
 * - technical_debt_increase: affects long-term engineering velocity
 * - reputational_risk: consequences reveal in later nodes
 *
 * DELAYED CONSEQUENCES:
 *
 * 1. Immediate fix → 2 new regressions (revealed at decision 3)
 * 2. Risk assessment → Bug more contained than thought (revealed at decision 2)
 * 3. Workaround → Users failing auth (revealed at decision 4)
 * 4. Full transparency → Board trust and resources (revealed at decision 4)
 * 5. Managed framing → Board discovers hidden bug (revealed at decision 5)
 * 6. Team rally → Burnout and retention issues (revealed at decision 5)
 * 7. Team honesty → Team engagement post-launch (revealed at decision 5)
 * 8. Final fix attempt → Clean deployment (revealed at decision 5)
 * 9. Ship now → 18-minute incident (revealed at decision 5)
 * 10. Immediate rollback → Board respects decisive action (revealed at decision 5)
 * 11. Hotfix → Secondary bug and press coverage (revealed at decision 5)
 * 12. Circuit breaker → Best-practice recognition (revealed at decision 5)
 *
 * DECISION TREE BRANCHING:
 *
 * Node 1 (Bug Discovery):
 * ├─ Immediate Fix
 * ├─ Risk Assessment
 * └─ Workaround
 *
 * Node 2 (Investor Call) - outcome independent of Node 1
 * ├─ Full Transparency
 * ├─ Managed Framing
 * └─ Request Delay
 *
 * Node 3 (Team Direction) - outcome independent of Node 1-2
 * ├─ Rally Push
 * ├─ Honest Assessment
 * └─ Split Team
 *
 * Node 4 (Launch Decision) - affects Node 5
 * ├─ Ship Now → (likely high incident)
 * ├─ Final Fix → (likely clean)
 * └─ Emergency Delay → (launch cancelled)
 *
 * Node 5 (Incident Response) - triggered based on Node 4
 * ├─ Immediate Rollback
 * ├─ Hotfix Deploy
 * └─ Circuit Breaker
 *
 * TRAIT EVOLUTION EXAMPLE (Balanced Path):
 *
 * Starting: All traits at 50
 * After Node 1 (Risk Assessment): analytical_thinking +18, precision +10, execution_speed -8
 * After Node 2 (Full Transparency): stakeholder_management +18, leadership_under_pressure +15
 * After Node 3 (Honest Assessment): stakeholder_management +16, leadership_under_pressure +12, precision +14
 * After Node 4 (Final Fix Attempt): precision +18, analytical_thinking +14, execution_speed -10
 * After Node 5 (Circuit Breaker): analytical_thinking +20, precision +18, execution_speed +10
 *
 * Final Traits: All 70-85 range with precision/analytical highest
 *
 * Career Match: Software Architect, Platform Engineer, Technical Lead
 */
