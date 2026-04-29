import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Brain, Cpu, Globe, Award, Rocket } from "lucide-react";

interface Milestone {
  year: number;
  month: string;
  title: string;
  description: string;
  category: "breakthrough" | "model" | "hardware" | "adoption" | "research";
  impact: "high" | "medium" | "critical";
}

const milestones: Milestone[] = [
  {
    year: 2012,
    month: "Sep",
    title: "AlexNet Wins ImageNet",
    description: "Deep learning neural network achieves breakthrough performance in image recognition, sparking the AI revolution.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2014,
    month: "Jun",
    title: "GANs Introduced",
    description: "Ian Goodfellow introduces Generative Adversarial Networks, enabling AI to generate realistic images.",
    category: "research",
    impact: "high"
  },
  {
    year: 2016,
    month: "Mar",
    title: "AlphaGo Defeats Lee Sedol",
    description: "DeepMind's AlphaGo beats world champion in Go, a game thought too complex for AI to master.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2017,
    month: "Jun",
    title: "Transformer Architecture",
    description: "Google introduces 'Attention Is All You Need' paper, revolutionizing natural language processing.",
    category: "research",
    impact: "critical"
  },
  {
    year: 2018,
    month: "Oct",
    title: "BERT Released",
    description: "Google releases BERT, achieving state-of-the-art results on 11 NLP tasks.",
    category: "model",
    impact: "high"
  },
  {
    year: 2020,
    month: "May",
    title: "GPT-3 Announced",
    description: "OpenAI reveals GPT-3 with 175 billion parameters, showing emergent capabilities.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2021,
    month: "Jan",
    title: "DALL-E Introduced",
    description: "OpenAI demonstrates AI that creates images from text descriptions.",
    category: "model",
    impact: "high"
  },
  {
    year: 2022,
    month: "Apr",
    title: "DALL-E 2 & Midjourney",
    description: "AI image generation reaches photorealistic quality, democratizing creative AI.",
    category: "model",
    impact: "high"
  },
  {
    year: 2022,
    month: "Nov",
    title: "ChatGPT Launches",
    description: "ChatGPT reaches 100M users in 2 months, fastest-growing consumer app in history.",
    category: "adoption",
    impact: "critical"
  },
  {
    year: 2023,
    month: "Mar",
    title: "GPT-4 Released",
    description: "Multimodal model passes bar exam, demonstrates advanced reasoning capabilities.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2023,
    month: "Jul",
    title: "Claude 2 & Llama 2",
    description: "Anthropic and Meta release powerful open and closed-source alternatives.",
    category: "model",
    impact: "high"
  },
  {
    year: 2023,
    month: "Nov",
    title: "H100 GPU Dominance",
    description: "NVIDIA H100 becomes the most sought-after chip, powering AI training globally.",
    category: "hardware",
    impact: "high"
  },
  {
    year: 2024,
    month: "Feb",
    title: "Sora Video Generation",
    description: "OpenAI demonstrates photorealistic video generation from text prompts.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2024,
    month: "May",
    title: "GPT-4o Released",
    description: "Omni model with native audio/visual capabilities, real-time conversation.",
    category: "model",
    impact: "high"
  },
  {
    year: 2024,
    month: "Dec",
    title: "o1 Reasoning Model",
    description: "OpenAI releases o1 with chain-of-thought reasoning, achieving PhD-level performance.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Jan",
    title: "DeepSeek R1 Shocks the World",
    description: "Chinese lab DeepSeek releases open-source R1 reasoning model matching o1 at a fraction of the cost, triggering a global AI race reset.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Feb",
    title: "Grok 3 Released",
    description: "xAI launches Grok 3, trained on 100,000 H100 GPUs, surpassing GPT-4o on major benchmarks.",
    category: "model",
    impact: "high"
  },
  {
    year: 2025,
    month: "Mar",
    title: "Claude 3.7 Sonnet",
    description: "Anthropic's Claude 3.7 introduces hybrid reasoning mode, switching between fast response and deep extended thinking.",
    category: "model",
    impact: "high"
  },
  {
    year: 2025,
    month: "Apr",
    title: "Llama 4 Goes Multimodal",
    description: "Meta releases Llama 4 Scout and Maverick with native vision and a 10M-token context window, open-weights.",
    category: "model",
    impact: "high"
  },
  {
    year: 2025,
    month: "May",
    title: "Gemini 2.5 Pro",
    description: "Google's Gemini 2.5 Pro tops every major benchmark and introduces Deep Think reasoning mode.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Jun",
    title: "Claude Opus 4",
    description: "Anthropic releases Claude Opus 4, its first model to pass all frontier safety evaluations while setting new coding and reasoning records.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Jul",
    title: "GPT-5 Launches",
    description: "OpenAI releases GPT-5, unifying o-series reasoning with general intelligence in a single model with near-human graduate-level performance.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Sep",
    title: "AI Agents Go Mainstream",
    description: "Autonomous AI agents begin handling multi-day coding, legal research, and scientific literature tasks with minimal human oversight.",
    category: "adoption",
    impact: "critical"
  },
  {
    year: 2025,
    month: "Nov",
    title: "NVIDIA Blackwell B200 Era",
    description: "Blackwell GPU clusters reach exaflop-scale training runs, compressing model training timelines from months to weeks.",
    category: "hardware",
    impact: "high"
  },
  {
    year: 2025,
    month: "Dec",
    title: "ChatGPT 5.5 Released",
    description: "OpenAI's ChatGPT 5.5 introduces persistent memory, real-time web synthesis, and multimodal reasoning in a single unified interface.",
    category: "model",
    impact: "critical"
  },
  {
    year: 2026,
    month: "Feb",
    title: "Claude Opus 4.7",
    description: "Anthropic's Opus 4.7 demonstrates sustained autonomous research capability, completing novel scientific hypotheses independently validated by peer review.",
    category: "breakthrough",
    impact: "critical"
  },
  {
    year: 2026,
    month: "Apr",
    title: "AGI Threshold Debated",
    description: "Leading AI labs and researchers publicly debate whether current frontier models meet operational AGI criteria across economic tasks.",
    category: "research",
    impact: "critical"
  }
];

const categoryIcons = {
  breakthrough: <Zap className="w-4 h-4" />,
  model: <Brain className="w-4 h-4" />,
  hardware: <Cpu className="w-4 h-4" />,
  adoption: <Globe className="w-4 h-4" />,
  research: <Award className="w-4 h-4" />
};

const categoryColors = {
  breakthrough: "bg-bright-pink/20 text-bright-pink border-bright-pink/50",
  model: "bg-tech-purple/20 text-tech-purple border-tech-purple/50",
  hardware: "bg-neon-green/20 text-neon-green border-neon-green/50",
  adoption: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  research: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
};

const impactColors = {
  critical: "bg-red-500/20 text-red-400 border-red-500/50",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  medium: "bg-gray-500/20 text-gray-400 border-gray-500/50"
};

export default function HistoricalTimeline() {
  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-tech-purple" />
            <div>
              <CardTitle className="text-xl font-orbitron text-foreground">
                AI Milestones Timeline
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Key moments in the journey toward artificial general intelligence
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-tech-purple via-bright-pink to-neon-green opacity-50"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <div className={`p-4 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    } ml-8 md:ml-0`}>
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <Badge variant="outline" className={categoryColors[milestone.category]}>
                          {categoryIcons[milestone.category]}
                          <span className="ml-1 capitalize">{milestone.category}</span>
                        </Badge>
                        <Badge variant="outline" className={impactColors[milestone.impact]}>
                          {milestone.impact}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-tech-purple to-bright-pink flex items-center justify-center shadow-lg shadow-tech-purple/30">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded bg-background border border-border text-xs font-jetbrains text-foreground whitespace-nowrap">
                      {milestone.month} {milestone.year}
                    </div>
                  </div>
                  
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
