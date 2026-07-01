/**
 * ============================================================================
 * SIMULATION ENGINE CORE
 * ============================================================================
 *
 * Modular, reusable decision-based simulation system for PathPilot.
 * Tracks user trait evolution, consequences, and hidden system state.
 *
 * Core responsibilities:
 * - Manage simulation flow and state transitions
 * - Update trait vectors based on decisions
 * - Compute consequences and delayed feedback
 * - Maintain information asymmetry
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TraitVector {
  risk_tolerance: number;
  analytical_thinking: number;
  leadership_under_pressure: number;
  execution_speed: number;
  precision: number;
  stakeholder_management: number;
}

export interface TraitDelta {
  risk_tolerance?: number;
  analytical_thinking?: number;
  leadership_under_pressure?: number;
  execution_speed?: number;
  precision?: number;
  stakeholder_management?: number;
}

export interface StateChange {
  [key: string]: any;
}

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  trait_effects: TraitDelta;
  state_changes: StateChange;
  immediate_consequence: string;
  delayed_consequence?: {
    trigger_node?: string;
    message: string;
    reveal_at_decision_index?: number;
  };
}

export interface SimulationNode {
  id: string;
  type: "decision" | "outcome" | "consequence_reveal" | "final_analysis";
  title: string;
  context: string;
  time_pressure: number; // 0-1, where 1 is maximum pressure
  uncertainty_level: number; // 0-1
  options: DecisionOption[];
  hidden_state?: Record<string, any>;
  immediate_feedback?: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  role: string;
  environment: string;
  estimated_duration_minutes: number;
  initial_state: Record<string, any>;
  initial_pressure_level: number;
  nodes: Record<string, SimulationNode>;
  node_sequence: string[];
}

export interface UserDecisionLog {
  decision_index: number;
  node_id: string;
  selected_option_id: string;
  timestamp: number;
  trait_delta: TraitDelta;
  consequence: string;
}

export interface SimulationSession {
  session_id: string;
  scenario_id: string;
  user_traits: TraitVector;
  decision_history: UserDecisionLog[];
  current_node_index: number;
  hidden_state: Record<string, any>;
  time_pressure: number;
  revealed_consequences: string[];
  session_started_at: number;
  session_ended_at?: number;
  final_analysis?: TraitVector;
}

// ============================================================================
// SIMULATION ENGINE CLASS
// ============================================================================

export class SimulationEngine {
  private session: SimulationSession;
  private scenario: SimulationScenario;
  private delayedConsequenceQueue: Array<{
    trigger_index: number;
    message: string;
  }> = [];

  // Initial trait baseline (all users start at 50/100)
  private readonly TRAIT_BASELINE: TraitVector = {
    risk_tolerance: 50,
    analytical_thinking: 50,
    leadership_under_pressure: 50,
    execution_speed: 50,
    precision: 50,
    stakeholder_management: 50,
  };

  constructor(scenario: SimulationScenario, session_id: string) {
    this.scenario = scenario;
    this.session = {
      session_id,
      scenario_id: scenario.id,
      user_traits: { ...this.TRAIT_BASELINE },
      decision_history: [],
      current_node_index: 0,
      hidden_state: { ...scenario.initial_state },
      time_pressure: scenario.initial_pressure_level,
      revealed_consequences: [],
      session_started_at: Date.now(),
    };
  }

  /**
   * Get current simulation node
   */
  getCurrentNode(): SimulationNode {
    const node_id = this.scenario.node_sequence[this.session.current_node_index];
    if (!node_id) {
      throw new Error(
        `Invalid node index: ${this.session.current_node_index}`
      );
    }
    return this.scenario.nodes[node_id];
  }

  /**
   * Get available decision options for current node
   * Options may be filtered based on time pressure or hidden state
   */
  getAvailableOptions(): DecisionOption[] {
    const node = this.getCurrentNode();

    if (node.type !== "decision") {
      return [];
    }

    // Filter options based on time pressure or hidden state conditions
    let available = node.options;

    // High pressure: aggressive/fast options become more prominent
    if (this.session.time_pressure > 0.75) {
      available = available.filter((opt) => {
        const speed = opt.trait_effects.execution_speed ?? 0;
        return speed >= -10; // Don't hide precision-focused options entirely
      });
    }

    return available;
  }

  /**
   * Process user decision
   * Returns immediate system feedback
   */
  makeDecision(option_id: string): {
    immediate_feedback: string;
    delayed_consequences: string[];
    trait_updates: Partial<TraitVector>;
    state_changes: StateChange;
    next_node_preview?: string;
  } {
    const node = this.getCurrentNode();
    const option = node.options.find((opt) => opt.id === option_id);

    if (!option) {
      throw new Error(`Invalid option: ${option_id}`);
    }

    // ────────────────────────────────────────────────────────────────
    // 1. APPLY TRAIT DELTAS
    // ────────────────────────────────────────────────────────────────
    const trait_deltas = option.trait_effects;
    this.updateTraits(trait_deltas);

    // ────────────────────────────────────────────────────────────────
    // 2. APPLY STATE CHANGES
    // ────────────────────────────────────────────────────────────────
    this.updateHiddenState(option.state_changes);

    // ────────────────────────────────────────────────────────────────
    // 3. INCREASE TIME PRESSURE
    // ────────────────────────────────────────────────────────────────
    this.session.time_pressure = Math.min(
      1,
      this.session.time_pressure + 0.15
    );

    // ────────────────────────────────────────────────────────────────
    // 4. LOG DECISION
    // ────────────────────────────────────────────────────────────────
    const decision_log: UserDecisionLog = {
      decision_index: this.session.decision_history.length,
      node_id: node.id,
      selected_option_id: option_id,
      timestamp: Date.now(),
      trait_delta: trait_deltas,
      consequence: option.immediate_consequence,
    };
    this.session.decision_history.push(decision_log);

    // ────────────────────────────────────────────────────────────────
    // 5. HANDLE DELAYED CONSEQUENCES
    // ────────────────────────────────────────────────────────────────
    const revealed_delayed: string[] = [];

    if (option.delayed_consequence) {
      const trigger_index =
        option.delayed_consequence.reveal_at_decision_index ??
        this.session.decision_history.length + 2;

      this.delayedConsequenceQueue.push({
        trigger_index,
        message: option.delayed_consequence.message,
      });
    }

    // Check if any delayed consequences should be revealed NOW
    const queue_to_process = this.delayedConsequenceQueue.filter(
      (item) => item.trigger_index <= this.session.decision_history.length
    );

    queue_to_process.forEach((item) => {
      revealed_delayed.push(item.message);
      this.session.revealed_consequences.push(item.message);
    });

    this.delayedConsequenceQueue = this.delayedConsequenceQueue.filter(
      (item) => item.trigger_index > this.session.decision_history.length
    );

    // ────────────────────────────────────────────────────────────────
    // 6. ADVANCE TO NEXT NODE
    // ────────────────────────────────────────────────────────────────
    this.session.current_node_index++;

    const next_node_preview =
      this.session.current_node_index < this.scenario.node_sequence.length
        ? this.getCurrentNode().title
        : undefined;

    return {
      immediate_feedback: option.immediate_consequence,
      delayed_consequences: revealed_delayed,
      trait_updates: trait_deltas,
      state_changes: option.state_changes,
      next_node_preview,
    };
  }

  /**
   * Update trait vector with incremental deltas
   * Clamps values to 0-100 range
   */
  private updateTraits(deltas: TraitDelta): void {
    const updated: TraitVector = { ...this.session.user_traits };

    Object.entries(deltas).forEach(([key, delta]) => {
      if (delta !== undefined && key in updated) {
        const trait_key = key as keyof TraitVector;
        updated[trait_key] = Math.max(
          0,
          Math.min(100, updated[trait_key] + delta)
        );
      }
    });

    this.session.user_traits = updated;
  }

  /**
   * Update hidden system state
   * This represents the "world state" that affects future options
   */
  private updateHiddenState(changes: StateChange): void {
    this.session.hidden_state = {
      ...this.session.hidden_state,
      ...changes,
    };
  }

  /**
   * Check if simulation is complete
   */
  isSimulationComplete(): boolean {
    return (
      this.session.current_node_index >= this.scenario.node_sequence.length
    );
  }

  /**
   * Get current session state (visible to frontend)
   */
  getSessionState() {
    return {
      session_id: this.session.session_id,
      scenario_id: this.session.scenario_id,
      current_node: this.getCurrentNode(),
      available_options: this.getAvailableOptions(),
      user_traits: this.session.user_traits,
      time_pressure: this.session.time_pressure,
      decision_count: this.session.decision_history.length,
      revealed_consequences: this.session.revealed_consequences,
      is_complete: this.isSimulationComplete(),
    };
  }

  /**
   * Get decision history (for analysis)
   */
  getDecisionHistory(): UserDecisionLog[] {
    return this.session.decision_history;
  }

  /**
   * Get hidden state snapshot (for debugging/admin)
   */
  getHiddenState(): Record<string, any> {
    return { ...this.session.hidden_state };
  }

  /**
   * Finalize simulation and compute final analysis
   */
  finalize(): SimulationSession {
    this.session.session_ended_at = Date.now();
    this.session.final_analysis = { ...this.session.user_traits };
    return this.session;
  }

  /**
   * Generate simulation summary for analysis page
   */
  generateSummary() {
    return {
      session_id: this.session.session_id,
      scenario_name: this.scenario.name,
      total_decisions: this.session.decision_history.length,
      duration_seconds: (this.session.session_ended_at ?? Date.now()) - this.session.session_started_at,
      final_traits: this.session.user_traits,
      trait_changes: this.calculateTraitChanges(),
      revealed_consequences: this.session.revealed_consequences,
      hidden_state_final: this.session.hidden_state,
    };
  }

  /**
   * Calculate trait deltas from baseline
   */
  private calculateTraitChanges(): Partial<TraitVector> {
    const changes: Partial<TraitVector> = {};
    (Object.keys(this.TRAIT_BASELINE) as Array<keyof TraitVector>).forEach(
      (key) => {
        changes[key] =
          this.session.user_traits[key] - this.TRAIT_BASELINE[key];
      }
    );
    return changes;
  }
}
