import Link from "next/link";

export default function Home() {
    return (
        <div
            style={{
                minHeight: "calc(100vh - 60px)",
                background: "#080c14",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
            }}
        >
            {/* Grid background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(0, 168, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 168, 255, 0.04) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                }}
            />

            {/* Radial glow */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 700,
                    background: "radial-gradient(ellipse, rgba(0, 102, 204, 0.12) 0%, rgba(0, 168, 255, 0.04) 40%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "15%",
                    right: "15%",
                    width: 300,
                    height: 300,
                    background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 780 }}>
                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "rgba(0, 168, 255, 0.08)",
                        border: "1px solid rgba(0, 168, 255, 0.25)",
                        borderRadius: 20,
                        padding: "0.35rem 1rem",
                        marginBottom: "2rem",
                    }}
                >
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#10b981",
                            boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
                            display: "inline-block",
                            animation: "statusPulse 2s ease-in-out infinite",
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "monospace",
                            fontSize: "0.68rem",
                            color: "#7a9bb5",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                        }}
                    >
                        FIFA World Cup 2026 · Stadium Ops Platform
                    </span>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        marginBottom: "0.5rem",
                        color: "#e2e8f0",
                    }}
                >
                    Zone
                    <span
                        style={{
                            color: "#00a8ff",
                            textShadow: "0 0 30px rgba(0, 168, 255, 0.6), 0 0 60px rgba(0, 168, 255, 0.2)",
                        }}
                    >
                        Watch
                    </span>{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        AI
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
                        color: "#7a9bb5",
                        marginBottom: "1.5rem",
                        lineHeight: 1.6,
                        maxWidth: 600,
                        margin: "0 auto 1.5rem",
                    }}
                >
                    GenAI-powered crowd intelligence and hazard detection for stadium zones —
                    keeping 90,000 fans safe in real time.
                </p>

                {/* Feature chips */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.6rem",
                        justifyContent: "center",
                        marginBottom: "2.5rem",
                    }}
                >
                    {[
                        { icon: "👁", text: "Vision AI Analysis" },
                        { icon: "⚡", text: "Real-time Monitoring" },
                        { icon: "🏟", text: "6 Venue Zones" },
                        { icon: "🚨", text: "Instant Hazard Alerts" },
                    ].map(({ icon, text }) => (
                        <div
                            key={text}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid #1a3151",
                                borderRadius: 6,
                                padding: "0.3rem 0.75rem",
                                fontFamily: "monospace",
                                fontSize: "0.72rem",
                                color: "#7a9bb5",
                            }}
                        >
                            <span>{icon}</span>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                        <button
                            className="cta-btn-primary"
                            style={{
                                background: "linear-gradient(135deg, #0066cc, #00a8ff)",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                padding: "0.9rem 2rem",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "0 0 25px rgba(0, 168, 255, 0.3)",
                            }}
                        >
                            ⟫ Enter Command Center
                        </button>
                    </Link>
                    <Link href="/zone/gate-a" style={{ textDecoration: "none" }}>
                        <button
                            style={{
                                background: "transparent",
                                color: "#7a9bb5",
                                border: "1px solid #1a3151",
                                borderRadius: 8,
                                padding: "0.9rem 1.5rem",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                letterSpacing: "0.05em",
                            }}
                            className="cta-btn-secondary"
                        >
                            View Demo Zone
                        </button>
                    </Link>
                </div>

                {/* Stats bar */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "1px",
                        background: "#1a3151",
                        border: "1px solid #1a3151",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginTop: "4rem",
                        maxWidth: 550,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    {[
                        { value: "6", label: "Monitored Zones" },
                        { value: "94%", label: "AI Accuracy" },
                        { value: "<2s", label: "Analysis Time" },
                    ].map(({ value, label }) => (
                        <div
                            key={label}
                            style={{
                                background: "#0d1520",
                                padding: "1rem",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "1.4rem",
                                    fontWeight: 700,
                                    color: "#00a8ff",
                                    marginBottom: 4,
                                }}
                            >
                                {value}
                            </div>
                            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#7a9bb5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
