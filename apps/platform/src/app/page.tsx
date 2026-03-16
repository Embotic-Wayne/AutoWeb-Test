"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Cookie helpers (shared across ports on same domain) ── */
function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=86400`;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

type DashboardTab =
  | "onboarding"
  | "activity"
  | "insights"
  | "personalization"
  | "seo"
  | "settings";
type InsightsTab = "messaging" | "features" | "pricing" | "keywords";
type PersonaTab = "teacher" | "student";
type OnboardingStep = 1 | 2 | 3 | 4;
type AgentMode = "supervised" | "autonomous";
type DemoWorkflowState =
  | "idle"
  | "personalization-running"
  | "personalization-diff"
  | "personalization-approved"
  | "competitor-running"
  | "competitor-diff"
  | "competitor-approved";

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

/* ── Hard-coded demo workflow step sequences ── */
const PERSONALIZATION_STEPS = [
  { status: "analyzing", reasoning: "Analyzing UTM parameters and visitor segments...", delay: 0 },
  { status: "analyzing", reasoning: "Identified 2 personas: Teacher (canvas-lms) and Student (unidays)", delay: 1500 },
  { status: "generating", reasoning: "Generating persona-aware Hero component with conditional rendering...", delay: 2500 },
  { status: "generating", reasoning: "Creating Next.js middleware for cookie-based persona routing...", delay: 2000 },
  { status: "in_progress", reasoning: "Writing Hero.tsx with UTM-based headline, subheadline, and CTA variants...", delay: 2000 },
  { status: "pr_opened", reasoning: "Opening PR #42: feat(personalization): add persona-aware Hero variants", delay: 1500 },
  { status: "in_progress", reasoning: "Awaiting human approval \u2014 diff ready for review", delay: 1000 },
];

const COMPETITOR_STEPS = [
  { status: "analyzing", reasoning: "Scraping competitor site...", delay: 0 },
  { status: "analyzing", reasoning: "Extracting page structure: Hero, Stats, Features, Pricing, Reviews...", delay: 2000 },
  { status: "detecting", reasoning: "Detected pricing table on competitor (Free $0, Pro $29, Team $49/user)", delay: 2000 },
  { status: "detecting", reasoning: "Comparing against Learnify site \u2014 no pricing section found", delay: 1500 },
  { status: "generating", reasoning: "Generating Pricing component for Learnify (Basic $29, Pro $49, Enterprise Custom)...", delay: 2500 },
  { status: "generating", reasoning: "Writing Pricing.tsx with 3-tier responsive grid layout...", delay: 2000 },
  { status: "pr_opened", reasoning: "Opening PR #43: feat(pricing): add competitive pricing table", delay: 1500 },
  { status: "in_progress", reasoning: "Awaiting human approval \u2014 diff ready for review", delay: 1000 },
];

const APPROVAL_STEPS = [
  { status: "in_progress", reasoning: "Merging PR into main branch...", delay: 0 },
  { status: "merged", reasoning: "PR merged successfully. Deploying to preview...", delay: 1500 },
  { status: "ready", reasoning: "Deployment complete. Changes are now live.", delay: 2000 },
];

const PERSONA_RESEARCH_STEPS = [
  { text: "Analyzing Learnify application context and value proposition...", delay: 0 },
  { text: "Scanning industry data for EdTech visitor segments...", delay: 1500 },
  { text: "Identified primary segment: Educators (K-12, Higher Ed) arriving via LMS integrations", delay: 2000 },
  { text: "Identified secondary segment: Students arriving via discount/affiliate platforms", delay: 1800 },
  { text: "Generating persona profiles with UTM mapping, messaging, and CTA strategy...", delay: 2000 },
  { text: "Persona playbook ready \u2014 2 personas generated: Teacher and Student", delay: 1500 },
];

/* ── Hard-coded diff content for modal ── */
const PERSONALIZATION_DIFF = {
  title: "PR #42: feat(personalization): add persona-aware Hero variants",
  file: "apps/project-flow/src/components/ai-generated/Hero.tsx",
  lines: [
    { type: "context", text: ' export default function Hero() {' },
    { type: "removed", text: '   return (' },
    { type: "removed", text: '     <h1>Learn without limits, grow without boundaries.</h1>' },
    { type: "removed", text: '     <p>Access world-class education from top instructors.</p>' },
    { type: "removed", text: '     <a href="/signup">Start learning free</a>' },
    { type: "added", text: '   const [persona, setPersona] = useState("default");' },
    { type: "added", text: '' },
    { type: "added", text: '   useEffect(() => {' },
    { type: "added", text: '     const params = new URLSearchParams(window.location.search);' },
    { type: "added", text: '     const utm = params.get("utm_source");' },
    { type: "added", text: '     if (utm === "canvas-lms") setPersona("teacher");' },
    { type: "added", text: '     else if (utm === "unidays") setPersona("student");' },
    { type: "added", text: '   }, []);' },
    { type: "added", text: '' },
    { type: "added", text: '   const content = PERSONA_CONTENT[persona];' },
    { type: "added", text: '' },
    { type: "added", text: '   return (' },
    { type: "added", text: '     <h1>{content.headline}</h1>' },
    { type: "added", text: '     <p>{content.subheadline}</p>' },
    { type: "added", text: '     <a href={content.ctaHref}>{content.cta}</a>' },
    { type: "context", text: '   );' },
    { type: "context", text: ' }' },
  ],
};

const COMPETITOR_DIFF = {
  title: "PR #43: feat(pricing): add competitive pricing table",
  file: "apps/project-flow/src/app/page.tsx",
  lines: [
    { type: "context", text: '   <Features />' },
    { type: "context", text: '   <Courses />' },
    { type: "added", text: '   <Pricing />' },
    { type: "context", text: '   <CTA />' },
    { type: "context", text: '   <Footer />' },
  ],
};

interface InsightsData {
  url?: string;
  scanned_at?: string;
  hero?: {
    headline?: string;
    subheadline?: string;
  };
  features?: string[];
  pricing?: string[];
  keywords?: string[];
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

function formatHost(url?: string): string {
  if (!url) return "No scan yet";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function PlatformPage() {
  const session = DEMO_SESSION;
  const [status, setStatus] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<DashboardTab>("onboarding");
  const [insightsTab, setInsightsTab] = useState<InsightsTab>("messaging");
  const [personaTab, setPersonaTab] = useState<PersonaTab>("teacher");
  const [personaData, setPersonaData] = useState<any[] | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
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

  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [dangerousMode, setDangerousMode] = useState(false);
  const [runningAgent, setRunningAgent] = useState(false);
  const [agentUrl, setAgentUrl] = useState("http://localhost:3004");
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [busy, setBusy] = useState(false);

  /* ── Demo workflow state ── */
  const [demoWorkflowState, setDemoWorkflowState] = useState<DemoWorkflowState>("idle");
  const [demoLogEntries, setDemoLogEntries] = useState<ActivityRecord[]>([]);
  const [demoShowDiff, setDemoShowDiff] = useState<"personalization" | "competitor" | null>(null);
  const [demoPreviewUrls, setDemoPreviewUrls] = useState<{ label: string; url: string }[] | null>(null);
  const [personaResearchDone, setPersonaResearchDone] = useState(false);
  const [personaResearchRunning, setPersonaResearchRunning] = useState(false);
  const [personaResearchLog, setPersonaResearchLog] = useState<string[]>([]);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleMockParse = (fileName: string) => {
    setUploadedFileName(fileName);
    setCompanyName("Learnify");
    setCompanyUrl("https://learnify.io");
    setCompanyIndustry("EdTech");
    setCompanyValue("World-class online education for teachers and students.");
    setPersonaData([
      { key: "teacher", utm_source: "canvas-lms", headline: "Empower your classroom with smarter tools", subheadline: "Automate grading, track progress, and focus on what matters — teaching.", cta: "Start Your Free Trial", ctaHref: "/signup?plan=educator" },
      { key: "student", utm_source: "unidays", headline: "Study smarter, not harder", subheadline: "AI-powered study plans, flashcards, and practice tests — all in one place.", cta: "Get Started Free", ctaHref: "/signup?plan=student" },
    ]);
  };

  const handleClearUpload = () => {
    setUploadedFileName(null);
    setCompanyName("");
    setCompanyUrl("");
    setCompanyIndustry("");
    setCompanyValue("");
    setPersonaData(null);
  };

  /* ── Demo workflow engine ── */
  const runDemoWorkflow = useCallback(
    (steps: typeof PERSONALIZATION_STEPS, workflowId: string) => {
      let cumulative = 0;
      steps.forEach((step, index) => {
        cumulative += step.delay;
        const timer = setTimeout(() => {
          const entry: ActivityRecord = {
            id: `${workflowId}-${index}`,
            timestamp: new Date().toISOString(),
            status: step.status,
            reasoning: step.reasoning,
          };
          setDemoLogEntries((prev) => [entry, ...prev]);

          if (index === steps.length - 1) {
            setDemoShowDiff(workflowId === "personalization" ? "personalization" : "competitor");
            setDemoWorkflowState(
              workflowId === "personalization" ? "personalization-diff" : "competitor-diff"
            );
          }
        }, cumulative);
        demoTimers.current.push(timer);
      });
    },
    []
  );

  const handleRunPersonaResearch = useCallback(() => {
    setPersonaResearchRunning(true);
    setPersonaResearchLog([]);
    let cumulative = 0;
    PERSONA_RESEARCH_STEPS.forEach((step, index) => {
      cumulative += step.delay;
      const timer = setTimeout(() => {
        setPersonaResearchLog((prev) => [...prev, step.text]);
        if (index === PERSONA_RESEARCH_STEPS.length - 1) {
          setPersonaResearchRunning(false);
          setPersonaResearchDone(true);
        }
      }, cumulative);
      demoTimers.current.push(timer);
    });
  }, []);

  const handleDemoApprove = useCallback(() => {
    const isPersonalization = demoShowDiff === "personalization";
    setDemoShowDiff(null);

    // Set localStorage flag for cross-app communication
    if (isPersonalization) {
      setCookie("autoweb-demo-persona-active", "true");
      setDemoWorkflowState("personalization-approved");
    } else {
      setCookie("autoweb-demo-pricing-visible", "true");
      setDemoWorkflowState("competitor-approved");
    }

    // Animate approval steps
    let cumulative = 0;
    APPROVAL_STEPS.forEach((step, index) => {
      cumulative += step.delay;
      const timer = setTimeout(() => {
        const entry: ActivityRecord = {
          id: `approval-${isPersonalization ? "p" : "c"}-${index}`,
          timestamp: new Date().toISOString(),
          status: step.status,
          reasoning: step.reasoning,
        };
        setDemoLogEntries((prev) => [entry, ...prev]);

        // On last step, show preview URLs
        if (index === APPROVAL_STEPS.length - 1) {
          if (isPersonalization) {
            setDemoPreviewUrls([
              { label: "Teacher View", url: "http://localhost:3002/?utm_source=canvas-lms" },
              { label: "Student View", url: "http://localhost:3002/?utm_source=unidays" },
            ]);
          } else {
            setDemoPreviewUrls([
              { label: "Learnify (with Pricing)", url: "http://localhost:3002" },
            ]);
          }
          setIframeKey((k) => k + 1);
        }
      }, cumulative);
      demoTimers.current.push(timer);
    });
  }, [demoShowDiff]);

  const handleDemoDeny = useCallback(() => {
    const entry: ActivityRecord = {
      id: `deny-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "failed",
      reasoning: "PR rejected by reviewer.",
    };
    setDemoLogEntries((prev) => [entry, ...prev]);
    setDemoShowDiff(null);
    setDemoWorkflowState("idle");
  }, []);

  const handleResetDemo = useCallback(() => {
    // Clear all timers
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];

    // Clear demo state
    setDemoLogEntries([]);
    setDemoWorkflowState("idle");
    setDemoShowDiff(null);
    setDemoPreviewUrls(null);
    setPersonaResearchDone(false);
    setPersonaResearchRunning(false);
    setPersonaResearchLog([]);
    setActivities([]);
    setStatus(null);
    setRunningAgent(false);
    setBusy(false);

    // Reset onboarding
    setOnboardingStep(1);
    setCompanyName("");
    setCompanyUrl("");
    setCompanyIndustry("");
    setCompanyValue("");
    setUploadedFileName(null);
    setCompetitors([]);
    setPersonaData(null);
    setInsights(null);

    // Clear localStorage flags for cross-app communication
    deleteCookie("autoweb-demo-pricing-visible");
    deleteCookie("autoweb-demo-persona-active");

    // Reset iframe
    setIframeKey((k) => k + 1);

    setCurrentTab("onboarding");
  }, []);

  const handleLaunchAgent = () => {
    if (!personaData) return;
    // Demo mode: skip real API, go to activity tab
    setCurrentTab("activity");
  };

  const handleResetPersonalization = () => {
    // Demo mode: no-op (use Reset Demo in settings instead)
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
    // Skip polling when demo workflow is active
    if (demoLogEntries.length > 0) return;
    try {
      const res = await fetch(`${API_URL}/agent/activity`);
      if (res.ok) setActivities(await res.json());
    } catch { /* backend may be offline */ }
  }, [demoLogEntries.length]);

  const fetchLatestInsights = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/intel/latest`);
      if (res.ok) {
        setInsights(await res.json());
      } else if (res.status === 404) {
        setInsights(null);
      }
    } catch { /* backend may be offline */ }
  }, []);

  useEffect(() => {
    fetchActivities();
    const id = setInterval(fetchActivities, 5000);
    return () => clearInterval(id);
  }, [fetchActivities]);

  // Demo mode: skip fetching dangerous mode from backend on mount

  useEffect(() => {
    if (currentTab === "insights" && !insights) {
      fetchLatestInsights();
    }
  }, [currentTab, insights, fetchLatestInsights]);

  const handleToggleDangerousMode = () => {
    // Demo mode: toggle locally without API call
    setDangerousMode((prev) => !prev);
  };

  const handleRunAgent = () => {
    // Demo mode: run hard-coded competitor workflow instead of real API
    setRunningAgent(true);
    setDemoPreviewUrls(null);
    setStatus("Agent triggered \u2014 watch the activity log.");
    runDemoWorkflow(COMPETITOR_STEPS, "competitor");
    setDemoWorkflowState("competitor-running");
    setTimeout(() => setRunningAgent(false), 1000);
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
                  {onboardingStep === 4 && (
                    <button
                      type="button"
                      onClick={handleLaunchAgent}
                      disabled={busy || !personaData}
                      className="rounded-2xl bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {busy ? "Launching..." : "Launch Agent"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentTab === "activity" && (() => {
              const displayEntries = demoLogEntries.length > 0 ? demoLogEntries : activities;
              const latest = displayEntries[0] as ActivityRecord | undefined;
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
                      disabled={runningAgent || demoWorkflowState === "competitor-running"}
                      onClick={handleRunAgent}
                      className="rounded-2xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {runningAgent ? "Running\u2026" : "Run Agent"}
                    </button>
                  </div>

                  <div className="h-[380px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <div className="grid gap-3 text-sm">
                      {displayEntries.length === 0 && (
                        <p className="text-sm text-[var(--muted)]">
                          No activity yet. Enter a competitor URL above and click Run Agent.
                        </p>
                      )}
                      {displayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 border-b border-dashed border-[var(--border)] pb-3 last:border-none last:pb-0"
                          style={{ animation: "fadeSlideIn 0.3s ease-out" }}
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
                        <h3 className="mt-2 text-lg font-semibold">Code Update</h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {latest.reasoning || "\u2014"}
                        </p>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Status: {latest.status || "\u2014"}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--muted)]">No deployments yet.</p>
                    )}
                  </div>

                  {/* Demo preview URLs after approval */}
                  {demoPreviewUrls && (
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">
                        Live Preview
                      </p>
                      <div className="mt-3 grid gap-2">
                        {demoPreviewUrls.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <span className="text-emerald-500">&#8599;</span>
                            {link.label}
                            <span className="ml-auto text-xs text-emerald-400 font-mono">{link.url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 text-sm text-[var(--muted)]">
                    {demoLogEntries.length > 0
                      ? `${demoLogEntries.length} demo activities`
                      : `Polling every 5s \u00b7 ${activities.length} activities tracked`}
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
                    <p className="text-sm font-semibold">{formatHost(insights?.url)}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {insights?.url ? insights.url : "Run the agent to scan a competitor."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>
                        {insights?.scanned_at
                          ? `Last scanned ${new Date(insights.scanned_at).toLocaleString("en-US")}`
                          : "Not scanned yet"}
                      </span>
                      {insights ? (
                        <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 font-semibold text-[var(--accent)]">
                          Latest
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
                  <div className="flex flex-wrap gap-2 text-sm font-medium">
                    {[
                      { id: "messaging", label: "Messaging" },
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
                        {insights?.hero?.headline ? `"${insights.hero.headline}"` : "—"}
                      </p>
                      <p className="font-semibold">Tagline</p>
                      <p className="text-[var(--muted)]">
                        {insights?.hero?.subheadline ? `"${insights.hero.subheadline}"` : "—"}
                      </p>
                    </div>
                  )}

                  {insightsTab === "keywords" && (
                    <div className="mt-6 grid gap-3 text-sm">
                      <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        <span>Them</span>
                        <span>You</span>
                      </div>
                      {(insights?.keywords && insights.keywords.length > 0) ? (
                        insights.keywords.map((word) => (
                          <div
                            key={word}
                            className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                          >
                            <span>{word}</span>
                            <span className="text-[var(--muted)]">\u2014</span>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
                          \u2014
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === "personalization" && (
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Personalization
                  </p>
                  <h2 className="font-editorial text-2xl font-semibold">Persona Playbook</h2>
                </div>

                {/* ── Phase 1: Research prompt (before research is done) ── */}
                {!personaResearchDone && (
                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Discover Visitor Personas</h3>
                      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
                        Use Nemotron to analyze your application context and identify the key visitor
                        segments. The model will research your industry, value proposition, and typical
                        user profiles to generate a personalization strategy.
                      </p>
                      <button
                        type="button"
                        onClick={handleRunPersonaResearch}
                        disabled={personaResearchRunning}
                        className="mt-6 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {personaResearchRunning ? "Researching\u2026" : "Run Market Research with Nemotron"}
                      </button>
                    </div>

                    {/* Research log entries */}
                    {personaResearchLog.length > 0 && (
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Research Progress
                        </p>
                        <div className="grid gap-2 text-sm">
                          {personaResearchLog.map((entry, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2"
                              style={{ animation: "fadeSlideIn 0.3s ease-out" }}
                            >
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                              <span className="text-[var(--muted)]">{entry}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Phase 2: Results (after research completes) ── */}
                {personaResearchDone && (
                  <>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex rounded-full border border-[var(--border)] p-1 text-sm">
                        {[
                          { id: "teacher", label: "Teacher" },
                          { id: "student", label: "Student" },
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
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Generated by Nemotron
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          title: "Teacher",
                          utm: "utm_source=canvas-lms",
                          hero: "Empower your classroom with smarter tools",
                          cta: "Start Your Free Trial",
                          proof: "Trusted by 10,000+ educators worldwide",
                          emphasis: "Grading \u00b7 Curriculum \u00b7 Student analytics",
                        },
                        {
                          title: "Student",
                          utm: "utm_source=unidays",
                          hero: "Study smarter, not harder",
                          cta: "Get Started Free",
                          proof: "Join 50,000+ students already learning",
                          emphasis: "Flashcards \u00b7 Practice tests \u00b7 Study plans",
                        },
                      ].map((card) => (
                        <div
                          key={card.title}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5"
                          style={{ animation: "fadeSlideIn 0.4s ease-out" }}
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

                    <div className="flex justify-start gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDemoPreviewUrls(null);
                          runDemoWorkflow(PERSONALIZATION_STEPS, "personalization");
                          setDemoWorkflowState("personalization-running");
                          setCurrentTab("activity");
                        }}
                        disabled={demoWorkflowState === "personalization-running" || demoWorkflowState === "personalization-diff"}
                        className="rounded-2xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Deploy Personalization
                      </button>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                        Simulate Visitor
                      </p>
                      <h3 className="font-editorial text-xl font-semibold">Side-by-Side Preview</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {[
                          { label: "Teacher View", utm: "utm_source=canvas-lms" },
                          { label: "Student View", utm: "utm_source=unidays" },
                        ].map((view) => {
                          const baseUrl = process.env.NEXT_PUBLIC_PROJECT_FLOW_URL || "http://localhost:3002";
                          return (
                            <div
                              key={view.label}
                              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3"
                            >
                              <p className="text-sm font-semibold">{view.label}</p>
                              <p className="text-xs text-[var(--muted)]">?{view.utm}</p>
                              <iframe
                                key={iframeKey}
                                src={`${baseUrl}/?${view.utm}`}
                                className="mt-2 h-[400px] w-full rounded-xl border border-[var(--border)]"
                                title={view.label}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIframeKey((k) => k + 1)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium"
                        >
                          Refresh Previews
                        </button>
                      </div>
                    </div>
                  </>
                )}
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

                  {/* Reset Demo */}
                  <div className="rounded-2xl border border-[var(--danger)] bg-[#fef0ef] p-5">
                    <p className="text-sm font-semibold text-[var(--danger)]">Reset Demo</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Clear all activity, reset the Learnify site, and return to initial state.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="mt-4 rounded-2xl bg-[var(--danger)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Reset Everything
                    </button>
                  </div>
                </div>
              </div>
            )}

            {status && <p className="text-xs text-[var(--muted)]">{status}</p>}
          </section>
        </main>
      </div>

      {/* ── Diff Review Modal Overlay ── */}
      {demoShowDiff && (() => {
        const diff = demoShowDiff === "personalization" ? PERSONALIZATION_DIFF : COMPETITOR_DIFF;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Code Review</p>
                  <h3 className="mt-1 text-lg font-semibold">{diff.title}</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Awaiting Review
                </span>
              </div>

              <div className="px-6 py-4">
                <p className="mb-3 font-mono text-xs text-[var(--muted)]">{diff.file}</p>
                <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-neutral-50 font-mono text-sm">
                  {diff.lines.map((line, i) => {
                    let bg = "";
                    let prefix = " ";
                    let textColor = "text-neutral-700";
                    if (line.type === "removed") {
                      bg = "bg-red-50";
                      prefix = "-";
                      textColor = "text-red-800";
                    } else if (line.type === "added") {
                      bg = "bg-green-50";
                      prefix = "+";
                      textColor = "text-green-800";
                    }
                    return (
                      <div key={i} className={`flex ${bg}`}>
                        <span className="w-8 shrink-0 select-none text-right text-neutral-400 pr-2 border-r border-neutral-200">
                          {i + 1}
                        </span>
                        <span className={`w-5 shrink-0 text-center select-none ${textColor}`}>{prefix}</span>
                        <span className={`flex-1 whitespace-pre px-2 ${textColor}`}>{line.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
                <button
                  type="button"
                  onClick={handleDemoDeny}
                  className="rounded-2xl border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  Deny
                </button>
                <button
                  type="button"
                  onClick={handleDemoApprove}
                  className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Approve &amp; Merge
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── CSS animation for activity log entries ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

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
