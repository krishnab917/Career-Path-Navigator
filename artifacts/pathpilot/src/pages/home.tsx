import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Users, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">P</div>
          <span className="font-bold text-xl tracking-tight">PathPilot</span>
        </div>
        <Link href="/onboarding" className="text-sm font-medium hover:text-primary transition-colors">
          <Button size="sm">Get Started</Button>
        </Link>
      </nav>

      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Experience your future <br/><span className="text-primary">before you choose it</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop guessing. Start experiencing. Play through realistic career scenarios, build skills, and discover what you're truly meant to do.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 w-full px-8 text-base">
                Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/simulations" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base bg-transparent">
                Browse Simulations
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Students Guided</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center">
              <Activity className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">12</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Career Paths</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">98%</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Would Recommend</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}