"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import ResultsPanel, { AnalysisResult } from "@/components/ResultsPanel";

// ── Zone metadata ─────────────────────────────────────────────────────────────
const ZONE_META: Record<string, { name: string; icon: string; location: string }> = {
    "gate-a": { name: "Gate A", icon: "🚨", location: "North Entry · Level 1" },
    "gate-b": { name: "Gate B", icon: "🚪", location: "South Entry · Level 1" },
    "main-concourse": { name: "Main Concourse", icon: "🏛", location: "Central Hub · Level 2" },
    "exit-ramp": { name: "Exit Ramp", icon: "⚠️", location: "West Egress · Level 0" },
    "food-court-north": { name: "Food Court North", icon: "🍔", location: "North Wing · Level 2" },
    "stairwell-3": { name: "Stairwell 3", icon: "🪜", location: "East Block · L1–4" },
};

// ── Image → base64 helper ─────────────────────────────────────────────────────
/**
 * Converts an image source (blob URL or remote URL) to a raw base64 string
 * (no `data:...;base64,` prefix) and detects the MIME type.
 */
async function toBase64(
    src: string,
    file?: File
): Promise<{ data: string; mediaType: string }> {
    // Fast path: we have the original File object
    if (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const [header, data] = result.split(",");
                const mediaType = header.replace("data:", "").replace(";base64", "");
                resolve({ data, mediaType });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // For sample / remote URLs: fetch → arrayBuffer → base64
    const response = await fetch(src);
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const mediaType = contentType.split(";")[0];
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Encode in chunks to avoid call-stack overflows on large images
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return { data: btoa(binary), mediaType };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ZoneDetailPage() {
    const params = useParams();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = rawId ?? "";
    const meta = ZONE_META[id] ?? { name: id || "Unknown Zone", icon: "📍", location: "Unknown" };

    const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!selectedSrc) return;
        setLoading(true);
        setResult(null);

        try {
            const { data: imageBase64, mediaType } = await toBase64(selectedSrc, selectedFile);
            const res = await fetch("/api/analyze-zone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64,
                    mediaType,
                    zoneName: meta.name,
                }),
            });
            const data: AnalysisResult = await res.json();
            setResult(data);
        } catch (err) {
            setResult({
                error: err instanceof Error ? err.message : "Network error — could not reach analysis service.",
                timestamp: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    };

    const isReady = !!selectedSrc && !loading;

    return (
        <div style={{ minHeight: "calc(100vh - 60px)", background: "#080c14", padding: "2rem 1.5rem" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.65rem", color: "#7a9bb5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                    <Link href="/dashboard" style={{ color: "#00a8ff", textDecoration: "none" }}>Dashboard</Link>
                    <span>›</span>
                    <span style={{ color: "#7a9bb5" }}>{meta.name}</span>
                    <span>›</span>
                    <span>Analysis</span>
                </div>

                {/* Page header */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: 8 }}>
                        <div style={{ width: 50, height: 50, background: "rgba(0, 168, 255, 0.08)", border: "1px solid rgba(0, 168, 255, 0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                            <span role="img" aria-hidden="true">{meta.icon}</span>
                        </div>
                        <div>
                            <h1 style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>
                                {meta.name} — Zone Analysis
                            </h1>
                            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#8ba0b5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                {meta.location}
                            </p>
                        </div>
                    </div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, #1a3151, transparent)", marginTop: "1rem" }} />
                </div>

                {/* Two-column layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

                    {/* ── Left: Image input ── */}
                    <div>
                        <div style={{ background: "#0d1520", border: "1px solid #1a3151", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#8ba0b5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ color: "#00a8ff" }}>◈</span> Zone Image Input
                            </div>

                            <ImageUploader
                                onImageSelected={(src, file) => {
                                    setSelectedSrc(src);
                                    setSelectedFile(file);
                                    setResult(null);
                                }}
                            />

                            {/* Analyze button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!isReady}
                                style={{
                                    width: "100%",
                                    marginTop: "1.25rem",
                                    padding: "0.9rem",
                                    background: isReady
                                        ? "linear-gradient(135deg, #0066cc, #00a8ff)"
                                        : "rgba(0, 168, 255, 0.1)",
                                    color: isReady ? "white" : "#7a9bb5",
                                    border: `1px solid ${isReady ? "transparent" : "#1a3151"}`,
                                    borderRadius: 8,
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    cursor: isReady ? "pointer" : "not-allowed",
                                    transition: "all 0.2s ease",
                                    boxShadow: isReady ? "0 0 20px rgba(0, 168, 255, 0.3)" : "none",
                                }}
                            >
                                {loading ? "⟳ Analyzing…" : "⟫ Analyze Zone with AI"}
                            </button>

                            {!selectedSrc && (
                                <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#7a9bb5", textAlign: "center", marginTop: "0.6rem" }}>
                                    Select an image above to enable analysis
                                </p>
                            )}
                        </div>

                        {/* Zone metadata card */}
                        <div style={{ background: "#0d1520", border: "1px solid #1a3151", borderRadius: 10, padding: "1.25rem", marginTop: "1rem" }}>
                            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#8ba0b5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>◈ Zone Metadata</div>
                            {[
                                { label: "Zone ID", value: id },
                                { label: "Location", value: meta.location },
                                { label: "AI Model", value: "claude-sonnet-4-5" },
                                { label: "Analysis Mode", value: "Vision → Ops Brief (2 calls)" },
                                { label: "Status", value: "🟢 Ready" },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid rgba(26, 49, 81, 0.5)" }}>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#7a9bb5" }}>{label}</span>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#7a9bb5" }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Results ── */}
                    <div>
                        <div style={{ background: "#0d1520", border: "1px solid #1a3151", borderRadius: 10, padding: "1.5rem" }}>
                            <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#8ba0b5", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ color: "#f59e0b" }}>◈</span> AI Analysis Results
                            </div>

                            <ResultsPanel result={result} loading={loading} />

                            {/* Action log */}
                            {result && !result.error && (
                                <div style={{ marginTop: "1.25rem" }}>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#8ba0b5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>◈ Action Log</div>
                                    <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #1a3151", borderRadius: 6, padding: "0.75rem", fontFamily: "monospace", fontSize: "0.65rem", lineHeight: 2 }}>
                                        {[
                                            { icon: "✓", color: "#10b981", text: "Image received and encoded" },
                                            { icon: "✓", color: "#10b981", text: "Vision model inference complete" },
                                            { icon: "✓", color: "#10b981", text: "Operational brief generated" },
                                            {
                                                icon: "⚑",
                                                color: result.risk_level === "high" ? "#ff6b6b" : result.risk_level === "medium" ? "#f59e0b" : "#10b981",
                                                text: `Risk level: ${(result.risk_level ?? "unknown").toUpperCase()}`
                                            },
                                            { icon: "→", color: "#00a8ff", text: "Action dispatched to ops team" },
                                        ].map(({ icon, color, text }, i) => (
                                            <div key={i} style={{ color: "#7a9bb5" }}>
                                                [ {new Date(result.timestamp ?? "").toLocaleTimeString()} ]&nbsp;
                                                <span style={{ color }} aria-hidden="true">{icon}</span> {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
