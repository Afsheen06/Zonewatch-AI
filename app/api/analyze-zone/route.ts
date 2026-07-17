import { NextRequest, NextResponse } from "next/server";
import { extractJSON } from "@/lib/riskUtils";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function callGemini(apiKey: string, parts: object[]): Promise<string> {
    const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({ contents: [{ parts }] }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
}


// ── POST /api/analyze-zone ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            imageBase64,
            mediaType = "image/jpeg",
            zoneName = "Unknown Zone",
        }: { imageBase64: string; mediaType: string; zoneName: string } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "Missing required field: imageBase64" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY environment variable is not set." },
                { status: 500 }
            );
        }

        // ── Call 1: Vision analysis ───────────────────────────────────────────
        const visionText = await callGemini(apiKey, [
            {
                inline_data: {
                    mime_type: mediaType,
                    data: imageBase64,
                },
            },
            {
                text:
                    "You are a stadium safety observer analyzing a crowd photo. " +
                    "Look at the image and return ONLY valid JSON with these fields: " +
                    "density_percent (integer 0-100 estimate of how full the area is), " +
                    "risk_level (exactly one of: 'low', 'medium', or 'high'), " +
                    "hazard_description (one specific sentence about what you actually observe — " +
                    "congestion pattern, blocked pathways, bottlenecks), " +
                    "confidence_note (one sentence on what is clearly visible vs uncertain). " +
                    "Do not include markdown formatting or backticks, only raw JSON.",
            },
        ]);

        const visionData = extractJSON(visionText) as {
            density_percent: number;
            risk_level: "low" | "medium" | "high";
            hazard_description: string;
            confidence_note: string;
        };

        // ── Call 2: Operational brief ─────────────────────────────────────────
        const briefText = await callGemini(apiKey, [
            {
                text:
                    "You are a stadium operations coordinator. " +
                    "Given this zone analysis, write ONLY valid JSON with: " +
                    "recommended_action (one specific, actionable sentence for venue staff), " +
                    "staff_role_to_notify (e.g. 'Gate Marshal', 'Medical Team', 'Crowd Steward'), " +
                    "fan_message_english (a short calm reassuring message for fans in this zone, 1-2 sentences), " +
                    "severity_summary (one sentence combining risk level and action for the dashboard feed). " +
                    "No markdown, only raw JSON.\n\n" +
                    `Zone: ${zoneName}\n` +
                    `Analysis: ${JSON.stringify(visionData)}`,
            },
        ]);

        const briefData = extractJSON(briefText) as {
            recommended_action: string;
            staff_role_to_notify: string;
            fan_message_english: string;
            severity_summary: string;
        };

        return NextResponse.json({
            ...visionData,
            ...briefData,
            zone: zoneName,
            model: GEMINI_MODEL,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[analyze-zone] Error:", message);

        let clientError = "An unexpected error occurred during zone analysis.";
        if (message.includes("Gemini API")) {
            const match = message.match(/Gemini API (\d+)/);
            const status = match ? match[1] : "error";
            clientError = `Analysis service error (Status ${status}). Please try again later.`;
        } else if (message.includes("GEMINI_API_KEY")) {
            clientError = "GEMINI_API_KEY environment variable is not set.";
        }

        return NextResponse.json(
            { error: clientError, zone: "unknown", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}

// ── GET /api/analyze-zone  (health check) ─────────────────────────────────────
export async function GET() {
    return NextResponse.json({
        status: "ok",
        service: "ZoneWatch AI — Zone Analyzer",
        version: "3.0.0",
        model: GEMINI_MODEL,
        calls_per_request: 2,
        configured: !!process.env.GEMINI_API_KEY,
    });
}
