"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                background: "rgba(8, 12, 20, 0.95)",
                borderBottom: "1px solid #1a3151",
                backdropFilter: "blur(12px)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    maxWidth: 1400,
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* Icon */}
                        <div
                            style={{
                                width: 34,
                                height: 34,
                                background: "linear-gradient(135deg, #0066cc, #00a8ff)",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 15px rgba(0, 168, 255, 0.4)",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
                                <circle cx="12" cy="12" r="3" fill="white" />
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <path d="M12 6v2M12 16v2M6 12H4M20 12h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <div
                                style={{
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    color: "#00a8ff",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                }}
                            >
                                ZoneWatch AI
                            </div>
                            <div
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.6rem",
                                    color: "#7a9bb5",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    marginTop: 2,
                                }}
                            >
                                FIFA WC 2026 • STADIUM OPS
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    {[
                        { href: "/", label: "HOME" },
                        { href: "/dashboard", label: "DASHBOARD" },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                fontFamily: "monospace",
                                fontSize: "0.72rem",
                                letterSpacing: "0.12em",
                                color: pathname === href ? "#00a8ff" : "#7a9bb5",
                                textDecoration: "none",
                                borderBottom: pathname === href ? "1px solid #00a8ff" : "1px solid transparent",
                                paddingBottom: 2,
                                transition: "all 0.2s ease",
                            }}
                        >
                            {label}
                        </Link>
                    ))}

                    {/* Live status indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#10b981",
                                boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
                                animation: "statusPulse 2s ease-in-out infinite",
                            }}
                            role="img"
                            aria-hidden="true"
                        />
                        <span
                            style={{
                                fontFamily: "monospace",
                                fontSize: "0.62rem",
                                color: "#10b981",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                            }}
                        >
                            LIVE
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
        </nav>
    );
}
