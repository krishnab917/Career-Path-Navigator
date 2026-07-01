import { useEffect, useRef } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Hls from "hls.js";

/**
 * CtaFooter Component
 *
 * A cinematic full-width CTA section with HLS video background,
 * liquid glassmorphism effects, and integrated footer.
 *
 * Features:
 * - HLS video streaming via Mux
 * - Animated gradient overlays
 * - Liquid glass CTA buttons with border glow
 * - Minimal footer bar with links
 * - Fully responsive
 */

const CtaFooter = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize HLS video streaming
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mux HLS stream URL - replace with your own if needed
    const src =
      "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay may be blocked; user will need to interact
        });
      });

      return () => {
        hls.destroy();
      };
    } else if (
      video.canPlayType("application/vnd.apple.mpegurl") === "maybe" ||
      video.canPlayType("application/vnd.apple.mpegurl") === "probably"
    ) {
      // Safari native HLS support
      video.src = src;
      video.play().catch(() => {
        // Handle autoplay restriction
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 px-6 md:px-16 lg:px-24 text-center overflow-hidden"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BACKGROUND VIDEO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onCanPlay={(e) => {
          // Ensure video plays if autoplay was deferred
          const video = e.currentTarget;
          if (video.paused) {
            video.play().catch(() => {});
          }
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GRADIENT OVERLAYS (fade edges)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Top fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          height: "220px",
          background: "linear-gradient(to bottom, rgb(15, 23, 42), transparent)",
        }}
      />

      {/* Bottom fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          height: "220px",
          background: "linear-gradient(to top, rgb(15, 23, 42), transparent)",
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CONTENT
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10">
        {/* Animated pulse background */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
        />

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
        >
          Don't guess your future.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Simulate it.
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Join 2,400+ students who discovered their career fit through realistic
          scenarios and behavioral analysis. Start your simulation in 18 minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          {/* Primary Button: Liquid Glass */}
          <button
            className="group relative px-8 py-4 rounded-lg text-white font-semibold text-[15px] overflow-hidden transition-all duration-300"
            style={{
              background: "rgba(99, 102, 241, 0.15)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
            }}
          >
            <div className="relative z-10 flex items-center gap-2">
              Start Simulation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Gradient border glow */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </button>

          {/* Secondary Button: Outlined */}
          <button
            className="group px-8 py-4 rounded-lg text-white font-semibold text-[15px] border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 flex items-center gap-2"
          >
            View Results
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FOOTER BAR
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left: Brand + tagline */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">PathPilot</p>
              <p className="text-slate-500 text-xs">Career discovery through simulation</p>
            </div>
          </div>

          {/* Right: Footer links */}
          <div className="flex items-center gap-8 md:gap-12">
            {["Privacy Policy", "Terms", "Support"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-slate-500 hover:text-slate-300 transition-colors text-xs font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright (mobile only, below links) */}
          <div className="md:hidden w-full text-center pt-6 border-t border-slate-700/30">
            <p className="text-slate-600 text-xs">
              © 2024 PathPilot. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* Copyright (desktop only) */}
        <div className="hidden md:block mt-8 text-center">
          <p className="text-slate-600 text-xs">
            © 2024 PathPilot. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaFooter;
