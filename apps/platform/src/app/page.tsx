"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type DashboardTab =
  | "onboarding"
  | "activity"
  | "insights"
  | "personalization"
  | "seo"
  | "settings";
type InsightsTab = "messaging" | "features" | "pricing" | "keywords";
type PersonaTab = "enterprise" | "startup";
type OnboardingStep = 1 | 2 | 3 | 4;
type AgentMode = "supervised" | "autonomous";

interface ActivityRecord {
  id: string;
  timestamp?: string;
  status?: string;
  actionType?: string;
  reasoning?: string;
  pr_url?: string;
  deployment_url?: string;
  live_at?: string;
  branch?: string;
  error?: string;
}

const DEMO_SESSION = { user: { email: "demo@autoweb.ai" } };

function statusColor(s?: string): string {
  if (!s) return "bg-sky-400";
  if (["ready", "pr_opened", "merged"].includes(s)) return "bg-emerald-500";
  if (["generating", "in_progress", "detecting", "analyzing"].includes(s)) return "bg-sky-400";
  if (["failed", "merge_failed", "vercel_failed", "slack_failed"].includes(s)) return "bg-red-500";
  return "bg-amber-400";
}

function formatTime(iso?: string): string {
  if (!iso) return "--:--:--";
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour12: false });
  } catch {
    return iso;
  }
}

export default function PlatformPage() {
  const session = DEMO_SESSION;
  const [status, setStatus] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<DashboardTab>("onboarding");
  const [insightsTab, setInsightsTab] = useState<InsightsTab>("messaging");
  const [personaTab, setPersonaTab] = useState<PersonaTab>("enterprise");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [agentMode, setAgentMode] = useState<AgentMode>("supervised");

  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [dangerousMode, setDangerousMode] = useState(false);
  const [runningAgent, setRunningAgent] = useState(false);
  const [agentUrl, setAgentUrl] = useState("http://localhost:3004");

  const handleMockParse = (fileName: string) => {
    setUploadedFileName(fileName);
    setCompanyName("AutoWeb");
    setCompanyUrl("https://autoweb.ai");
    setCompanyIndustry("AI Infrastructure");
    setCompanyValue("We monitor competitors and ship site updates in under 60 seconds.");
  };

  const handleClearUpload = () => {
    setUploadedFileName(null);
    setCompanyName("");
    setCompanyUrl("");
    setCompanyIndustry("");
    setCompanyValue("");
  };

  const handleAddCompetitor = () => {
    const trimmed = competitorUrl.trim();
    if (!trimmed) return;
    setCompetitors((prev) => [...prev, trimmed]);
    setCompetitorUrl("");
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/agent/activity`);
      if (res.ok) setActivities(await res.json());
    } catch { /* backend may be offline */ }
  }, []);

  useEffect(() => {
    fetchActivities();
    const id = setInterval(fetchActivities, 5000);
    return () => clearInterval(id);
  }, [fetchActivities]);

  useEffect(() => {
    fetch(`${API_URL}/agent/dangerous-mode`)
      .then((r) => r.json())
      .then((d) => setDangerousMode(!!d.dangerousMode))
      .catch(() => {});
  }, []);

  const handleToggleDangerousMode = async () => {
    try {
      const res = await fetch(`${API_URL}/agent/dangerous-mode`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dangerousMode: !dangerousMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setDangerousMode(!!data.dangerousMode);
      }
    } catch {
      setStatus("Failed to toggle dangerous mode.");
    }
  };

  const handleRunAgent = async () => {
    const url = agentUrl.trim() || competitors[0] || "http://localhost:3004";
    setRunningAgent(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/intel/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(`Agent error: ${err.detail || res.statusText}`);
      } else {
        setStatus("Agent triggered — watch the activity log.");
        fetchActivities();
      }
    } catch {
      setStatus("Could not reach backend.");
    } finally {
      setRunningAgent(false);
    }
  };

  const navigation = [
    {
      id: "onboarding",
      label: "Onboarding",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 7h8m-8 5h12m-12 5h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "activity",
      label: "Activity Log",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 5h16M4 12h10M4 19h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "insights",
      label: "Competitor Insights",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 19V5m16 14V8M8 19V9m8 10V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "personalization",
      label: "Personalization",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 4v16m8-8H4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "seo",
      label: "SEO / GEO",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 2l7 4v8l-7 4-7-4V6l7-4z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 8a4 4 0 100 8 4 4 0 000-8zm8 4l-2 1 1 2-2 2-2-1-1 2H10l-1-2-2 1-2-2 1-2-2-1 2-3 2 1 1-2h4l1 2 2-1 2 3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-8">
        <aside className="panel-shadow shell-divider hidden w-64 flex-col rounded-3xl bg-white/90 p-6 backdrop-blur md:flex">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--accent)]" />
            <div>
              <p className="font-editorial text-lg font-semibold">AutoWeb</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Platform</p>
            </div>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-2 text-sm font-medium text-[var(--ink)]">
            {navigation.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    active
                      ? "border border-[var(--border)] bg-[var(--panel)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className={active ? "text-[var(--accent)]" : ""}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-xs text-[var(--muted)]">
            <div>
              <p className="uppercase tracking-[0.2em]">Signed in as</p>
              <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                {session.user.email}
              </p>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-6">
          <header className="panel-shadow flex flex-col gap-4 rounded-3xl bg-white/90 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Project</p>
              <h1 className="font-editorial text-3xl font-semibold">AutoWeb</h1>
              <p className="mt-2 text-xs text-[var(--muted)]">Live agent workspace</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleToggleDangerousMode}
                className={`flex items-center gap-3 rounded-full border px-4 py-2 transition ${
                  dangerousMode
                    ? "border-[var(--danger)] bg-[#fef0ef]"
                    : "border-[var(--border)] bg-[var(--panel)]"
                }`}
              >
                <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                  dangerousMode ? "text-[var(--danger)]" : "text-[var(--muted)]"
                }`}>
                  Dangerous Mode
                </span>
                <div className="relative h-5 w-9 rounded-full bg-white shadow-inner">
                  <div className={`absolute top-0 h-5 w-5 rounded-full transition-all ${
                    dangerousMode ? "left-4 bg-[var(--danger)]" : "left-0 bg-gray-300"
                  }`} />
                </div>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xs font-semibold uppercase text-white"
                  aria-label="Account"
                >
                  {session.user.email.slice(0, 2)}
                </button>
                {accountMenuOpen && (
                  <div className="panel-shadow absolute right-0 top-14 z-20 w-56 rounded-2xl border border-[var(--border)] bg-white p-3 text-sm">
                    <div className="grid gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Signed in
                        </p>
                        <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="panel-shadow flex flex-1 flex-col gap-6 rounded-3xl bg-white/90 p-8 backdrop-blur">
            {currentTab === "onboarding" && (
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  {["Welcome", "Your Company", "Add Competitors", "Agent Settings"].map(
                    (label, index) => {
                      const step = (index + 1) as OnboardingStep;
                      const active = onboardingStep === step;
                      return (
                        <div key={label} className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                              active
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[var(--border)]"
                            }`}
                          >
                            {step}
                          </span>
                          <span className={active ? "text-[var(--ink)]" : ""}>{label}</span>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8">
                  {onboardingStep === 1 && (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-[var(--accent)]" />
                      <h2 className="font-editorial text-2xl font-semibold">Welcome to AutoWeb</h2>
                      <p className="text-sm text-[var(--muted)]">
                        Set up your workspace in minutes. We'll prepare the agent to monitor and
                        update your site.
                      </p>
                      <button
                        type="button"
                        onClick={() => setOnboardingStep(2)}
                        className="rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
                      >
                        Get Started
                      </button>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="grid gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Your Company
                        </p>
                        <h2 className="font-editorial text-2xl font-semibold">
                          Provide your company details
                        </h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Upload a document to prefill or enter the details manually.
                        </p>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4 text-sm text-[var(--muted)]">
                          <p className="text-xs uppercase tracking-[0.2em]">Option A</p>
                          <p className="mt-2 font-medium text-[var(--ink)]">
                            Upload a pitch deck or brand doc
                          </p>
                          <p className="mt-2 text-xs">
                            PDF, Word, or plain text. We'll parse and prefill your details.
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <label className="cursor-pointer rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                              Select file
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) handleMockParse(file.name);
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleMockParse("AutoWeb_Overview.pdf")}
                              className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]"
                            >
                              Use sample
                            </button>
                          </div>
                          {uploadedFileName && (
                            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 text-xs">
                              <p className="uppercase tracking-[0.2em] text-[var(--muted)]">
                                Parsed from
                              </p>
                              <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                                {uploadedFileName}
                              </p>
                              <button
                                type="button"
                                onClick={handleClearUpload}
                                className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]"
                              >
                                Clear upload
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 text-sm">
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Option B
                          </p>
                          <label className="grid gap-2">
                            Company name
                            <input
                              value={companyName}
                              onChange={(event) => setCompanyName(event.target.value)}
                              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                            />
                          </label>
                          <label className="grid gap-2">
                            Website URL
                            <input
                              value={companyUrl}
                              onChange={(event) => setCompanyUrl(event.target.value)}
                              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                            />
                          </label>
                          <label className="grid gap-2">
                            Industry
                            <input
                              value={companyIndustry}
                              onChange={(event) => setCompanyIndustry(event.target.value)}
                              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                            />
                          </label>
                          <label className="grid gap-2">
                            Value proposition
                            <textarea
                              value={companyValue}
                              onChange={(event) => setCompanyValue(event.target.value)}
                              className="h-24 resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="grid gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Add Competitors
                        </p>
                        <h2 className="font-editorial text-2xl font-semibold">
                          Track your competitors
                        </h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Add at least one competitor URL to continue.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:flex-row">
                        <input
                          value={competitorUrl}
                          onChange={(event) => setCompetitorUrl(event.target.value)}
                          placeholder="https://competitor.com"
                          className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddCompetitor}
                          className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
                        >
                          Add
                        </button>
                      </div>

                      <div className="grid gap-2">
                        {competitors.length === 0 && (
                          <p className="text-sm text-[var(--muted)]">
                            No competitors added yet.
                          </p>
                        )}
                        {competitors.map((url, index) => (
                          <div
                            key={`${url}-${index}`}
                            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm"
                          >
                            <span>{url}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCompetitor(index)}
                              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 4 && (
                    <div className="grid gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Agent Settings
                        </p>
                        <h2 className="font-editorial text-2xl font-semibold">
                          Choose an agent mode
                        </h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Select whether the agent should request approval or act autonomously.
                        </p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {[
                          {
                            id: "supervised",
                            title: "Supervised",
                            description:
                              "Agent drafts changes and waits for your approval before deploy.",
                          },
                          {
                            id: "autonomous",
                            title: "Autonomous (Dangerous Mode)",
                            description:
                              "Agent ships approved changes automatically and escalates only when blocked.",
                          },
                        ].map((mode) => {
                          const active = agentMode === mode.id;
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setAgentMode(mode.id as AgentMode)}
                              className={`rounded-2xl border px-4 py-4 text-left ${
                                active
                                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                                  : "border-[var(--border)] bg-white"
                              }`}
                            >
                              <p className="text-sm font-semibold">{mode.title}</p>
                              <p className="mt-2 text-sm text-[var(--muted)]">
                                {mode.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setOnboardingStep((prev) => (prev > 1 ? ((prev - 1) as OnboardingStep) : prev))
                    }
                    disabled={onboardingStep === 1}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    Back
                  </button>
                  {onboardingStep < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOnboardingStep((prev) => (prev < 4 ? ((prev + 1) as OnboardingStep) : prev))
                      }
                      className="rounded-2xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentTab === "activity" && (() => {
              const latest = activities[0] as ActivityRecord | undefined;
              return (
              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                        Activity Log
                      </p>
                      <h2 className="font-editorial text-2xl font-semibold">
                        Competitor Change Monitor
                      </h2>
                    </div>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      <span className="text-[10px] text-[var(--accent)]">●</span> Live
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 md:flex-row">
                    <input
                      value={agentUrl}
                      onChange={(e) => setAgentUrl(e.target.value)}
                      placeholder="https://competitor.com"
                      className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={runningAgent}
                      onClick={handleRunAgent}
                      className="rounded-2xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {runningAgent ? "Running\u2026" : "Run Agent"}
                    </button>
                  </div>

                  <div className="h-[380px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <div className="grid gap-3 text-sm">
                      {activities.length === 0 && (
                        <p className="text-sm text-[var(--muted)]">
                          No activity yet. Enter a competitor URL above and click Run Agent.
                        </p>
                      )}
                      {activities.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 border-b border-dashed border-[var(--border)] pb-3 last:border-none last:pb-0"
                        >
                          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusColor(entry.status)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-[var(--muted)]">
                              {formatTime(entry.timestamp)}
                              <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase">
                                {entry.status}
                              </span>
                            </p>
                            <p className="text-sm">{entry.reasoning || entry.actionType}</p>
                            {entry.pr_url && (
                              <a href={entry.pr_url} target="_blank" rel="noreferrer" className="text-xs text-[var(--accent)] underline">
                                View PR
                              </a>
                            )}
                            {entry.deployment_url && (
                              <a
                                href={entry.deployment_url.startsWith("http") ? entry.deployment_url : `https://${entry.deployment_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 text-xs text-[var(--accent)] underline"
                              >
                                View Deployment
                              </a>
                            )}
                            {entry.error && (
                              <p className="mt-1 text-xs text-red-500">{entry.error}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                      Last Deployment
                    </p>
                    {latest ? (
                      <>
                        <h3 className="mt-2 text-lg font-semibold">
                          {latest.actionType === "SLACK_MESSAGE" ? "Slack Escalation" : "Code Update"}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {latest.reasoning || "\u2014"}
                        </p>
                        <div className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                          {latest.pr_url && (
                            <p>
                              PR:{" "}
                              <a href={latest.pr_url} target="_blank" rel="noreferrer" className="text-[var(--accent)] underline">
                                {latest.pr_url.split("/").slice(-2).join("/")}
                              </a>
                            </p>
                          )}
                          {latest.deployment_url && (
                            <p>
                              Preview:{" "}
                              <a
                                href={latest.deployment_url.startsWith("http") ? latest.deployment_url : `https://${latest.deployment_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--accent)] underline"
                              >
                                {latest.deployment_url}
                              </a>
                            </p>
                          )}
                          <p>Status: {latest.status || "\u2014"}</p>
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--muted)]">No deployments yet.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 text-sm text-[var(--muted)]">
                    Polling every 5s &middot; {activities.length} activities tracked
                  </div>
                </div>
              </div>
              );
            })()}

            {currentTab === "insights" && (
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Competitor Insights
                  </p>
                  <h2 className="font-editorial text-2xl font-semibold">Market Scan</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <p className="text-sm font-semibold">TaskMaster</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">taskmaster.ai</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>Last scanned 2 min ago</span>
                      <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-semibold text-[var(--accent)]">
                        6 changes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                  <div className="flex flex-wrap gap-2 text-sm font-medium">
                    {[
                      { id: "messaging", label: "Messaging" },
                      { id: "features", label: "Features" },
                      { id: "pricing", label: "Pricing" },
                      { id: "keywords", label: "Keywords" },
                    ].map((tab) => {
                      const active = insightsTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setInsightsTab(tab.id as InsightsTab)}
                          className={`rounded-full px-4 py-2 ${
                            active
                              ? "bg-[var(--ink)] text-white"
                              : "border border-[var(--border)] text-[var(--muted)]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {insightsTab === "messaging" && (
                    <div className="mt-6 grid gap-3 text-sm">
                      <p className="font-semibold">Hero copy</p>
                      <p className="text-[var(--muted)]">
                        &quot;Automate your competitor response in under a minute.&quot;
                      </p>
                      <p className="font-semibold">Tagline</p>
                      <p className="text-[var(--muted)]">&quot;AI that ships, not just chats.&quot;</p>
                      <p className="font-semibold">CTA</p>
                      <p className="text-[var(--muted)]">&quot;Book a 20-min demo.&quot;</p>
                    </div>
                  )}

                  {insightsTab === "features" && (
                    <ul className="mt-6 grid gap-2 text-sm text-[var(--muted)]">
                      <li>Continuous competitive monitoring</li>
                      <li>Auto-generated PRs with rollback</li>
                      <li>Real-time personalization rules</li>
                      <li>Compliance-aware guardrails</li>
                    </ul>
                  )}

                  {insightsTab === "pricing" && (
                    <div className="mt-6 grid gap-2 text-sm text-[var(--muted)]">
                      <p>Starter: $499 / month</p>
                      <p>Growth: $1,500 / month</p>
                      <p>Enterprise: Custom + SLA</p>
                    </div>
                  )}

                  {insightsTab === "keywords" && (
                    <div className="mt-6 grid gap-3 text-sm">
                      <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        <span>Them</span>
                        <span>You</span>
                      </div>
                      {[
                        { them: "agentic deployment", you: "\u2014" },
                        { them: "competitive response AI", you: "\u2014" },
                        { them: "real-time site ops", you: "\u2014" },
                      ].map((row) => (
                        <div
                          key={row.them}
                          className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                        >
                          <span>{row.them}</span>
                          <span className="text-[var(--muted)]">{row.you}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === "personalization" && (
              <div className="grid gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                      Personalization
                    </p>
                    <h2 className="font-editorial text-2xl font-semibold">Persona Playbook</h2>
                  </div>
                  <div className="flex rounded-full border border-[var(--border)] p-1 text-sm">
                    {[
                      { id: "enterprise", label: "Enterprise" },
                      { id: "startup", label: "Startup" },
                    ].map((tab) => {
                      const active = personaTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPersonaTab(tab.id as PersonaTab)}
                          className={`rounded-full px-4 py-2 ${
                            active
                              ? "bg-[var(--ink)] text-white"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Enterprise",
                      utm: "utm_source=enterprise",
                      hero: "Compliance-first automation for enterprise web ops.",
                      cta: "Schedule a security review",
                      proof: "SOC2, ISO27001, 50+ deployments",
                      emphasis: "Governance \u00b7 SLA \u00b7 Audit logs",
                    },
                    {
                      title: "Startup",
                      utm: "utm_source=startup",
                      hero: "Ship competitive updates in minutes, not quarters.",
                      cta: "Start free trial",
                      proof: "Trusted by fast-moving teams",
                      emphasis: "Speed \u00b7 Growth \u00b7 Experimentation",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5"
                    >
                      <p className="text-sm font-semibold">{card.title}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        {card.utm}
                      </p>
                      <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                        <p>
                          <span className="font-semibold text-[var(--ink)]">Hero: </span>
                          {card.hero}
                        </p>
                        <p>
                          <span className="font-semibold text-[var(--ink)]">CTA: </span>
                          {card.cta}
                        </p>
                        <p>
                          <span className="font-semibold text-[var(--ink)]">Social proof: </span>
                          {card.proof}
                        </p>
                        <p>
                          <span className="font-semibold text-[var(--ink)]">Emphasis: </span>
                          {card.emphasis}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium"
                  >
                    Add Persona
                  </button>
                </div>
              </div>
            )}

            {currentTab === "seo" && (
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">SEO / GEO</p>
                  <h2 className="font-editorial text-2xl font-semibold">Search Optimization</h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Before</p>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      <p>Title: AutoWeb &mdash; Automate site updates</p>
                      <p>H1: Competitive monitoring for modern teams</p>
                      <p>Meta: AI watches competitors and updates your site.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">After</p>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      <p>Title: AutoWeb &mdash; Real-time competitive response</p>
                      <p>H1: Ship pricing and messaging updates in 60s</p>
                      <p>Meta: Autonomous SEO + GEO updates from competitor intel.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Keyword Injection
                  </p>
                  <div className="mt-4 grid gap-2 text-sm">
                    {[
                      { keyword: "real-time site ops", source: "taskmaster.ai/pricing" },
                      { keyword: "agentic deployment", source: "taskmaster.ai/hero" },
                      { keyword: "competitive response AI", source: "taskmaster.ai/blog" },
                    ].map((row) => (
                      <div
                        key={row.keyword}
                        className="grid grid-cols-[1.5fr_1fr] gap-3 rounded-xl border border-[var(--border)] bg-white px-3 py-2"
                      >
                        <span>{row.keyword}</span>
                        <span className="text-[var(--muted)]">{row.source}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 text-sm text-[var(--muted)]">
                  GEO optimization adds structured data tuned for AI models like ChatGPT, improving
                  summarization and answer visibility.
                </div>
              </div>
            )}

            {currentTab === "settings" && (
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Settings</p>
                  <h2 className="font-editorial text-2xl font-semibold">Workspace Controls</h2>
                </div>

                <div className="grid gap-6">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Agent Mode</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Dangerous mode allows autonomous code changes without human approval.
                    </p>
                    <button
                      type="button"
                      onClick={handleToggleDangerousMode}
                      className={`mt-4 flex items-center gap-3 rounded-full border px-4 py-2 transition ${
                        dangerousMode
                          ? "border-[var(--danger)] bg-[#fef0ef]"
                          : "border-[var(--border)] bg-[var(--panel)]"
                      }`}
                    >
                      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        dangerousMode ? "text-[var(--danger)]" : "text-[var(--muted)]"
                      }`}>
                        Dangerous Mode
                      </span>
                      <div className="relative h-5 w-9 rounded-full bg-white shadow-inner">
                        <div className={`absolute top-0 h-5 w-5 rounded-full transition-all ${
                          dangerousMode ? "left-4 bg-[var(--danger)]" : "left-0 bg-gray-300"
                        }`} />
                      </div>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Competitors</p>
                    <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      <li>taskmaster.ai</li>
                      <li>brightline.com</li>
                    </ul>
                    <button
                      type="button"
                      className="mt-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium"
                    >
                      Add Competitor
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Personas</p>
                    <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      <li>Enterprise &mdash; utm_source=enterprise</li>
                      <li>Startup &mdash; utm_source=startup</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Brand Guidelines</p>
                    <textarea
                      disabled
                      className="mt-3 h-28 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]"
                      value="Straightforward, technical, confident. Avoid hype and exaggerated claims."
                    />
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Protected Sections</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                      {["footer", "nav", "legal", "pricing table"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[var(--border)] bg-white px-3 py-1"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-sm font-semibold">Notifications</p>
                    <label className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      Slack webhook URL
                      <input
                        disabled
                        value="https://hooks.slack.com/services/..."
                        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]"
                      />
                    </label>
                    <div className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        Escalations
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        Auto-deploys
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" readOnly />
                        Weekly summaries
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status && <p className="text-xs text-[var(--muted)]">{status}</p>}
          </section>
        </main>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-10 md:hidden">
        <div className="rounded-3xl border border-[var(--border)] bg-white/90 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Menu</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-medium">
            {navigation.map((item) => (
              <button
                key={`mobile-${item.id}`}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
