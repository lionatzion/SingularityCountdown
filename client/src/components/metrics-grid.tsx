import { useQuery } from "@tanstack/react-query";
import { useMetrics } from "@/lib/hooks";

export default function MetricsGrid() {
  const { data: metrics, isLoading } = useMetrics();

  const defaultMetrics = {
    gpuPerformance: 94587,
    neuralCapacity: 847,
    processingSpeed: 21,
    aiBenchmarks: 9458,
  };

  const currentMetrics = metrics || defaultMetrics;

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glow-border rounded-xl p-6 gradient-bg animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Computing Power Card */}
      <div className="bg-slate-900/50 border border-neon-green/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-inter font-semibold text-foreground">Computing Power</h3>
          <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
        </div>
        <div className="mb-4">
          <div className="text-3xl font-jetbrains font-bold text-neon-green">1.2 × 10²¹</div>
          <div className="text-sm text-light-grey">FLOPS (Current Peak)</div>
        </div>
        <div className="text-sm text-light-grey">
          <span className="text-neon-green">+147%</span> increase from last year
        </div>
      </div>

      {/* GPU Performance Card */}
      <div className="bg-slate-900/50 border border-tech-purple/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-inter font-semibold text-foreground">GPU Performance</h3>
          <div className="w-3 h-3 bg-tech-purple rounded-full animate-pulse"></div>
        </div>
        <div className="mb-4">
          <div className="text-3xl font-jetbrains font-bold text-foreground">
            {currentMetrics.gpuPerformance.toLocaleString()}
          </div>
          <div className="text-sm text-light-grey">Benchmark Score</div>
        </div>
        {/* Progress Ring */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path 
              className="text-gray-600" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path 
              className="text-tech-purple" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="73, 100" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-jetbrains font-bold text-tech-purple">73%</span>
          </div>
        </div>
        <div className="text-sm text-light-grey text-center">
          Progress to Singularity Threshold
        </div>
      </div>

      {/* AI Intelligence Card */}
      <div className="bg-slate-900/50 border border-bright-pink/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-inter font-semibold text-foreground">AI vs Human Intelligence</h3>
          <div className="w-3 h-3 bg-bright-pink rounded-full animate-pulse"></div>
        </div>
        <div className="mb-4">
          <div className="text-3xl font-jetbrains font-bold text-foreground">0.847</div>
          <div className="text-sm text-light-grey">AI/Human Ratio</div>
        </div>
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1 text-foreground">
              <span>Reasoning</span>
              <span className="text-bright-pink">92%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-bright-pink h-2 rounded-full w-[92%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-foreground">
              <span>Creativity</span>
              <span className="text-bright-pink">67%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-bright-pink h-2 rounded-full w-[67%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-foreground">
              <span>Learning</span>
              <span className="text-bright-pink">89%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-bright-pink h-2 rounded-full w-[89%]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
