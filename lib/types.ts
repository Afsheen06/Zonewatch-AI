/**
 * @file types.ts
 * Shared TypeScript types for ZoneWatch AI.
 *
 * Keeping types in `lib/` decouples them from any specific component file
 * and allows both server-side (API route) and client-side code to import them
 * without pulling in React or Next.js client dependencies.
 */

/**
 * The combined result returned by `/api/analyze-zone`.
 * Fields from the vision call and the operational-brief call are merged
 * into this single object, along with request metadata.
 */
export interface AnalysisResult {
    // ── Vision call fields ────────────────────────────────────────────────────
    /** Estimated percentage of the area that is occupied (0–100). */
    density_percent?: number;
    /** Overall risk classification derived from crowd density and hazard assessment. */
    risk_level?: "low" | "medium" | "high";
    /** One-sentence description of the observed hazard or congestion pattern. */
    hazard_description?: string;
    /** Model's confidence note — what is clearly visible vs. uncertain. */
    confidence_note?: string;

    // ── Operational brief fields ──────────────────────────────────────────────
    /** Specific, actionable instruction for venue staff. */
    recommended_action?: string;
    /** The staff role that should be notified (e.g. "Gate Marshal"). */
    staff_role_to_notify?: string;
    /** Short, calm message suitable for display to fans in the zone. */
    fan_message_english?: string;
    /** One-liner combining risk level and recommended action for the dashboard feed. */
    severity_summary?: string;

    // ── Request metadata ──────────────────────────────────────────────────────
    /** Name of the zone that was analysed. */
    zone?: string;
    /** Gemini model identifier used for the analysis. */
    model?: string;
    /** ISO-8601 timestamp of when the analysis was completed. */
    timestamp?: string;

    // ── Error case ────────────────────────────────────────────────────────────
    /** Human-readable error message when the analysis fails. */
    error?: string;
}
