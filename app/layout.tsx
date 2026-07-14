import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "ZoneWatch AI — Stadium Operations Command Center",
    description:
        "GenAI-powered stadium operations command center for FIFA World Cup 2026 venues. Real-time crowd density analysis and risk assessment.",
    keywords: ["stadium safety", "AI", "FIFA World Cup 2026", "crowd analysis", "operations"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={jetBrainsMono.variable}>
            <body className="min-h-screen antialiased">
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
