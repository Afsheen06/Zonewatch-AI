import ZoneCard from "@/components/ZoneCard";
import { RiskLevel } from "@/components/RiskBadge";

const ZONES: {
    id: string;
    name: string;
    location: string;
    capacity: number;
    currentLoad: number;
    riskLevel: RiskLevel;
    lastUpdated: string;
    icon: string;
}[] = [
        {
            id: "gate-a",
            name: "Gate A",
            location: "North Entry · Level 1",
            capacity: 4500,
            currentLoad: 4100,
            riskLevel: "High",
            lastUpdated: "30s ago",
            icon: "🚨",
        },
        {
            id: "gate-b",
            name: "Gate B",
            location: "South Entry · Level 1",
            capacity: 4000,
            currentLoad: 2200,
            riskLevel: "Medium",
            lastUpdated: "45s ago",
            icon: "🚪",
        },
        {
            id: "main-concourse",
            name: "Main Concourse",
            location: "Central Hub · Level 2",
            capacity: 12000,
            currentLoad: 5400,
            riskLevel: "Low",
            lastUpdated: "1m ago",
            icon: "🏛",
        },
        {
            id: "exit-ramp",
            name: "Exit Ramp",
            location: "West Egress · Level 0",
            capacity: 6000,
            currentLoad: 5600,
            riskLevel: "High",
            lastUpdated: "20s ago",
            icon: "⚠️",
        },
        {
            id: "food-court-north",
            name: "Food Court North",
            location: "North Wing · Level 2",
            capacity: 3500,
            currentLoad: 2100,
            riskLevel: "Medium",
            lastUpdated: "2m ago",
            icon: "🍔",
        },
        {
            id: "stairwell-3",
            name: "Stairwell 3",
            location: "East Block · Level 1–4",
            capacity: 800,
            currentLoad: 210,
            riskLevel: "Low",
            lastUpdated: "1m ago",
            icon: "🪜",
        },
    ];

export default function Dashboard() {
    const highCount = ZONES.filter((z) => z.riskLevel === "High").length;
    const medCount = ZONES.filter((z) => z.riskLevel === "Medium").length;
    const lowCount = ZONES.filter((z) => z.riskLevel === "Low").length;

    return (
        <div style={{ minHeight: "calc(100vh - 60px)", background: "#080c14", padding: "2rem 1.5rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Page header */}
                <div style={{ marginBottom: "2rem" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "1rem",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.62rem",
                                    color: "#8ba0b5",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    marginBottom: 6,
                                }}
                            >
                                ◈ Operations · Zone Overview
                            </div>
                            <h1
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "1.6rem",
                                    fontWeight: 700,
                                    color: "#e2e8f0",
                                    letterSpacing: "0.02em",
                                    marginBottom: 6,
                                }}
                            >
                                Stadium Command Dashboard
                            </h1>
                            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#7a9bb5" }}>
                                Real-time occupancy · hazard detection · crowd flow analysis
                            </p>
                        </div>

                        {/* Alert summary */}
                        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                            {[
                                { count: highCount, label: "CRITICAL", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
                                { count: medCount, label: "WARNING", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
                                { count: lowCount, label: "CLEAR", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
                            ].map(({ count, label, color, bg }) => (
                                <div
                                    key={label}
                                    style={{
                                        background: bg,
                                        border: `1px solid ${color}44`,
                                        borderRadius: 7,
                                        padding: "0.6rem 0.9rem",
                                        textAlign: "center",
                                        minWidth: 70,
                                    }}
                                >
                                    <div style={{ fontFamily: "monospace", fontSize: "1.4rem", fontWeight: 700, color }}>{count}</div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color, letterSpacing: "0.1em", opacity: 0.8 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Separator */}
                    <div style={{ height: 1, background: "linear-gradient(90deg, #1a3151, transparent)", marginTop: "1.5rem" }} />
                </div>

                {/* Live ticker */}
                <div
                    style={{
                        background: "#0d1520",
                        border: "1px solid #1a3151",
                        borderRadius: 7,
                        padding: "0.55rem 1rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        overflow: "hidden",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "monospace",
                            fontSize: "0.6rem",
                            color: "#ff6b6b",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            flexShrink: 0,
                            padding: "0.15rem 0.4rem",
                            background: "rgba(255,107,107,0.12)",
                            border: "1px solid rgba(255,107,107,0.3)",
                            borderRadius: 3,
                        }}
                    >
                        ● LIVE
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#7a9bb5" }}>
                        Gate A — Queue backing into stairwell 3 · Exit Ramp — Capacity 93% · Gate B — Flow rate nominal · Match kick-off T-00:14:32
                    </span>
                </div>

                {/* Zone grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                        gap: "1.25rem",
                    }}
                >
                    {ZONES.map((zone) => (
                        <ZoneCard key={zone.id} {...zone} />
                    ))}
                </div>

                {/* Footer info */}
                <div
                    style={{
                        marginTop: "2rem",
                        fontFamily: "monospace",
                        fontSize: "0.6rem",
                        color: "#627d98",
                        textAlign: "center",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    ZoneWatch AI · FIFA WC 2026 Operations · Data refreshes every 30s · Wire to live CCTV feeds for production
                </div>
            </div>
        </div>
    );
}
