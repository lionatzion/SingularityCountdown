import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, Server, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";

interface FrontierModel {
  name: string;
  company: string;
  releaseDate: string;
  singularityProximity: number;
  capabilities: string[];
  benchmarkScores: {
    reasoning: number;
    creativity: number;
    coding: number;
    multimodal: number;
  };
  status: "active" | "preview" | "deprecated";
  pricing?: {
    inputPrice?: number;
    outputPrice?: number;
  };
  performance?: {
    speed?: number;
    latency?: number;
    contextLength?: number;
    throughput?: number;
  };
  qualityScore?: number;
}

interface MicroEval {
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  passingModels: string[];
  category: "Reasoning" | "Coding" | "Multimodal" | "Safety";
}

interface MCPServer {
  name: string;
  description: string;
  category: string;
  installCommand: string;
  configExample: string;
  useCase: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export default function AIModels() {
  const [, setLocation] = useLocation();

  // Fetch real frontier models data
  const { data: frontierModels = [], isLoading: modelsLoading, error: modelsError } = useQuery({
    queryKey: ["frontier-models"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/frontier-models");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fallback data in case API fails
  const fallbackModels: FrontierModel[] = [
    {
      name: "GPT-5",
      company: "OpenAI",
      releaseDate: "2025-01-15",
      singularityProximity: 87,
      capabilities: ["Advanced Reasoning", "Multimodal", "Code Generation", "Scientific Research"],
      benchmarkScores: { reasoning: 95, creativity: 89, coding: 93, multimodal: 91 },
      status: "active",
      pricing: { inputPrice: 0.010, outputPrice: 0.030 },
      performance: { speed: 150, latency: 0.8, contextLength: 200000, throughput: 9000 }
    },
    {
      name: "Claude 3.5 Sonnet",
      company: "Anthropic",
      releaseDate: "2024-10-22",
      singularityProximity: 82,
      capabilities: ["Long Context", "Code Analysis", "Creative Writing", "Tool Use"],
      benchmarkScores: { reasoning: 91, creativity: 94, coding: 89, multimodal: 85 },
      status: "active",
      pricing: { inputPrice: 0.003, outputPrice: 0.015 },
      performance: { speed: 120, latency: 1.2, contextLength: 200000, throughput: 7200 }
    },
    {
      name: "Claude 4",
      company: "Anthropic",
      releaseDate: "2025-01-20",
      singularityProximity: 89,
      capabilities: ["Constitutional AI", "Advanced Reasoning", "Long Context", "Multimodal", "Tool Use"],
      benchmarkScores: { reasoning: 96, creativity: 97, coding: 92, multimodal: 89 },
      status: "preview",
      pricing: { inputPrice: 0.008, outputPrice: 0.025 },
      performance: { speed: 140, latency: 0.9, contextLength: 500000, throughput: 8400 }
    },
    {
      name: "Gemini 2.0 Flash",
      company: "Google",
      releaseDate: "2024-12-11",
      singularityProximity: 84,
      capabilities: ["Real-time Processing", "Multimodal", "Agent Actions", "Live API"],
      benchmarkScores: { reasoning: 88, creativity: 86, coding: 91, multimodal: 96 },
      status: "active",
      pricing: { inputPrice: 0.002, outputPrice: 0.008 },
      performance: { speed: 180, latency: 0.6, contextLength: 100000, throughput: 10800 }
    },
    {
      name: "Gemini 2.5 Pro",
      company: "Google",
      releaseDate: "2025-01-25",
      singularityProximity: 91,
      capabilities: ["Ultra Long Context", "Advanced Multimodal", "Scientific Research", "Agent Actions", "Code Generation"],
      benchmarkScores: { reasoning: 97, creativity: 89, coding: 95, multimodal: 98 },
      status: "preview",
      pricing: { inputPrice: 0.012, outputPrice: 0.035 },
      performance: { speed: 160, latency: 1.0, contextLength: 1000000, throughput: 9600 }
    },
    {
      name: "Grok 4",
      company: "xAI",
      releaseDate: "2025-01-18",
      singularityProximity: 85,
      capabilities: ["Real-time Information", "Wit & Humor", "Advanced Reasoning", "Multimodal", "X Integration"],
      benchmarkScores: { reasoning: 90, creativity: 95, coding: 87, multimodal: 86 },
      status: "active",
      pricing: { inputPrice: 0.005, outputPrice: 0.020 },
      performance: { speed: 130, latency: 1.1, contextLength: 150000, throughput: 7800 }
    },
    {
      name: "o3",
      company: "OpenAI",
      releaseDate: "2024-12-20",
      singularityProximity: 92,
      capabilities: ["Advanced Reasoning", "Math Proofs", "PhD-level Science", "Chain of Thought"],
      benchmarkScores: { reasoning: 98, creativity: 85, coding: 94, multimodal: 88 },
      status: "preview",
      pricing: { inputPrice: 0.020, outputPrice: 0.060 },
      performance: { speed: 80, latency: 2.5, contextLength: 300000, throughput: 4800 }
    }
  ];

  const microEvals: MicroEval[] = [
    {
      name: "Recursive Reasoning",
      description: "Tests ability to reason through nested logical problems with multiple layers of inference",
      difficulty: "Expert",
      passingModels: ["o3", "GPT-5"],
      category: "Reasoning"
    },
    {
      name: "Code Vulnerability Detection",
      description: "Identifies security flaws in complex codebases across multiple languages",
      difficulty: "Hard",
      passingModels: ["o3", "GPT-5", "Claude 3.5 Sonnet"],
      category: "Coding"
    },
    {
      name: "Visual-Spatial Reasoning",
      description: "Solves 3D geometry problems from 2D representations",
      difficulty: "Medium",
      passingModels: ["Gemini 2.0 Flash", "GPT-5", "o3"],
      category: "Multimodal"
    },
    {
      name: "Ethical Dilemma Resolution",
      description: "Navigates complex moral scenarios with competing values",
      difficulty: "Hard",
      passingModels: ["Claude 3.5 Sonnet", "GPT-5"],
      category: "Safety"
    },
    {
      name: "Scientific Hypothesis Generation",
      description: "Creates testable hypotheses from experimental data",
      difficulty: "Expert",
      passingModels: ["o3", "GPT-5"],
      category: "Reasoning"
    },
    {
      name: "Multi-language Code Translation",
      description: "Converts complex algorithms between programming languages",
      difficulty: "Medium",
      passingModels: ["GPT-5", "Claude 3.5 Sonnet", "Gemini 2.0 Flash"],
      category: "Coding"
    }
  ];

  const mcpServers: MCPServer[] = [
    {
      name: "GitHub MCP Server",
      description: "Integrates with GitHub repositories for code analysis, PR management, and issue tracking",
      category: "Development",
      installCommand: "npm install @modelcontextprotocol/server-github",
      configExample: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}`,
      useCase: "Code review, repository analysis, automated PR responses",
      difficulty: "Beginner"
    },
    {
      name: "Database MCP Server",
      description: "Connects to SQL databases for queries, schema analysis, and data operations",
      category: "Data",
      installCommand: "npm install @modelcontextprotocol/server-sqlite",
      configExample: `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sqlite", "path/to/database.db"]
    }
  }
}`,
      useCase: "Database queries, schema exploration, data analysis",
      difficulty: "Intermediate"
    },
    {
      name: "Filesystem MCP Server",
      description: "Provides secure file system access with read/write capabilities",
      category: "System",
      installCommand: "npm install @modelcontextprotocol/server-filesystem",
      configExample: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/allowed/path"]
    }
  }
}`,
      useCase: "File operations, content analysis, project management",
      difficulty: "Beginner"
    },
    {
      name: "Web Search MCP Server",
      description: "Enables web search capabilities with real-time information retrieval",
      category: "Search",
      installCommand: "npm install @modelcontextprotocol/server-brave-search",
      configExample: `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your_api_key_here"
      }
    }
  }
}`,
      useCase: "Real-time information, research assistance, fact checking",
      difficulty: "Intermediate"
    },
    {
      name: "Kubernetes MCP Server",
      description: "Manages Kubernetes clusters with deployment and monitoring capabilities",
      category: "DevOps",
      installCommand: "npm install @modelcontextprotocol/server-kubernetes",
      configExample: `{
  "mcpServers": {
    "kubernetes": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-kubernetes"],
      "env": {
        "KUBECONFIG": "/path/to/kubeconfig"
      }
    }
  }
}`,
      useCase: "Cluster management, deployment automation, resource monitoring",
      difficulty: "Advanced"
    },
    {
      name: "Slack MCP Server",
      description: "Integrates with Slack workspaces for messaging and workflow automation",
      category: "Communication",
      installCommand: "npm install @modelcontextprotocol/server-slack",
      configExample: `{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_APP_TOKEN": "xapp-your-token"
      }
    }
  }
}`,
      useCase: "Team communication, automated responses, workflow integration",
      difficulty: "Intermediate"
    }
  ];

  const getSingularityColor = (proximity: number) => {
    if (proximity >= 90) return "text-red-400";
    if (proximity >= 80) return "text-orange-400";
    if (proximity >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": case "Beginner": return "bg-green-500/20 text-green-400";
      case "Medium": case "Intermediate": return "bg-yellow-500/20 text-yellow-400";
      case "Hard": case "Advanced": return "bg-orange-500/20 text-orange-400";
      case "Expert": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-tech-purple to-bright-pink rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-orbitron font-bold text-foreground">AI Frontier Models</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-border text-foreground hover:bg-muted"
                onClick={() => setLocation("/")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="models" className="data-[state=active]:bg-tech-purple data-[state=active]:text-white">
              Frontier Models
            </TabsTrigger>
            <TabsTrigger value="evals" className="data-[state=active]:bg-tech-purple data-[state=active]:text-white">
              Micro Evaluations
            </TabsTrigger>
            <TabsTrigger value="mcp" className="data-[state=active]:bg-tech-purple data-[state=active]:text-white">
              MCP Servers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
                AI Frontier Models Overview
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Tracking the most advanced AI models and their proximity to artificial general intelligence
              </p>
            </div>

            {modelsLoading && (
              <div className="text-center py-8">
                <div className="text-foreground">Loading frontier models...</div>
              </div>
            )}

            {modelsError && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <div className="text-red-400 font-medium">Failed to load real-time data</div>
                <div className="text-red-300 text-sm">Using fallback data instead</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(frontierModels.length > 0 ? frontierModels : fallbackModels).map((model: any, index: number) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-inter font-bold text-foreground">{model.name}</h3>
                      <p className="text-sm text-light-grey/70">{model.company}</p>
                      <p className="text-xs text-light-grey/50">{model.releaseDate}</p>
                    </div>
                    <Badge 
                      className={`${model.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        model.status === 'preview' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-gray-500/20 text-gray-400'}`}
                    >
                      {model.status}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Singularity Proximity</span>
                      <span className={`text-sm font-bold ${getSingularityColor(model.singularityProximity)}`}>
                        {model.singularityProximity}%
                      </span>
                    </div>
                    <Progress 
                      value={model.singularityProximity} 
                      className="h-2 bg-slate-700"
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    {Object.entries(model.benchmarkScores).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground capitalize">{key}</span>
                          <span className="text-bright-pink">{value as number}%</span>
                        </div>
                        <Progress value={value as number} className="h-1 bg-slate-700" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-light-grey/70 mb-2">Key Capabilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {model.capabilities.map((capability: string, i: number) => (
                          <Badge key={i} variant="outline" className="border-tech-purple/50 text-tech-purple">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {model.pricing && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {model.pricing.inputPrice && (
                          <div>
                            <span className="text-light-grey/70">Input:</span>
                            <span className="text-foreground ml-1">${model.pricing.inputPrice.toFixed(3)}/1K</span>
                          </div>
                        )}
                        {model.pricing.outputPrice && (
                          <div>
                            <span className="text-light-grey/70">Output:</span>
                            <span className="text-foreground ml-1">${model.pricing.outputPrice.toFixed(3)}/1K</span>
                          </div>
                        )}
                      </div>
                    )}

                    {model.performance && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {model.performance.speed && (
                          <div>
                            <span className="text-light-grey/70">Speed:</span>
                            <span className="text-bright-pink ml-1">{model.performance.speed.toFixed(0)} tok/s</span>
                          </div>
                        )}
                        {model.performance.latency && (
                          <div>
                            <span className="text-light-grey/70">Latency:</span>
                            <span className="text-bright-pink ml-1">{model.performance.latency.toFixed(2)}s</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evals" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
                Micro Evaluations
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Specialized tests that measure specific AI capabilities and limitations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {microEvals.map((eval_, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-inter font-bold text-foreground">{eval_.name}</h3>
                      <Badge className={getDifficultyColor(eval_.difficulty)}>
                        {eval_.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="border-bright-pink/50 text-bright-pink">
                      {eval_.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-light-grey/80 mb-4">
                    {eval_.description}
                  </p>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Passing Models:</p>
                    <div className="flex flex-wrap gap-2">
                      {eval_.passingModels.map((model, i) => (
                        <Badge key={i} className="bg-green-500/20 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mcp" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron font-bold text-foreground mb-4">
                MCP Server Integration
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Model Context Protocol servers that extend AI capabilities with external integrations
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-inter font-bold text-foreground mb-3">
                <Server className="w-5 h-5 inline mr-2" />
                Getting Started with MCP
              </h3>
              <div className="space-y-3 text-sm text-light-grey/80">
                <p>1. Install the MCP client: <code className="bg-slate-800 px-2 py-1 rounded text-tech-purple">npm install @modelcontextprotocol/sdk</code></p>
                <p>2. Choose and install your desired MCP servers from the list below</p>
                <p>3. Configure your AI client to connect to the MCP servers</p>
                <p>4. Start leveraging extended capabilities in your AI workflows</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mcpServers.map((server, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-inter font-bold text-foreground">{server.name}</h3>
                      <Badge className={getDifficultyColor(server.difficulty)}>
                        {server.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="border-tech-purple/50 text-tech-purple">
                      {server.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-light-grey/80 mb-4">
                    {server.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Install Command:</p>
                      <code className="text-xs bg-slate-800 p-2 rounded block text-tech-purple">
                        {server.installCommand}
                      </code>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Configuration:</p>
                      <pre className="text-xs bg-slate-800 p-2 rounded text-light-grey/80 overflow-x-auto">
                        {server.configExample}
                      </pre>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Use Case:</p>
                      <p className="text-sm text-light-grey/70">{server.useCase}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-slate-900/30 border border-yellow-500/50 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400 mb-2">Security Considerations</h4>
                  <ul className="text-sm text-light-grey/80 space-y-1">
                    <li>• Always review MCP server permissions before installation</li>
                    <li>• Use environment variables for sensitive configuration data</li>
                    <li>• Regularly update MCP servers to latest versions</li>
                    <li>• Monitor server logs for unusual activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}