import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderWithProviders } from "./test/render";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ data: { status: "ok" } }), { status: 200 })),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("App", () => {
  it("shows the dashboard with the sidebar", async () => {
    renderWithProviders(<App />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("Vehicles");
    expect(await screen.findByText("Backend API: connected")).toBeInTheDocument();
  });

  it("navigates to a page from the sidebar", async () => {
    renderWithProviders(<App />);
    await userEvent.click(screen.getByRole("link", { name: "Sales" }));
    expect(screen.getByRole("heading", { name: "Sales" })).toBeInTheDocument();
    expect(screen.getByText("JM-30")).toBeInTheDocument();
  });

  it("shows a not-found page for unknown addresses", () => {
    renderWithProviders(<App />, { route: "/nope" });
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });

  it("shows the database error when the backend reports it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.endsWith("/health/db")
          ? new Response(
              JSON.stringify({
                error: { code: "DATABASE_UNAVAILABLE", message: "Cannot reach the database" },
              }),
              { status: 503 },
            )
          : new Response(JSON.stringify({ data: { status: "ok" } }), { status: 200 }),
      ),
    );
    renderWithProviders(<App />);
    expect(await screen.findByText("Database: Cannot reach the database")).toBeInTheDocument();
  });
});
