
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter",
          variant: "default",
        });
        setEmail("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to subscribe",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-space/50 border border-light-grey/10 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-neon-green" />
        <h3 className="text-lg font-inter font-semibold text-white">Stay Updated</h3>
      </div>
      <p className="text-sm text-light-grey/70 mb-4">
        Get the latest AI insights and singularity predictions delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-dark-space/80 border-light-grey/20 text-white placeholder:text-light-grey/50"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-neon-green hover:bg-neon-green/80 text-dark-space font-medium"
        >
          {isLoading ? "..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
