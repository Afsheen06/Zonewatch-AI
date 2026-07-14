"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
    onImageSelected: (src: string, file?: File) => void;
}

const SAMPLE_IMAGES = [
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
];

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const [dragging, setDragging] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setSelected(url);
        onImageSelected(url, file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) handleFile(file);
    };

    const handleSample = (url: string, id: string) => {
        setSelected(id);
        onImageSelected(url);
    };

    return (
        <div>
            {/* Upload area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                    border: `2px dashed ${dragging ? "#00a8ff" : "#1a3151"}`,
                    borderRadius: 10,
                    padding: "2.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragging ? "rgba(0, 168, 255, 0.05)" : "rgba(0, 0, 0, 0.25)",
                    transition: "all 0.2s ease",
                    boxShadow: dragging ? "0 0 30px rgba(0, 168, 255, 0.15) inset" : "none",
                    marginBottom: "1.5rem",
                }}
            >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📡</div>
                <div style={{ fontFamily: "monospace", color: "#7a9bb5", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    <span style={{ color: "#00a8ff", fontWeight: 600 }}>Upload zone image</span>
                    <br />
                    <span style={{ fontSize: "0.7rem", color: "#4a6580" }}>
                        Drag & drop or click to select · PNG, JPG, WebP supported
                    </span>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />
            </div>

            {/* Sample images */}
            <div style={{ marginBottom: "1.25rem" }}>
                <div
                    style={{
                        fontFamily: "monospace",
                        fontSize: "0.65rem",
                        color: "#4a6580",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "0.75rem",
                    }}
                >
                    ◈ Load Sample Image
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.65rem" }}>
                    {SAMPLE_IMAGES.map((sample) => {
                        const isActive = selected === sample.id;
                        return (
                            <button
                                key={sample.id}
                                onClick={() => handleSample(sample.url, sample.id)}
                                style={{
                                    background: isActive ? "rgba(0, 168, 255, 0.12)" : "rgba(0, 0, 0, 0.3)",
                                    border: `1px solid ${isActive ? "#00a8ff" : "#1a3151"}`,
                                    borderRadius: 7,
                                    padding: "0.65rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                    transition: "all 0.2s ease",
                                    boxShadow: isActive ? "0 0 15px rgba(0, 168, 255, 0.2)" : "none",
                                    textAlign: "left",
                                }}
                            >
                                <span style={{ fontSize: "1.4rem" }}>{sample.emoji}</span>
                                <div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: isActive ? "#00a8ff" : "#e2e8f0", fontWeight: 600 }}>
                                        {sample.label}
                                    </div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#4a6580", lineHeight: 1.4 }}>
                                        {sample.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview */}
            {selected && !selected.startsWith("blob:") && SAMPLE_IMAGES.find(s => s.id === selected) && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #1a3151" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={SAMPLE_IMAGES.find(s => s.id === selected)!.url}
                        alt="Selected zone"
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    />
                    <div style={{ background: "rgba(0,0,0,0.6)", padding: "0.4rem 0.75rem", fontFamily: "monospace", fontSize: "0.62rem", color: "#4a6580" }}>
                        ✓ Sample image loaded — click Analyze Zone to proceed
                    </div>
                </div>
            )}
            {selected && selected.startsWith("blob:") && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #1a3151" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={selected}
                        alt="Uploaded zone"
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    />
                    <div style={{ background: "rgba(0,0,0,0.6)", padding: "0.4rem 0.75rem", fontFamily: "monospace", fontSize: "0.62rem", color: "#4a6580" }}>
                        ✓ Image uploaded — ready for analysis
                    </div>
                </div>
            )}
        </div>
    );
}
