/**
 * @file constants.ts
 * Shared constants for the ZoneWatch AI application.
 *
 * Centralising these values prevents magic numbers from scattering across
 * components and makes future threshold adjustments a single-line change.
 */

import { RiskLevel } from "@/components/RiskBadge";

// ── Image validation ──────────────────────────────────────────────────────────

/** Maximum accepted upload size (10 MB). */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/** MIME types accepted by the image uploader. */
export const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
] as const;

// ── Density thresholds (used in DensityBar, ResultsPanel) ────────────────────

/** Crowd density percentage at or above which risk is HIGH. */
export const DENSITY_HIGH_THRESHOLD = 75;

/** Crowd density percentage at or above which risk is MEDIUM. */
export const DENSITY_MEDIUM_THRESHOLD = 50;

// ── Capacity-load thresholds (used in ZoneCard) ───────────────────────────────

/** Occupancy percentage at or above which load colour turns red (HIGH). */
export const LOAD_HIGH_THRESHOLD = 90;

/** Occupancy percentage at or above which load colour turns amber (MEDIUM). */
export const LOAD_MEDIUM_THRESHOLD = 70;

// ── Risk colour tokens ────────────────────────────────────────────────────────

export const COLOR_HIGH = "#ff6b6b";
export const COLOR_MEDIUM = "#f59e0b";
export const COLOR_LOW = "#10b981";
/** Neutral/unknown risk colour. */
export const COLOR_DEFAULT = "#7a9bb5";

// ── base64 encoding ───────────────────────────────────────────────────────────

/**
 * Chunk size for iterative base64 encoding.
 * Processing large Uint8Arrays in chunks avoids call-stack overflows.
 */
export const BASE64_CHUNK_SIZE = 8192;

// ── Zone data ─────────────────────────────────────────────────────────────────

/** Static metadata for each monitored zone (icon, display name, location). */
export const ZONE_META: Record<string, { name: string; icon: string; location: string }> = {
    "gate-a": { name: "Gate A", icon: "🚨", location: "North Entry · Level 1" },
    "gate-b": { name: "Gate B", icon: "🚪", location: "South Entry · Level 1" },
    "main-concourse": { name: "Main Concourse", icon: "🏛", location: "Central Hub · Level 2" },
    "exit-ramp": { name: "Exit Ramp", icon: "⚠️", location: "West Egress · Level 0" },
    "food-court-north": { name: "Food Court North", icon: "🍔", location: "North Wing · Level 2" },
    "stairwell-3": { name: "Stairwell 3", icon: "🪜", location: "East Block · L1–4" },
};

/** Full zone data for the dashboard grid. */
export const ZONES: {
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

// ── Sample images for the image uploader ─────────────────────────────────────

/** Curated sample CCTV images used in the ImageUploader component. */
export const SAMPLE_IMAGES = [
    {
        id: "sample-1",
        label: "Gate Crowd",
        emoji: "🏟️",
        description: "Dense queue at stadium entry gates",
        url: "https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=800&q=80",
    },
    {
        id: "sample-2",
        label: "Concourse",
        emoji: "🚶",
        description: "Main concourse during half-time rush",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    },
    {
        id: "sample-3",
        label: "Exit Ramp",
        emoji: "🚪",
        description: "Post-match exit ramp congestion",
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    },
    {
        id: "sample-4",
        label: "Aerial View",
        emoji: "🛸",
        description: "Aerial overview of stadium grounds",
        url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    },
] as const;

/** Type for a single sample image entry. */
export type SampleImage = typeof SAMPLE_IMAGES[number];
