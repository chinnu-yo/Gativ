'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ShieldCheck, 
  Terminal, 
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Rocket,
  CheckCircle2,
  Zap,
  FolderGit2,
  GitPullRequest,
  ArrowRight,
  Code2
} from 'lucide-react';
import RoleSelector from '@/components/RoleSelector';
import GapReportView from '@/components/GapReportView';
import SprintBoard from '@/components/SprintBoard';
import ProjectIdeas from '@/components/ProjectIdeas';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuthState } from '@/lib/auth';
import { analyzeAudit, AuditAnalyzeRequest, AuditAnalyzeResponse } from '@/lib/api';

type Step = 'landing' | 'selector' | 'analyzing' | 'report' | 'projects' | 'sprint';

export default function Home() {
  const { user, githubToken } = useAuthState();
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [auditRequest, setAuditRequest] = useState<AuditAnalyzeRequest | null>(null);
  const [auditResponse, setAuditResponse] = useState<AuditAnalyzeResponse | null>(null);

  // Restore audit state from localStorage on mount (with fallback for legacy key)
  useEffect(() => {
    try {
      const savedRequest = localStorage.getItem('gativ_audit_request') || localStorage.getItem('sprintready_audit_request');
      const savedResponse = localStorage.getItem('gativ_audit_response') || localStorage.getItem('sprintready_audit_response');
      if (savedRequest && savedResponse) {
        setAuditRequest(JSON.parse(savedRequest));
        setAuditResponse(JSON.parse(savedResponse));
      }
    } catch (e) {
      console.warn('Failed to restore saved audit state:', e);
    }
  }, []);

  const handleStartAudit = async (request: AuditAnalyzeRequest) => {
    setAuditRequest(request);
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentStep('analyzing');

    try {
      const response = await analyzeAudit(request);
      setAuditResponse(response);

      try {
        localStorage.setItem('gativ_audit_request', JSON.stringify(request));
        localStorage.setItem('gativ_audit_response', JSON.stringify(response));
      } catch (e) {
        console.warn('Failed to persist audit state to localStorage:', e);
      }

      setCurrentStep('report');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to complete repository audit. Please ensure backend server is running.'
      );
      setCurrentStep('selector');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('selector');
    setAuditResponse(null);
    setErrorMessage(null);
    try {
      localStorage.removeItem('gativ_audit_request');
      localStorage.removeItem('gativ_audit_response');
      localStorage.removeItem('sprintready_audit_request');
      localStorage.removeItem('sprintready_audit_response');
    } catch (e) {}
  };

  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 font-sans transition-colors duration-200">
      {/* Top Sticky Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentStep('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200 flex items-center justify-center font-mono font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              G
            </div>
            <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
              Gativ
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono hidden sm:inline-block">
              AI Proof-of-Work Engine
            </span>
          </div>

          {/* Navigation Bar Tabs & Controls */}
          <div className="flex items-center gap-3">
            {auditResponse && (
              <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setCurrentStep('report')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentStep === 'report'
                      ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Gap Report
                </button>
                <button
                  onClick={() => setCurrentStep('projects')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentStep === 'projects'
                      ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Portfolio Projects
                </button>
                <button
                  onClick={() => setCurrentStep('sprint')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentStep === 'sprint'
                      ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Sprint Board
                </button>
              </div>
            )}

            {currentStep !== 'landing' && currentStep !== 'selector' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                New Audit
              </button>
            )}

            {/* Theme Toggle Button */}
            <ThemeToggle />
            
            {/* Firebase Auth & GitHub Connect Button */}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* VIEW 1: High-Converting Landing Page */}
      {currentStep === 'landing' && (
        <div className="space-y-24 py-12 px-6 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 text-xs font-mono shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Automated GitHub Code Signal Harvesting & Verification</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
              Audit Your GitHub Signals.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Build Recruiter-Verified Proof of Work.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Stop guessing your engineering readiness score. <strong>Gativ</strong> scans your real GitHub repositories for production gaps against top company rubrics, recommends enterprise portfolio projects, and issues recruiter-verified proof badges.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentStep('selector')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Connect GitHub & Analyze</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentStep('selector')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-sm border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Try Instant Demo Audit</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Real GitHub REST API
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Gemini LLM Calibrated
              </span>
            </div>
          </div>

          {/* 3-Step Visual Workflow */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                3-Step Visual Workflow
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                From Raw Repository Code to Recruiter-Verified Proof of Work
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4 shadow-sm dark:shadow-xl relative overflow-hidden group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-bold text-base">
                  01
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">1. Connect GitHub Profile</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Connect your GitHub OAuth token in 1-click. Our service scans manifest files, PyTest suites, Dockerfiles, and architecture signals.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4 shadow-sm dark:shadow-xl relative overflow-hidden group">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-mono font-bold text-base">
                  02
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">2. AI Role Gap Audit</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Gemini LLM evaluates your harvested signals against target role benchmarks (Startup & Big Tech) to output an unbiased 360° Readiness Index.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4 shadow-sm dark:shadow-xl relative overflow-hidden group">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono font-bold text-base">
                  03
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">3. Sprint & PR Verification</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Execute 48-hour sprint milestones, submit your GitHub Pull Request URL for REST API verification, and unlock recruiter-verified proof badges.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Engine Architecture & Capabilities
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Built for Software Engineers Seeking Top Tier Roles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">Live GitHub Signal Harvesting</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Deep manifest inspection detects FastAPI, Redis, Docker, PyTest, Go, React, and CI/CD pipeline signals without manual data entry.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 shrink-0 mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">360° Calibrated AI Readiness Index</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Fair 0-100 scoring baseline calibrated against Startup & Big Tech candidate rubrics with strict grounding to eliminate hallucinations.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">Automated PR Proof-of-Work Verification</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Real GitHub REST API checks inspect PR open/merged status and proof of work integrity before updating sprint progress.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">Personalized Resume Project Ideas</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Curated enterprise-grade microservice ideas tailored to your gaps to replace generic tutorial CRUDs with system-level projects.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-900/20 via-zinc-900 to-zinc-900 dark:from-emerald-950/60 dark:via-zinc-900 dark:to-zinc-900 border border-emerald-500/30 text-center space-y-6 shadow-xl text-white">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Bridge Your Code Signals?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
              Scan your repositories in under 30 seconds and generate your personalized sprint roadmap.
            </p>
            <button
              onClick={() => setCurrentStep('selector')}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-md inline-flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Start Free Repository Audit</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: App Workspace Container (Selector / Analyzing / Report / Projects / Sprint) */}
      {currentStep !== 'landing' && (
        <div className="py-10 px-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Navigation Step Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setCurrentStep('landing')}
              className="px-3 py-1.5 rounded-full text-xs font-mono bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors shadow-sm"
            >
              Overview
            </button>
            <span className="text-zinc-400 dark:text-zinc-700 font-mono">→</span>

            <button
              onClick={() => setCurrentStep('selector')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                currentStep === 'selector'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              1. Role Selector
            </button>
            <span className="text-zinc-400 dark:text-zinc-700 font-mono">→</span>

            <button
              onClick={() => auditResponse && setCurrentStep('report')}
              disabled={!auditResponse}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all disabled:opacity-40 ${
                currentStep === 'report'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              2. Gap Audit Report
            </button>
            <span className="text-zinc-400 dark:text-zinc-700 font-mono">→</span>

            <button
              onClick={() => auditResponse && setCurrentStep('projects')}
              disabled={!auditResponse}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all disabled:opacity-40 ${
                currentStep === 'projects'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              3. Portfolio Projects
            </button>
            <span className="text-zinc-400 dark:text-zinc-700 font-mono">→</span>

            <button
              onClick={() => auditResponse && setCurrentStep('sprint')}
              disabled={!auditResponse}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all disabled:opacity-40 ${
                currentStep === 'sprint'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              4. Sprint Board
            </button>
          </div>

          {/* Step 1: Role Selector View */}
          {currentStep === 'selector' && (
            <RoleSelector
              onAnalyze={handleStartAudit}
              isLoading={isLoading}
              activeGithubToken={githubToken}
            />
          )}

          {/* Step 2: Analyzing Loading View */}
          {currentStep === 'analyzing' && (
            <div className="max-w-xl mx-auto py-16 px-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center space-y-6 shadow-xl">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Evaluating GitHub Repository Signals
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  Calling FastAPI backend & Gemini LLM gap analyzer...
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>[1/3] Fetching public user repositories via REST API...</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>[2/3] Inspecting test suites, Dockerfiles & architecture...</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <span>[3/3] Generating audit, portfolio projects & sprint plan...</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Gap Report Display */}
          {currentStep === 'report' && auditResponse && (
            <GapReportView
              report={auditResponse}
              targetRole={auditRequest?.target_role || 'backend_go_sde1'}
              onProceedToSprint={() => setCurrentStep('sprint')}
              onViewProjects={() => setCurrentStep('projects')}
              onReset={handleReset}
            />
          )}

          {/* Step 4: Portfolio Projects Display */}
          {currentStep === 'projects' && auditResponse && (
            <ProjectIdeas
              projects={auditResponse?.recommended_projects || (auditResponse as any)?.projects || []}
              targetRole={auditRequest?.target_role || 'backend_go_sde1'}
              onLaunchSprint={() => setCurrentStep('sprint')}
              onReset={handleReset}
            />
          )}

          {/* Step 5: Sprint Board Execution */}
          {currentStep === 'sprint' && auditResponse && (
            <SprintBoard
              sprint={auditResponse.recommended_sprint}
              onBackToReport={() => setCurrentStep('report')}
            />
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 py-8 px-6 text-center text-xs text-zinc-500 dark:text-zinc-500 font-mono transition-colors">
        Gativ AI-Native Proof-of-Work Engine • Firebase Auth & Supabase Postgres Integration
      </footer>
    </main>
  );
}
