import { useEffect } from "react";
import CountdownTimer from "@/components/countdown-timer";
import MetricsGrid from "@/components/metrics-grid";
import ChartsSection from "@/components/charts-section";
import NewsFeed from "@/components/news-feed";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  // Fetch latest news on component mount
  const { mutate: fetchNews } = useMutation({
    mutationFn: () => apiRequest("POST", "/api/news/fetch"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "News Updated",
        description: "Latest AI news has been fetched successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to fetch news:", error);
      toast({
        title: "News Fetch Failed",
        description: "Unable to fetch latest AI news",
        variant: "destructive",
      });
    },
  });

  // Auto-fetch news on component mount and every 30 minutes
  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <div className="min-h-screen bg-dark-space text-light-grey">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-space/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-tech-purple to-bright-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-orbitron font-bold text-sm">Ω</span>
              </div>
              <h1 className="text-xl font-orbitron font-bold text-white">Singularity Predictor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-green rounded-full pulse-ring"></div>
                <span className="text-sm font-jetbrains text-neon-green">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Countdown Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4">
              Technological Singularity
            </h2>
            <p className="text-lg text-light-grey/80 max-w-2xl mx-auto">
              Predicting the convergence point where artificial intelligence exceeds human cognitive capabilities
            </p>
          </div>
          <CountdownTimer />
        </section>

        {/* Metrics Dashboard */}
        <MetricsGrid />

        {/* Historical Data Charts */}
        <ChartsSection />

        {/* AI News Feed */}
        <NewsFeed />
      </main>
    </div>
  );
}
