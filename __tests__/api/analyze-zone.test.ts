/**
 * @jest-environment node
 *
 * API route test — mocks `fetch` so no real Gemini calls are made.
 * Verifies: successful two-call flow, Gemini 503 error, missing imageBase64 (400).
 */
import { NextRequest } from "next/server";

// We import the route handlers after setting up env so the module picks up the key
const makeReq = (body: object) =>
    new NextRequest("http://localhost/api/analyze-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

const MOCK_VISION = {
    candidates: [{
        content: {
            parts: [{
                text: JSON.stringify({
                    density_percent: 85,
                    risk_level: "high",
                    hazard_description: "Dense crowd blocking emergency exit at Gate A.",
                    confidence_note: "Clear view of main concourse area, exit signage visible.",
                }),
            }],
        },
    }],
};

const MOCK_BRIEF = {
    candidates: [{
        content: {
            parts: [{
                text: JSON.stringify({
                    recommended_action: "Deploy gate marshal to redirect crowd flow immediately.",
                    staff_role_to_notify: "Gate Marshal",
                    fan_message_english: "Please use alternate exits — staff are here to help.",
                    severity_summary: "High risk: Crowd blocking emergency exit, gate marshal dispatched.",
                }),
            }],
        },
    }],
};

describe("GET /api/analyze-zone", () => {
    it("returns health check with model name", async () => {
        const { GET } = await import("@/app/api/analyze-zone/route");
        const res = await GET();
        const data = await res.json();
        expect(data.status).toBe("ok");
        expect(data.model).toBe("gemini-flash-latest");
        expect(typeof data.configured).toBe("boolean");
    });
});

describe("POST /api/analyze-zone", () => {
    let POST: (req: NextRequest) => Promise<Response>;

    beforeAll(async () => {
        process.env.GEMINI_API_KEY = "test-key-123";
        ({ POST } = await import("@/app/api/analyze-zone/route"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it("merges vision + brief responses on success (200)", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => MOCK_VISION })
            .mockResolvedValueOnce({ ok: true, json: async () => MOCK_BRIEF });

        const res = await POST(makeReq({
            imageBase64: "base64datahere",
            mediaType: "image/jpeg",
            zoneName: "Gate A",
        }));
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.risk_level).toBe("high");
        expect(data.density_percent).toBe(85);
        expect(data.recommended_action).toBe("Deploy gate marshal to redirect crowd flow immediately.");
        expect(data.staff_role_to_notify).toBe("Gate Marshal");
        expect(data.zone).toBe("Gate A");
        expect(data.model).toBe("gemini-flash-latest");
        expect(typeof data.timestamp).toBe("string");
    });

    it("returns error JSON (500) when Gemini returns 503", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 503,
            text: async () => "Service Unavailable",
        });

        const res = await POST(makeReq({
            imageBase64: "base64datahere",
            mediaType: "image/jpeg",
            zoneName: "Gate A",
        }));
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBeDefined();
        expect(data.error).toContain("503");
        expect(data.timestamp).toBeDefined();
    });

    it("returns 400 when imageBase64 is not supplied", async () => {
        const res = await POST(makeReq({ zoneName: "Gate A" }));
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toContain("imageBase64");
    });
});
