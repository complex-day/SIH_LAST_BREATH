"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("admin@cyberquant.ai");
  const [password, setPassword] = useState<string>("admin");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (
      (email.trim().toLowerCase() === "admin@cyberquant.ai" || email.trim() === "admin") &&
      password === "admin"
    ) {
      localStorage.setItem("auth_token", "mock_jwt_token_123");
      localStorage.setItem("user_email", email.trim());
      router.push("/");
    } else {
      setIsSubmitting(false);
      setError("AUTHENTICATION FAILED: Invalid credentials. Use demo email: admin@cyberquant.ai / password: admin");
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@cyberquant.ai");
    setPassword("admin");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#ebd6d1] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-[#0faae6] text-white border-2 border-black mb-3">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
          CyberQuant <span className="text-[#0faae6]">AI</span>
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Continuous Cyber Risk Quantification & Investment Optimization
        </p>
      </div>

      {/* Login Card with Heavy Electric Blue Border and Sharp Corners */}
      <div className="w-full max-w-md bg-white border-4 border-[#0faae6] rounded-none p-8">
        <div className="mb-6 border-b-2 border-green-600 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-[#0faae6] uppercase">Access Terminal</h2>
          <p className="text-xs text-gray-600 mt-1">
            Authenticate to initiate continuous FAIR Monte Carlo risk modeling.
          </p>
        </div>

        {/* Demo Quick-Fill Banner */}
        <div className="mb-5 border-2 border-[#2546c7] bg-white p-3 text-xs flex items-center justify-between rounded-none">
          <div className="flex items-center gap-2 text-gray-800">
            <KeyRound className="h-4 w-4 text-[#0faae6]" />
            <span>Demo: <span className="font-bold text-black">admin@cyberquant.ai</span> / <span className="font-bold text-black">admin</span></span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-xs font-bold text-[#0faae6] hover:text-black uppercase tracking-wider underline"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert using cobalt blue */}
        {error && (
          <div className="mb-4 bg-[#2546c7] text-white p-3 text-xs font-bold rounded-none border-2 border-black flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase mb-1.5">
              Enterprise Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cyberquant.ai"
                className="w-full rounded-none border-2 border-black bg-white pl-10 pr-3.5 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-[#0faae6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-900 uppercase">
                Passcode
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-none border-2 border-black bg-white pl-10 pr-3.5 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-[#0faae6] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-none bg-[#0faae6] px-4 py-3 text-sm font-bold text-white hover:bg-[#0d92c7] border-2 border-black transition flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>{isSubmitting ? "Authenticating..." : "Enter Platform"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 border-t-2 border-green-600 pt-4 text-center">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-mono">
            Zero-Trust Continuous Telemetry Gate
          </p>
        </div>
      </div>
    </div>
  );
}
