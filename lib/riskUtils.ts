/**
 * Shared risk-classification and JSON extraction utilities.
 * Extracted here so they can be unit-tested independently of Next.js components.
 */

export function riskColor(level?: string): string {
    switch ((level ?? "").toLowerCase()) {
        case "high": return "#ff6b6b";
        case "medium": return "#f59e0b";
        case "low": return "#10b981";
        default: return "#7a9bb5";
    }
}

export function riskLabel(level?: string): string {
    switch ((level ?? "").toLowerCase()) {
        case "high": return "HIGH RISK";
        case "medium": return "MEDIUM RISK";
        case "low": return "LOW RISK";
        default: return "UNKNOWN";
    }
}

/**
 * Strips markdown code fences and extracts the first JSON object.
 * Gemini sometimes wraps JSON in ```json … ``` even when told not to.
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
