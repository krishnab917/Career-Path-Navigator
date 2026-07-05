import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowRight, Zap, Users, TrendingUp, Award, Sparkles } from "lucide-react";
import { COLORS, SPACING, TYPOGRAPHY } from "../lib/design-system";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div style={{ background: COLORS.background, color: COLORS.textPrimary, fontFamily: TYPOGRAPHY.fontFamily.sans }}>
      {/* Hero Section */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Animated background orb */}
        <motion.div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "800px",
            padding: `0 ${SPACING[4]}`,
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            style={{
              fontSize: TYPOGRAPHY.fontSize["5xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[6],
              lineHeight: TYPOGRAPHY.lineHeight.tight,
              letterSpacing: TYPOGRAPHY.letterSpacing.tight,
            }}
            variants={itemVariants}
          >
            Experience Your Career,{" "}
            <span style={{ background: COLORS.gradientPrimary, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Not Just Learn It
            </span>
          </motion.h1>

          <motion.p
            style={{
              fontSize: TYPOGRAPHY.fontSize.xl,
              color: COLORS.textSecondary,
              marginBottom: SPACING[8],
              lineHeight: TYPOGRAPHY.lineHeight.relaxed,
            }}
            variants={itemVariants}
          >
            PathPilot is a simulation-first career discovery platform that lets you experience real careers through interactive scenarios, make meaningful decisions, and get personalized recommendations based on your actual behavior.
          </motion.p>

          <motion.div
            style={{
              display: "flex",
              gap: SPACING[4],
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            variants={itemVariants}
          >
            <Button
              style={{
                background: COLORS.primary,
                color: COLORS.textPrimary,
                padding: `${SPACING[3]} ${SPACING[6]}`,
                fontSize: TYPOGRAPHY.fontSize.base,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: SPACING[2],
              }}
            >
              Start Exploring <ArrowRight size={20} />
            </Button>
            <Button
              style={{
                background: "transparent",
                color: COLORS.textPrimary,
                padding: `${SPACING[3]} ${SPACING[6]}`,
                fontSize: TYPOGRAPHY.fontSize.base,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: `${SPACING[20]} ${SPACING[4]}`, background: COLORS.surface }}>
        <motion.div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: TYPOGRAPHY.fontSize["4xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[12],
              textAlign: "center",
            }}
            variants={itemVariants}
          >
            The Problem with Traditional Career Guidance
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: SPACING[6] }}>
            {[
              {
                icon: "❌",
                title: "Generic Questionnaires",
                description: "You answer questions about interests, but that doesn't tell you what you'll actually enjoy doing.",
              },
              {
                icon: "😴",
                title: "Boring & Disconnected",
                description: "Career guidance feels like homework, not like exploring real opportunities.",
              },
              {
                icon: "🎯",
                title: "No Real Feedback",
                description: "You never see the consequences of your choices or how your decisions affect outcomes.",
              },
              {
                icon: "📊",
                title: "One-Size-Fits-All",
                description: "Recommendations are based on demographics, not on who you actually are.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  style={{
                    padding: SPACING[6],
                    background: COLORS.surfaceAlt,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: SPACING[3] }}>{item.icon}</div>
                  <h3 style={{ fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: TYPOGRAPHY.fontWeight.semibold, marginBottom: SPACING[2] }}>
                    {item.title}
                  </h3>
                  <p style={{ color: COLORS.textSecondary, lineHeight: TYPOGRAPHY.lineHeight.relaxed }}>{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section style={{ padding: `${SPACING[20]} ${SPACING[4]}` }}>
        <motion.div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: TYPOGRAPHY.fontSize["4xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[12],
              textAlign: "center",
            }}
            variants={itemVariants}
          >
            How PathPilot Works
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: SPACING[6] }}>
            {[
              {
                icon: <Zap size={32} />,
                title: "Experience Careers",
                description: "Immerse yourself in realistic career simulations with branching scenarios and real consequences.",
              },
              {
                icon: <Users size={32} />,
                title: "Make Decisions",
                description: "Navigate complex situations and see how your choices affect outcomes and metrics.",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Build Your Profile",
                description: "Your behavioral profile develops naturally through your choices, not self-reported interests.",
              },
              {
                icon: <Award size={32} />,
                title: "Get Recommendations",
                description: "Receive personalized career recommendations based on your actual behavior and traits.",
              },
              {
                icon: <Sparkles size={32} />,
                title: "Find Opportunities",
                description: "Discover hundreds of internships, programs, and opportunities matched to your profile.",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Build Your Roadmap",
                description: "Create a personalized career roadmap with milestones, timelines, and actionable next steps.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  style={{
                    padding: SPACING[6],
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: COLORS.primary, marginBottom: SPACING[4] }}>{item.icon}</div>
                  <h3 style={{ fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: TYPOGRAPHY.fontWeight.semibold, marginBottom: SPACING[2] }}>
                    {item.title}
                  </h3>
                  <p style={{ color: COLORS.textSecondary, lineHeight: TYPOGRAPHY.lineHeight.relaxed }}>{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Simulation Preview Section */}
      <section style={{ padding: `${SPACING[20]} ${SPACING[4]}`, background: COLORS.surface }}>
        <motion.div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: TYPOGRAPHY.fontSize["4xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[8],
              textAlign: "center",
            }}
            variants={itemVariants}
          >
            Experience a Real Simulation
          </motion.h2>

          <motion.div
            style={{
              background: COLORS.surfaceAlt,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              padding: SPACING[8],
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            variants={itemVariants}
          >
            <div style={{ marginBottom: SPACING[6] }}>
              <h3 style={{ fontSize: TYPOGRAPHY.fontSize["2xl"], fontWeight: TYPOGRAPHY.fontWeight.semibold, marginBottom: SPACING[4] }}>
                Software Engineer Simulation
              </h3>
              <p style={{ color: COLORS.textSecondary, marginBottom: SPACING[4] }}>
                You've just joined TechCorp as a junior engineer. Your team is working on a critical feature. What do you do?
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACING[4] }}>
              <Card
                style={{
                  padding: SPACING[4],
                  background: COLORS.surface,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: `all 200ms ease`,
                }}
              >
                <p style={{ fontWeight: TYPOGRAPHY.fontWeight.semibold, marginBottom: SPACING[2] }}>Ask for guidance</p>
                <p style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textTertiary }}>Learn from experienced engineers and build relationships.</p>
              </Card>
              <Card
                style={{
                  padding: SPACING[4],
                  background: COLORS.surface,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: `all 200ms ease`,
                }}
              >
                <p style={{ fontWeight: TYPOGRAPHY.fontWeight.semibold, marginBottom: SPACING[2] }}>Jump in immediately</p>
                <p style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textTertiary }}>Show initiative and start contributing right away.</p>
              </Card>
            </div>

            <div style={{ marginTop: SPACING[6], padding: `${SPACING[4]} ${SPACING[6]}`, background: COLORS.surface, borderRadius: "8px", borderLeft: `4px solid ${COLORS.primary}` }}>
              <p style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                💡 Your choice affects metrics like Team Morale, Product Quality, and your behavioral profile. See how your decisions shape your career path.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: `${SPACING[20]} ${SPACING[4]}` }}>
        <motion.div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: TYPOGRAPHY.fontSize["4xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[12],
              textAlign: "center",
            }}
            variants={itemVariants}
          >
            What Students Say
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: SPACING[6] }}>
            {[
              {
                name: "Sarah Chen",
                role: "High School Senior",
                quote: "PathPilot helped me realize I actually love software engineering. The simulations felt real, not like a quiz.",
              },
              {
                name: "Marcus Johnson",
                role: "College Junior",
                quote: "The career recommendations were spot-on. They matched my actual behavior, not just my interests.",
              },
              {
                name: "Priya Patel",
                role: "Recent Graduate",
                quote: "The roadmap builder helped me plan my entire career path. I landed my dream internship using the opportunities PathPilot suggested.",
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  style={{
                    padding: SPACING[6],
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "12px",
                  }}
                >
                  <p style={{ fontSize: TYPOGRAPHY.fontSize.base, marginBottom: SPACING[4], lineHeight: TYPOGRAPHY.lineHeight.relaxed, fontStyle: "italic" }}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p style={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>{testimonial.name}</p>
                    <p style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: `${SPACING[20]} ${SPACING[4]}`, background: COLORS.surface }}>
        <motion.div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: TYPOGRAPHY.fontSize["4xl"],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              marginBottom: SPACING[6],
            }}
            variants={itemVariants}
          >
            Ready to Discover Your Career?
          </motion.h2>

          <motion.p
            style={{
              fontSize: TYPOGRAPHY.fontSize.lg,
              color: COLORS.textSecondary,
              marginBottom: SPACING[8],
              lineHeight: TYPOGRAPHY.lineHeight.relaxed,
            }}
            variants={itemVariants}
          >
            Join thousands of students who are discovering their ideal careers through immersive simulations and personalized guidance.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              style={{
                background: COLORS.primary,
                color: COLORS.textPrimary,
                padding: `${SPACING[4]} ${SPACING[8]}`,
                fontSize: TYPOGRAPHY.fontSize.lg,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: SPACING[2],
              }}
            >
              Get Started Free <ArrowRight size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: `${SPACING[12]} ${SPACING[4]}`, borderTop: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, textAlign: "center" }}>
        <p>© 2026 PathPilot. Helping students discover their ideal careers.</p>
      </footer>
    </div>
  );
}
