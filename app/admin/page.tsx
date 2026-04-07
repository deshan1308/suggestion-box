"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { STATUSES, Suggestion, SuggestionStatus } from "@/types/suggestion";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => statusFilter === "All" || item.status === statusFilter)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [items, statusFilter]);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_password");
    if (stored) {
      setPassword(stored);
      setSavedPassword(stored);
      void fetchSuggestions(stored);
    }
  }, []);

  async function fetchSuggestions(adminPassword: string) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/suggestions", {
        headers: {
          "x-admin-password": adminPassword,
        },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to fetch suggestions.");
      }

      setItems(payload.suggestions ?? []);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error(message);
      setItems([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnlock() {
    if (!password) {
      toast.error("Enter the admin password.");
      return;
    }

    const ok = await fetchSuggestions(password);
    if (ok) {
      sessionStorage.setItem("admin_password", password);
      setSavedPassword(password);
    }
  }

  async function handleStatusUpdate(id: string, status: SuggestionStatus) {
    if (!savedPassword) return;

    try {
      const response = await fetch(`/api/suggestions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update status.");
      }

      setItems((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, status: payload.suggestion.status } : item,
        ),
      );
      toast.success("Status updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <Card
        title="HR Admin Panel"
        subtitle="Review and action employee suggestions."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-300 transition focus:ring-2"
          />
          <button
            type="button"
            onClick={handleUnlock}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Unlock"}
          </button>
        </div>
      </Card>

      {savedPassword ? (
        <Card title="Suggestions">
          <div className="mb-4 grid gap-3 sm:grid-cols-1">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Filter by status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-300 transition focus:ring-2"
              >
                <option value="All">All</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-600">Loading suggestions...</p>
          ) : visibleItems.length === 0 ? (
            <EmptyState
              title="No suggestions found"
              description="Try changing your filters or wait for new submissions."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-700">Suggestion</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Status</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {visibleItems.map((item) => (
                    <tr key={item.id}>
                      <td className="max-w-[300px] px-3 py-2 text-slate-800">
                        {item.suggestion}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={item.status}
                          onChange={(event) =>
                            handleStatusUpdate(item.id, event.target.value as SuggestionStatus)
                          }
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-slate-600">
            Enter the admin password to view submissions.
          </p>
        </Card>
      )}
    </main>
  );
}
