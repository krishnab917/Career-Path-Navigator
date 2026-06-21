import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 mr-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">
                P
              </div>
              <span className="font-bold text-xl tracking-tight">PathPilot</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                Dashboard
              </Link>
              <Link href="/simulations" className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/simulations') ? 'text-primary' : 'text-muted-foreground'}`}>
                Simulations
              </Link>
              <Link href="/opportunities" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/opportunities' ? 'text-primary' : 'text-muted-foreground'}`}>
                Opportunities
              </Link>
              <Link href="/roadmap" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/roadmap' ? 'text-primary' : 'text-muted-foreground'}`}>
                Roadmap
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">US</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}