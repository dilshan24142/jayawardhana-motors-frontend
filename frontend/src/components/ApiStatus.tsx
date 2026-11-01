import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "../services/api";
import type { ApiResponse } from "../types/api";

function useHealth(path: string) {
  return useQuery({
    queryKey: ["health", path],
    queryFn: ({ signal }) => api.get<ApiResponse<{ status: string }>>(path, undefined, signal),
    retry: false,
  });
}

function Line({ label, query }: { label: string; query: ReturnType<typeof useHealth> }) {
  if (query.isPending) return <span className="status status--pending">{label}: checking…</span>;
  if (query.isError) {
    const message = query.error instanceof ApiError ? query.error.message : "Unknown error";
    return (
      <span className="status status--error">
        {label}: {message}
      </span>
    );
  }
  return <span className="status status--ok">{label}: connected</span>;
}

/** Shows whether the backend and its database are reachable. Handy for the setup check (JM-14). */
export function ApiStatus() {
  const apiHealth = useHealth("/health");
  const dbHealth = useHealth("/health/db");

  return (
    <div className="card" aria-live="polite">
      <h3>System status</h3>
      <Line label="Backend API" query={apiHealth} />
      <Line label="Database" query={dbHealth} />
    </div>
  );
}
