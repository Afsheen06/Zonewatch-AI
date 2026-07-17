import Link from "next/link";
import RiskBadge, { RiskLevel } from "./RiskBadge";

interface ZoneCardProps {
    id: string;
    name: string;
    location: string;
    capacity: number;
    currentLoad: number;
    riskLevel: RiskLevel;
    lastUpdated: string;
    icon: string;
}

function getLoadColor(pct: number): string {
    if (pct >= 90) return "#ff6b6b";
    if (pct >= 70) return "#f59e0b";
    return "#10b981";
}

export default function ZoneCard({
    id, name, location, capacity, currentLoad, riskLevel, lastUpdated, icon
}: ZoneCardProps) {
    const loadPct = Math.round((currentLoad / capacity) * 100);
    const loadColor = getLoadColor(loadPct);

    return (
        <div
            style={{
                background: "#0f1c2e",
                border: "1px solid #1a3151",
                borderRadius: 10,
                padding: "1.25rem",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "default",
            }}
            className="zone-card"
        >
            {/* Top corner accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    background: "linear-gradient(225deg, rgba(0, 168, 255, 0.08), transparent)",
                    borderBottomLeftRadius: 60,
                    pointerEvents: "none",
                }}
            />

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            background: "rgba(0, 168, 255, 0.08)",
                            border: "1px solid rgba(0, 168, 255, 0.2)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            flexShrink: 0,
                        }}
                    >
                        <span role="img" aria-hidden="true">{icon}</span>
                    </div>
                    <div>
                        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem", fontFamily: "monospace" }}>
                            {name}
                        </div>
                        <div style={{ color: "#7a9bb5", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>
                            {location}
                        </div>
                    </div>
                </div>
                <RiskBadge level={riskLevel} size="sm" />
            </div>

            {/* Stats row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                }}
            >
                <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: 6, padding: "0.5rem 0.75rem" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#7a9bb5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
                        Occupancy
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: loadColor }}>
                        {loadPct}<span style={{ fontSize: "0.65rem", color: "#7a9bb5", marginLeft: 1 }}>%</span>
                    </div>
                </div>
                <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: 6, padding: "0.5rem 0.75rem" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#7a9bb5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
                        Persons
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: "#e2e8f0" }}>
                        {currentLoad.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Capacity bar */}
            <div style={{ marginBottom: "1rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "monospace",
                        fontSize: "0.58rem",
                        color: "#7a9bb5",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "0.35rem",
                    }}
                >
                    <span>Capacity Load</span>
                    <span style={{ color: "#7a9bb5" }}>{currentLoad.toLocaleString()} / {capacity.toLocaleString()}</span>
                </div>
                <div
                    style={{
                        height: 4,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${loadPct}%`,
                            background: `linear-gradient(90deg, ${loadColor}88, ${loadColor})`,
                            borderRadius: 2,
                            transition: "width 0.5s ease",
                            boxShadow: `0 0 6px ${loadColor}`,
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#7a9bb5", letterSpacing: "0.06em" }}>
                    ⟳ {lastUpdated}
                </span>
                <Link
                    href={`/zone/${id}`}
                    style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #0066cc, #00a8ff)",
                        color: "white",
                        borderRadius: 5,
                        padding: "0.4rem 0.85rem",
                        fontFamily: "monospace",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        transition: "all 0.2s ease",
                    }}
                    className="analyze-btn"
                >
                    ⟫ Analyze Zone
                </Link>
            </div>

        </div>
    );
}
