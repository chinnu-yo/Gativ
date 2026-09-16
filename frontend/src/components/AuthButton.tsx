'use client';

import React, { useState } from 'react';
import { GitBranch, LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { signInWithGithub, signOutUser, useAuthState } from '@/lib/auth';

interface AuthButtonProps {
  onTokenRetrieved?: (token: string) => void;
}

export default function AuthButton({ onTokenRetrieved }: AuthButtonProps) {
  const { user, githubToken, loading } = useAuthState();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const { token } = await signInWithGithub();
      if (token && onTokenRetrieved) {
        onTokenRetrieved(token);
      }
    } catch (err) {
      console.error('Authentication error:', err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Auth Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 px-2">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Avatar'}
              className="w-7 h-7 rounded-full border border-emerald-500/40"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
              {user.displayName || 'GitHub User'}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 leading-none">
              OAuth Token Active
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-lg bg-white dark:bg-zinc-950 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-zinc-500 dark:text-zinc-400 transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isAuthenticating}
      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 transition-all shadow-sm disabled:opacity-50 font-mono"
    >
      {isAuthenticating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <GitBranch className="w-4 h-4" />
          <span>Connect GitHub</span>
        </>
      )}
    </button>
  );
}
