import { riskColor, riskLabel, extractJSON } from "@/lib/riskUtils";

// ── riskColor ──────────────────────────────────────────────────────────────────
describe("riskColor", () => {
    it("returns red (#ff6b6b) for high risk", () => {
        expect(riskColor("high")).toBe("#ff6b6b");
    });
    it("returns amber (#f59e0b) for medium risk", () => {
        expect(riskColor("medium")).toBe("#f59e0b");
    });
    it("returns green (#10b981) for low risk", () => {
        expect(riskColor("low")).toBe("#10b981");
    });
    it("is case-insensitive", () => {
        expect(riskColor("HIGH")).toBe("#ff6b6b");
        expect(riskColor("Medium")).toBe("#f59e0b");
        expect(riskColor("LOW")).toBe("#10b981");
    });
    it("returns default slate color for unknown / undefined input", () => {
        expect(riskColor("critical")).toBe("#7a9bb5");
        expect(riskColor()).toBe("#7a9bb5");
        expect(riskColor("")).toBe("#7a9bb5");
    });
});

// ── riskLabel ──────────────────────────────────────────────────────────────────
describe("riskLabel", () => {
    it("returns HIGH RISK for high", () => {
        expect(riskLabel("high")).toBe("HIGH RISK");
    });
    it("returns MEDIUM RISK for medium", () => {
        expect(riskLabel("medium")).toBe("MEDIUM RISK");
    });
    it("returns LOW RISK for low", () => {
        expect(riskLabel("low")).toBe("LOW RISK");
    });
    it("returns UNKNOWN for undefined / unrecognised input", () => {
        expect(riskLabel()).toBe("UNKNOWN");
        expect(riskLabel("extreme")).toBe("UNKNOWN");
    });
});

// ── extractJSON ────────────────────────────────────────────────────────────────
describe("extractJSON", () => {
    it("parses a clean JSON string", () => {
        const result = extractJSON('{"risk_level":"high","density_percent":75}');
        expect(result.risk_level).toBe("high");
        expect(result.density_percent).toBe(75);
    });

    it("strips ```json ... ``` fences before parsing", () => {
        const result = extractJSON('```json\n{"risk_level":"low"}\n```');
        expect(result.risk_level).toBe("low");
    });

    it("strips plain ``` ... ``` fences without a language tag", () => {
        const result = extractJSON("```\n{\"risk_level\":\"medium\"}\n```");
        expect(result.risk_level).toBe("medium");
    });

    it("extracts JSON even when surrounded by prose", () => {
        const result = extractJSON('Here is the analysis: {"risk_level":"high"} Hope that helps.');
        expect(result.risk_level).toBe("high");
    });

    it("throws a descriptive error when no JSON object is found", () => {
        expect(() => extractJSON("No JSON here at all")).toThrow("No JSON object");
    });

    it("throws on malformed JSON", () => {
        expect(() => extractJSON("{bad: json, no quotes}")).toThrow();
    });
});
