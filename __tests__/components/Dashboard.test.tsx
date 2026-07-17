/**
 * Dashboard render test — confirms the page mounts without errors
 * and that all 6 zone cards are visible with the expected labels.
 */
import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";

describe("Dashboard page", () => {
    it("renders without throwing", () => {
        expect(() => render(<Dashboard />)).not.toThrow();
    });

    it("displays all 6 zone card names", () => {
        render(<Dashboard />);
        expect(screen.getByText("Gate A")).toBeInTheDocument();
        expect(screen.getByText("Gate B")).toBeInTheDocument();
        expect(screen.getByText("Main Concourse")).toBeInTheDocument();
        expect(screen.getByText("Exit Ramp")).toBeInTheDocument();
        expect(screen.getByText("Food Court North")).toBeInTheDocument();
        expect(screen.getByText("Stairwell 3")).toBeInTheDocument();
    });

    it("renders an Analyze Zone link for every zone (6 total)", () => {
        render(<Dashboard />);
        const analyzeLinks = screen.getAllByText(/Analyze Zone/i);
        expect(analyzeLinks.length).toBe(6);
    });

    it("shows zone-related text somewhere on the page", () => {
        render(<Dashboard />);
        const matches = screen.getAllByText(/zone/i);
        expect(matches.length).toBeGreaterThan(0);
    });
});
