"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
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

export default function PlatformPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentTab, setCurrentTab] = useState<DashboardTab>("onboarding");
  const [insightsTab, setInsightsTab] = useState<InsightsTab>("messaging");
  const [personaTab, setPersonaTab] = useState<PersonaTab>("enterprise");
  const [authModalOpen, setAuthModalOpen] = useState(false);
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


  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    setStatus(error ? error.message : "Signed in.");
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    setStatus(
      error
        ? error.message
        : "Account created. Check your email if confirmation is required."
    );
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    setStatus(error ? error.message : "Signed out.");
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
                {session?.user.email ?? "Not signed in"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm font-medium text-[var(--muted)]"
            >
              Logout
            </button>
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
              <div className="flex items-center gap-3 rounded-full border border-[var(--danger)] bg-[#fef0ef] px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--danger)]">
                  Dangerous Mode
                </span>
                <div className="h-5 w-9 rounded-full bg-white shadow-inner">
                  <div className="h-5 w-5 rounded-full bg-[var(--danger)]" />
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xs font-semibold uppercase text-white"
                  aria-label="Account"
                >
                  {session?.user.email?.slice(0, 2) ?? "AC"}
                </button>
                {accountMenuOpen && (
                  <div className="panel-shadow absolute right-0 top-14 z-20 w-56 rounded-2xl border border-[var(--border)] bg-white p-3 text-sm">
                    {session ? (
                      <div className="grid gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Signed in
                          </p>
                          <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                            {session.user.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm font-medium text-[var(--muted)]"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Account
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setAuthModalOpen(true);
                            setAccountMenuOpen(false);
                          }}
                          className="rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm font-medium"
                        >
                          Sign in
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signup");
                            setAuthModalOpen(true);
                            setAccountMenuOpen(false);
                          }}
                          className="rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm font-medium"
                        >
                          Sign up
                        </button>
                      </div>
                    )}
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
                        Set up your workspace in minutes. We’ll prepare the agent to monitor and
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
                            PDF, Word, or plain text. We’ll parse and prefill your details.
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
            {currentTab === "activity" && (
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

                  <div className="h-[420px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <div className="grid gap-3 text-sm">
                      {[
                        {
                          time: "09:22:14",
                          status: "success",
                          message: "Deployed new pricing hero after Brightline update.",
                        },
                        {
                          time: "09:18:02",
                          status: "info",
                          message: "Detected new case study section on TaskMaster.",
                        },
                        {
                          time: "09:12:48",
                          status: "warning",
                          message: "Awaiting approval for testimonial swap.",
                        },
                        {
                          time: "09:06:11",
                          status: "error",
                          message: "Escalated: competitor added testimonials but none available.",
                        },
                        {
                          time: "09:01:35",
                          status: "success",
                          message: "Injected keyword set: autonomous site updates.",
                        },
                        {
                          time: "08:57:09",
                          status: "info",
                          message: "Scan completed across 2 competitors.",
                        },
                      ].map((entry) => {
                        const color =
                          entry.status === "success"
                            ? "bg-emerald-500"
                            : entry.status === "warning"
                            ? "bg-amber-400"
                            : entry.status === "error"
                            ? "bg-red-500"
                            : "bg-sky-400";
                        return (
                          <div
                            key={`${entry.time}-${entry.message}`}
                            className="flex items-start gap-3 border-b border-dashed border-[var(--border)] pb-3 last:border-none last:pb-0"
                          >
                            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />
                            <div className="flex-1">
                              <p className="font-mono text-xs text-[var(--muted)]">
                                {entry.time}
                              </p>
                              <p className="text-sm">{entry.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                      Last Deployment
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">Pricing hero refresh</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Updated headline and CTA to match Brightline’s new enterprise tier.
                    </p>
                    <div className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                      <p>PR: autoweb/pr-1842</p>
                      <p>Preview: vercel.app/autoweb-1842</p>
                      <p>Status: Auto-merged</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 text-sm text-[var(--muted)]">
                    Monitoring 2 competitors · Last scan 4 min ago · Next scan in 11 min
                  </div>
                </div>
              </div>
            )}

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
                        “Automate your competitor response in under a minute.”
                      </p>
                      <p className="font-semibold">Tagline</p>
                      <p className="text-[var(--muted)]">“AI that ships, not just chats.”</p>
                      <p className="font-semibold">CTA</p>
                      <p className="text-[var(--muted)]">“Book a 20-min demo.”</p>
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
                        { them: "agentic deployment", you: "—" },
                        { them: "competitive response AI", you: "—" },
                        { them: "real-time site ops", you: "—" },
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
                      emphasis: "Governance · SLA · Audit logs",
                    },
                    {
                      title: "Startup",
                      utm: "utm_source=startup",
                      hero: "Ship competitive updates in minutes, not quarters.",
                      cta: "Start free trial",
                      proof: "Trusted by fast-moving teams",
                      emphasis: "Speed · Growth · Experimentation",
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
                      <p>Title: AutoWeb — Automate site updates</p>
                      <p>H1: Competitive monitoring for modern teams</p>
                      <p>Meta: AI watches competitors and updates your site.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">After</p>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                      <p>Title: AutoWeb — Real-time competitive response</p>
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
                    <div className="mt-4 flex items-center gap-3 rounded-full border border-[var(--danger)] bg-[#fef0ef] px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--danger)]">
                        Dangerous Mode
                      </span>
                      <div className="h-5 w-9 rounded-full bg-white shadow-inner">
                        <div className="h-5 w-5 rounded-full bg-[var(--danger)]" />
                      </div>
                    </div>
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
                      <li>Enterprise — utm_source=enterprise</li>
                      <li>Startup — utm_source=startup</li>
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
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-2xl border border-[var(--border)] px-4 py-3 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {authModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-6">
          <div className="panel-shadow w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Account</p>
                <h2 className="font-editorial text-2xl font-semibold">
                  {authMode === "login" ? "Sign in" : "Create account"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]"
              >
                Close
              </button>
            </div>

            {!supabase ? (
              <div className="mt-6">
                <p className="text-sm text-[var(--muted)]">
                  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or
                  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to enable authentication.
                </p>
              </div>
            ) : (
              <form
                onSubmit={authMode === "login" ? handleSignIn : handleSignUp}
                className="mt-6 grid gap-5"
              >
                <div className="flex rounded-full border border-[var(--border)] p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`rounded-full px-4 py-2 ${
                      authMode === "login" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"
                    }`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={`rounded-full px-4 py-2 ${
                      authMode === "signup" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"
                    }`}
                  >
                    Create account
                  </button>
                </div>
                <label className="grid gap-2 text-sm">
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  Password
                  <input
                    type="password"
                    autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                </label>
                {authMode === "signup" && (
                  <label className="grid gap-2 text-sm">
                    Confirm password
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    />
                  </label>
                )}
                {status && <p className="text-sm text-[var(--muted)]">{status}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  {busy
                    ? "Working..."
                    : authMode === "login"
                    ? "Log in"
                    : "Create account"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
