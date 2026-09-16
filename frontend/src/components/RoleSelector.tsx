'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Code, 
  Globe, 
  Building2, 
  Rocket, 
  Key, 
  Zap, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AuditAnalyzeRequest } from '@/lib/api';

interface RoleSelectorProps {
  onAnalyze: (request: AuditAnalyzeRequest) => void;
  isLoading: boolean;
  activeGithubToken?: string | null;
}

export const ROLES = [
  {
    id: 'backend_go_sde1',
    title: 'Backend Engineer (Go)',
    icon: Server,
    description: 'High concurrency API design, gRPC, microservices & Redis caching',
    badge: 'Popular',
  },
  {
    id: 'backend_python_sde1',
    title: 'Backend Engineer (Python)',
    icon: Code,
    description: 'FastAPI, async ORM, Celery background tasks & SQL optimization',
    badge: 'Trending',
  },
  {
    id: 'frontend_react_sde1',
    title: 'Frontend Engineer (React/Next)',
    icon: Globe,
    description: 'Next.js App Router, Tailwind CSS, state management & Web Vitals',
    badge: 'New',
  },
];

export const COMPANY_TIERS = [
  {
    id: 'startup',
    title: 'High-Growth Startup',
    icon: Rocket,
    description: 'Rapid iteration, full ownership, testing & clean MVPs',
  },
  {
    id: 'bigtech',
    title: 'Big Tech Enterprise',
    icon: Building2,
    description: 'Strict architectural patterns, high test coverage & scale',
  },
];

export default function RoleSelector({
  onAnalyze,
  isLoading,
  activeGithubToken,
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState('backend_go_sde1');
  const [companyTier, setCompanyTier] = useState('startup');
  const [githubToken, setGithubToken] = useState(
    activeGithubToken || 'gho_demo_token_123456'
  );
  const [sprintDuration, setSprintDuration] = useState(7);

  useEffect(() => {
    if (activeGithubToken) {
      setGithubToken(activeGithubToken);
    }
  }, [activeGithubToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      github_token: githubToken,
      target_role: selectedRole,
      company_tier: companyTier,
      sprint_duration_days: sprintDuration,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-white dark:bg-zinc-900/60 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur shadow-sm dark:shadow-2xl transition-colors">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Select Your Target Job Role & Benchmark Tier
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Gativ will harvest your GitHub code signals and run a Gemini LLM gap analysis tailored to your target position.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Target Role Cards */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>1. Select Target Job Lane</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-white shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-950'
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className={`p-2 rounded-xl border ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                        {role.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-base mb-1 text-zinc-900 dark:text-white">{role.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Company Tier & Sprint Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Tier */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span>2. Target Company Tier</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {COMPANY_TIERS.map((tier) => {
                const Icon = tier.icon;
                const isSelected = companyTier === tier.id;
                return (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setCompanyTier(tier.id)}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-white'
                        : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-zinc-900 dark:text-white">{tier.title}</h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{tier.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & GitHub Token */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Sprint Plan Duration</span>
              </label>
              <select
                value={sprintDuration}
                onChange={(e) => setSprintDuration(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              >
                <option value={2}>48 Hours (Rapid Sprint)</option>
                <option value={7}>7 Days (Standard Sprint)</option>
                <option value={14}>14 Days (Comprehensive Sprint)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Key className="w-3.5 h-3.5" />
                <span>GitHub Connection Status</span>
              </label>
              {githubToken ? (
                <div className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>✓ GitHub Account Connected</span>
                </div>
              ) : (
                <div className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2 font-mono">
                  <span>GitHub Account Not Connected</span>
                </div>
              )}
              <p className="text-[11px] text-zinc-500">
                Secure session active. Token is used strictly to read public repo structures & commits.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold text-base transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Harvesting GitHub Signals & Running Gemini Audit...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white dark:fill-zinc-950" />
                <span>Execute Role Gap Audit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
