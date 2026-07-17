"use client";

import { useState, useRef, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import {
    MAX_IMAGE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES,
    SAMPLE_IMAGES,
    type SampleImage,
} from "@/lib/constants";

interface ImageUploaderProps {
    onImageSelected: (src: string, file?: File) => void;
}

/**
 * Drag-and-drop / click image uploader with sample image quick-select.
 * Validates file type and size before surfacing the image to the parent.
 */
const ImageUploader = memo(function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const [dragging, setDragging] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            setValidationError("Unsupported file type. Please upload a PNG, JPG, or WebP image.");
            return;
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setValidationError("File exceeds size limit. Image size must be less than 10MB.");
            return;
        }
        setValidationError(null);
        const url = URL.createObjectURL(file);
        setSelected(url);
        onImageSelected(url, file);
    }, [onImageSelected]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => setDragging(false), []);

    const handleSample = useCallback((url: string, id: string) => {
        setValidationError(null);
        setSelected(id);
        onImageSelected(url);
    }, [onImageSelected]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleUploadClick = useCallback(() => {
        fileRef.current?.click();
    }, []);

    /** The currently selected sample image object, derived once to avoid repeated .find() calls. */
    const selectedSample = useMemo<SampleImage | undefined>(
        () => (selected && !selected.startsWith("blob:"))
            ? SAMPLE_IMAGES.find((s) => s.id === selected)
            : undefined,
        [selected]
    );

    return (
        <div>
            {/* Validation Error Message */}
            {validationError && (
                <div
                    style={{
                        background: "rgba(255, 107, 107, 0.12)",
                        border: "1px solid rgba(255, 107, 107, 0.3)",
                        color: "#ff6b6b",
                        padding: "0.75rem",
                        borderRadius: 6,
                        fontFamily: "monospace",
                        fontSize: "0.72rem",
                        marginBottom: "1rem"
                    }}
                    role="alert"
                >
                    ⚠ {validationError}
                </div>
            )}

            {/* Upload area */}
            <button
                type="button"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                style={{
                    display: "block",
                    width: "100%",
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
                aria-label="Upload zone image. Drag and drop or click to select a PNG, JPG, or WebP file (maximum size 10MB)."
            >
                <span style={{ fontSize: "2.5rem", marginBottom: "0.75rem", display: "block" }} role="img" aria-label="Satellite dish icon">📡</span>
                <span style={{ fontFamily: "monospace", color: "#7a9bb5", fontSize: "0.85rem", lineHeight: 1.5, display: "block" }}>
                    <span style={{ color: "#00a8ff", fontWeight: 600 }}>Upload zone image</span>
                    <br />
                    <span style={{ fontSize: "0.7rem", color: "#7a9bb5" }}>
                        Drag &amp; drop or click to select · PNG, JPG, WebP supported (max 10MB)
                    </span>
                </span>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                />
            </button>

            {/* Sample images */}
            <div style={{ marginBottom: "1.25rem" }}>
                <div
                    style={{
                        fontFamily: "monospace",
                        fontSize: "0.65rem",
                        color: "#7a9bb5",
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
                                <span style={{ fontSize: "1.4rem" }} role="img" aria-hidden="true">{sample.emoji}</span>
                                <div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: isActive ? "#00a8ff" : "#e2e8f0", fontWeight: 600 }}>
                                        {sample.label}
                                    </div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#7a9bb5", lineHeight: 1.4 }}>
                                        {sample.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview — sample image (uses Next.js Image for automatic optimisation) */}
            {selectedSample && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #1a3151" }}>
                    <Image
                        src={selectedSample.url}
                        alt={`Preview of sample CCTV feed in ${selectedSample.label} showing: ${selectedSample.description}`}
                        width={800}
                        height={200}
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    />
                    <div style={{ background: "rgba(0,0,0,0.6)", padding: "0.4rem 0.75rem", fontFamily: "monospace", fontSize: "0.62rem", color: "#7a9bb5" }}>
                        ✓ Sample image loaded — click Analyze Zone to proceed
                    </div>
                </div>
            )}

            {/* Preview — user-uploaded blob URL (cannot use Next.js Image for blob: URLs) */}
            {selected && selected.startsWith("blob:") && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #1a3151" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={selected}
                        alt="Preview of user uploaded CCTV feed image for crowd analysis"
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    />
                    <div style={{ background: "rgba(0,0,0,0.6)", padding: "0.4rem 0.75rem", fontFamily: "monospace", fontSize: "0.62rem", color: "#7a9bb5" }}>
                        ✓ Image uploaded — ready for analysis
                    </div>
                </div>
            )}
        </div>
    );
});

export default ImageUploader;
