/**
 * @file riskUtils.ts
 * Shared risk-classification and JSON extraction utilities.
 * Extracted here so they can be unit-tested independently of Next.js components.
 */

/**
 * Returns the HEX colour string associated with a risk level.
 * - `"high"`   → red (#ff6b6b)
 * - `"medium"` → amber (#f59e0b)
 * - `"low"`    → green (#10b981)
 * - anything else → slate (#7a9bb5)
 *
 * Comparison is case-insensitive so values from both the API response
 * (`"high"`) and the RiskBadge enum (`"High"`) work without normalisation.
 */
export function riskColor(level?: string): string {
    switch ((level ?? "").toLowerCase()) {
        case "high": return "#ff6b6b";
        case "medium": return "#f59e0b";
        case "low": return "#10b981";
        default: return "#7a9bb5";
    }
}

/**
 * Returns the human-readable label for a risk level, suitable for display
 * in the results panel banner (e.g. "HIGH RISK", "MEDIUM RISK", "LOW RISK").
 * Falls back to `"UNKNOWN"` for unrecognised or missing values.
 */
export function riskLabel(level?: string): string {
    switch ((level ?? "").toLowerCase()) {
        case "high": return "HIGH RISK";
        case "medium": return "MEDIUM RISK";
        case "low": return "LOW RISK";
        default: return "UNKNOWN";
    }
}

/**
 * Strips markdown code fences and extracts the first JSON object from a string.
 *
 * Gemini sometimes wraps JSON in ` ```json … ``` ` even when instructed not to.
 * This function strips those fences before attempting `JSON.parse`, preventing
 * spurious parse errors in the API route.
 *
 * @param text - Raw text from the Gemini model response.
 * @returns Parsed JSON object.
 * @throws {Error} If no JSON object is found, or if the JSON is malformed.
 */
export function extractJSON(text: string): Record<string, unknown> {
    const stripped = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`No JSON object in model response: ${text.slice(0, 200)}`);
    return JSON.parse(match[0]);
}
