import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const createProfile = useCreateProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goals: [""]
  });

  const handleSubmit = () => {
    createProfile.mutate({
      data: {
        name: formData.name,
        email: formData.email,
        goals: formData.goals
      }
    }, {
      onSuccess: () => {
        setLocation("/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Let's get started</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself.</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} 
                placeholder="john@example.com" 
              />
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What is your primary goal?</Label>
              <Input 
                value={formData.goals[0]} 
                onChange={(e) => setFormData(p => ({ ...p, goals: [e.target.value] }))} 
                placeholder="Find a major, explore careers..." 
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={createProfile.isPending}>
                {createProfile.isPending ? "Saving..." : "Complete"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}