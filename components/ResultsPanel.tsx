"use client";

import { memo } from "react";
import { riskColor, riskLabel } from "@/lib/riskUtils";
import { DENSITY_HIGH_THRESHOLD, DENSITY_MEDIUM_THRESHOLD } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";

// Re-export AnalysisResult so existing imports from this file continue to work.
export type { AnalysisResult };

interface ResultsPanelProps {
    result: AnalysisResult | null;
    loading?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Renders an animated horizontal bar showing crowd density percentage.
 * Colour transitions from green → amber → red as density rises through the
 * DENSITY_MEDIUM_THRESHOLD and DENSITY_HIGH_THRESHOLD values.
 */
const DensityBar = memo(function DensityBar({ pct }: { pct: number }) {
    const color =
        pct >= DENSITY_HIGH_THRESHOLD ? "#ff6b6b"
            : pct >= DENSITY_MEDIUM_THRESHOLD ? "#f59e0b"
                : "#10b981";
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: "0.58rem", color: "#7a9bb5", marginBottom: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${color}55, ${color})`, borderRadius: 4, boxShadow: `0 0 8px ${color}`, transition: "width 1.2s ease" }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color, marginTop: 4 }}>{pct}% occupied</div>
        </div>
    );
});

/**
 * Generic labelled card used to display hazard details, recommended actions,
 * fan messages, etc. The `accent` colour tints the border and label.
 */
const InfoCard = memo(function InfoCard({
    label, icon, children, accent = "#00a8ff",
}: {
    label: string;
    icon: string;
    children: React.ReactNode;
    accent?: string;
}) {
    return (
        <div style={{ background: `${accent}0d`, border: `1px solid ${accent}30`, borderRadius: 8, padding: "0.85rem 1rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                <span aria-hidden="true" style={{ marginRight: "0.25rem" }}>{icon}</span> {label}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                {children}
            </div>
        </div>
    );
});

// ── Loading state ─────────────────────────────────────────────────────────────
const LoadingState = memo(function LoadingState() {
    return (
        <div style={{ background: "#0f1c2e", border: "1px solid #1a3151", borderRadius: 10, padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", minHeight: 280 }}>
            {/* Spinner — uses @keyframes spin from globals.css */}
            <div style={{ position: "relative", width: 52, height: 52 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#00a8ff", animation: "spin 1s linear infinite" }} />
                <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#f59e0b", animation: "spin 1.5s linear infinite reverse" }} />
            </div>
            <div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#7a9bb5", letterSpacing: "0.05em", textAlign: "center", marginBottom: 6 }}>
                    Running AI analysis...
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#7a9bb5", textAlign: "center" }}>
                    Call 1 · Vision scan → Call 2 · Ops brief
                </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                {["Crowd density", "Hazard detect", "Action plan"].map((s, i) => (
                    <div key={s} style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#2a4560", background: "rgba(255,255,255,0.03)", border: "1px solid #1a3151", borderRadius: 4, padding: "0.2rem 0.5rem", animation: `statusPulse ${1.2 + i * 0.4}s ease-in-out infinite` }}>
                        {s}
                    </div>
                ))}
            </div>
        </div>
    );
});

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = memo(function EmptyState() {
    return (
        <div style={{ background: "#0f1c2e", border: "1px dashed #1a3151", borderRadius: 10, padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", minHeight: 280 }}>
            <div style={{ fontSize: "2.2rem", opacity: 0.4 }} role="img" aria-hidden="true">🔬</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#7a9bb5", textAlign: "center" }}>Analysis results will appear here</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#7a9bb5", textAlign: "center", maxWidth: 260 }}>
                Select or upload an image, then click Analyze Zone to get AI-powered insights
            </div>
        </div>
    );
});

// ── Error state ───────────────────────────────────────────────────────────────
const ErrorState = memo(function ErrorState({ message }: { message: string }) {
    return (
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "1.5rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#ff6b6b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>⚠ Analysis Error</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#fca5a5", lineHeight: 1.6 }}>{message}</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#7a9bb5", marginTop: 10 }}>
                Check that GEMINI_API_KEY is set in .env.local and the server has been restarted.
            </div>
        </div>
    );
});

// ── Main component ────────────────────────────────────────────────────────────
const ResultsPanel = memo(function ResultsPanel({ result, loading = false }: ResultsPanelProps) {
    if (loading) return <LoadingState />;
    if (!result) return <EmptyState />;
    if (result.error) return <ErrorState message={result.error} />;

    const rc = riskColor(result.risk_level);
    const timeLabel = result.timestamp
        ? new Date(result.timestamp).toLocaleTimeString()
        : "";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* ── Risk banner ──────────────────────────────────────────── */}
            <div style={{ background: `${rc}18`, border: `1px solid ${rc}44`, borderRadius: 10, padding: "1.1rem 1.25rem", boxShadow: `0 0 30px ${rc}15` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div
                            style={{ width: 8, height: 8, borderRadius: "50%", background: rc, boxShadow: `0 0 8px ${rc}`, animation: "statusPulse 2s ease-in-out infinite", flexShrink: 0 }}
                            role="img"
                            aria-hidden="true"
                        />
                        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#8ba0b5", letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Analysis Complete</span>
                    </div>
                    {timeLabel && (
                        <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#7a9bb5" }}>{timeLabel}</span>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#7a9bb5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>Risk Level</div>
                        <div style={{ fontFamily: "monospace", fontSize: "1.7rem", fontWeight: 700, color: rc, letterSpacing: "0.04em" }}>{riskLabel(result.risk_level)}</div>
                    </div>
                    {typeof result.density_percent === "number" && (
                        <div style={{ flex: 1, marginLeft: "1.5rem" }}>
                            <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#7a9bb5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Crowd Density</div>
                            <DensityBar pct={result.density_percent} />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Hazard description ────────────────────────────────────── */}
            {result.hazard_description && (
                <InfoCard label="Hazard Detected" icon="⚠" accent="#f59e0b">
                    {result.hazard_description}
                </InfoCard>
            )}

            {/* ── Recommended action ────────────────────────────────────── */}
            {result.recommended_action && (
                <InfoCard label="Recommended Action" icon="⟫" accent="#00a8ff">
                    {result.recommended_action}
                </InfoCard>
            )}

            {/* ── Staff role + fan message in a row ────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem", alignItems: "start" }}>
                {result.staff_role_to_notify && (
                    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 7, padding: "0.6rem 0.9rem", whiteSpace: "nowrap" }}>
                        <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Notify</div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24" }}>🎽 {result.staff_role_to_notify}</div>
                    </div>
                )}
                {result.fan_message_english && (
                    <InfoCard label="Fan Message" icon="📢" accent="#10b981">
                        {result.fan_message_english}
                    </InfoCard>
                )}
            </div>

            {/* ── Severity summary (dashboard feed line) ────────────────── */}
            {result.severity_summary && (
                <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid #1a3151", borderRadius: 7, padding: "0.65rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: rc, fontSize: "0.7rem", flexShrink: 0 }} aria-hidden="true">◈</span>
                    <div style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#7a9bb5", lineHeight: 1.5 }}>{result.severity_summary}</div>
                </div>
            )}

            {/* ── Confidence note ───────────────────────────────────────── */}
            {result.confidence_note && (
                <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#7a9bb5", lineHeight: 1.5, paddingTop: 2 }}>
                    <span style={{ color: "#7a9bb5" }}>ℹ Confidence · </span>{result.confidence_note}
                </div>
            )}

            {/* ── Model tag ────────────────────────────────────────────── */}
            {result.model && (
                <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#2a4560", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Model · {result.model}
                </div>
            )}
        </div>
    );
});

export default ResultsPanel;
