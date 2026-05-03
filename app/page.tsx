"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen kid-bg relative overflow-hidden flex flex-col">
      {/* DS logo */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-10 flex items-center gap-2 text-space-navy">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-ds-orange text-white font-display font-bold">
          DS
        </span>
        <span className="font-display text-base hidden sm:inline">Digital Scholar</span>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 items-center px-6 py-16 sm:py-20 lg:py-0 max-w-6xl mx-auto w-full gap-10">
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ds-orange/10 text-ds-orange text-xs font-display tracking-wide uppercase">
            For ages 9–17
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-space-navy leading-[1.05] tracking-tight">
            Learn to build
            <br />
            with <span className="text-ds-orange">AI.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-space-navy/65 max-w-md mx-auto lg:mx-0">
            AI SuperKids is Digital Scholar's live cohort program teaching the next generation
            how to think, prompt, and build with modern AI tools.
          </p>
        </motion.div>

        {/* Right — login */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mx-auto lg:ml-auto"
        >
          <form
            className="kid-card p-6 sm:p-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
          >
            <h2 className="font-display text-xl text-space-navy">Sign in</h2>
            <p className="text-sm text-space-navy/55 -mt-1.5">
              Use the parent email your DS coordinator set up.
            </p>

            <label className="block pt-2">
              <span className="text-xs uppercase tracking-wider text-space-navy/55 font-display">
                Email
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-space-navy/10 focus-within:border-ds-orange focus-within:ring-2 focus-within:ring-ds-orange/15 px-3 transition-all">
                <Mail className="w-4 h-4 text-space-navy/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="flex-1 py-3 outline-none font-body bg-transparent"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-space-navy/55 font-display">
                Password
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-space-navy/10 focus-within:border-ds-orange focus-within:ring-2 focus-within:ring-ds-orange/15 px-3 transition-all">
                <Lock className="w-4 h-4 text-space-navy/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 py-3 outline-none font-body bg-transparent"
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 w-full bg-ds-orange text-white font-display font-semibold text-base py-3.5 rounded-xl flex items-center justify-center gap-2 tap-scale hover:brightness-110 transition"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 my-1">
              <span className="flex-1 h-px bg-space-navy/10" />
              <span className="text-xs text-space-navy/40 font-display">or</span>
              <span className="flex-1 h-px bg-space-navy/10" />
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-white border border-space-navy/10 hover:border-space-navy/30 text-space-navy font-display font-medium text-sm py-3 rounded-xl flex items-center justify-center gap-2 tap-scale transition"
            >
              <Chrome className="w-4 h-4 text-electric-cyan" />
              Continue with Google
            </button>

            <p className="text-center text-xs text-space-navy/50 pt-2 font-body">
              New here?{" "}
              <Link href="/contact" className="text-ds-orange font-display">
                Contact your DS coordinator
              </Link>
            </p>
          </form>

          <p className="mt-4 text-xs text-space-navy/45 font-body text-center">
            Parent-managed access · COPPA & DPDP compliant
          </p>
        </motion.div>
      </div>
    </main>
  );
}
