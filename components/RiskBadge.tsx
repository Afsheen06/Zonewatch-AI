import { memo } from "react";

export type RiskLevel = "Low" | "Medium" | "High";

interface RiskBadgeProps {
    level: RiskLevel;
    size?: "sm" | "md";
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; glow: string; dot: string }> = {
    Low: { color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", glow: "rgba(16, 185, 129, 0.4)", dot: "#10b981" },
    Medium: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", glow: "rgba(245, 158, 11, 0.4)", dot: "#f59e0b" },
    High: { color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.12)", glow: "rgba(255, 107, 107, 0.4)", dot: "#ff6b6b" },
};

/** A small pill badge displaying the risk level with a pulsing dot indicator. */
const RiskBadge = memo(function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
    const cfg = riskConfig[level];
    const isSmall = size === "sm";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: isSmall ? "0.3rem" : "0.4rem",
                padding: isSmall ? "0.15rem 0.5rem" : "0.25rem 0.65rem",
                borderRadius: 4,
                background: cfg.bg,
                border: `1px solid ${cfg.color}44`,
                color: cfg.color,
                fontFamily: "monospace",
                fontSize: isSmall ? "0.62rem" : "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                boxShadow: `0 0 10px ${cfg.glow}`,
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    width: isSmall ? 5 : 6,
                    height: isSmall ? 5 : 6,
                    borderRadius: "50%",
                    background: cfg.dot,
                    boxShadow: `0 0 5px ${cfg.glow}`,
                    display: "inline-block",
                    flexShrink: 0,
                    animation: level === "High" ? "fastPulse 0.8s ease-in-out infinite" : "statusPulse 2s ease-in-out infinite",
                }}
            />
            {level}
        </span>
    );
});

export default RiskBadge;
