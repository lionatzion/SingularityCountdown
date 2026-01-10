import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Code, Copy, Check, ExternalLink } from "lucide-react";
import { type Prediction } from "@shared/schema";

export default function EmbedWidget() {
  const { toast } = useToast();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const { data: prediction } = useQuery<Prediction>({
    queryKey: ["/api/predictions/latest"],
    staleTime: 10 * 60 * 1000,
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://singularity-tracker.replit.app';

  const iframeCode = `<iframe 
  src="${baseUrl}/embed/countdown" 
  width="400" 
  height="200" 
  frameborder="0" 
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);">
</iframe>`;

  const scriptCode = `<div id="singularity-countdown"></div>
<script src="${baseUrl}/embed.js"></script>
<script>
  SingularityTracker.init({
    container: '#singularity-countdown',
    theme: 'dark',
    showConfidence: true
  });
</script>`;

  const badgeCode = `<a href="${baseUrl}" target="_blank" rel="noopener noreferrer">
  <img 
    src="${baseUrl}/api/badge" 
    alt="Singularity Countdown" 
    style="border-radius: 8px;"
  />
</a>`;

  const handleCopy = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedType(type);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Code className="w-6 h-6 text-tech-purple" />
            <div>
              <CardTitle className="text-xl font-orbitron text-foreground">
                Embed Widget
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Add the singularity countdown to your website
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="script">JavaScript</TabsTrigger>
              <TabsTrigger value="badge">Badge</TabsTrigger>
            </TabsList>
            
            <TabsContent value="iframe" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#0F0F23] to-[#1a1a3e] border border-tech-purple/30">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Time Until Singularity</p>
                      <div className="flex justify-center gap-3 mb-2">
                        <div className="text-center">
                          <span className="text-2xl font-bold font-jetbrains text-white">2,340</span>
                          <p className="text-xs text-gray-500">Days</p>
                        </div>
                        <span className="text-2xl font-bold text-tech-purple">:</span>
                        <div className="text-center">
                          <span className="text-2xl font-bold font-jetbrains text-white">14</span>
                          <p className="text-xs text-gray-500">Hours</p>
                        </div>
                        <span className="text-2xl font-bold text-tech-purple">:</span>
                        <div className="text-center">
                          <span className="text-2xl font-bold font-jetbrains text-white">23</span>
                          <p className="text-xs text-gray-500">Min</p>
                        </div>
                      </div>
                      <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50 text-xs">
                        {prediction?.confidenceScore || 75}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">Embed Code</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(iframeCode, 'iframe')}
                      className="border-tech-purple/50 text-tech-purple hover:bg-tech-purple/20"
                      data-testid="copy-iframe-button"
                    >
                      {copiedType === 'iframe' ? (
                        <><Check className="w-3 h-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 overflow-x-auto">
                    <code className="text-xs font-jetbrains text-gray-300 whitespace-pre">
                      {iframeCode}
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="script" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                      Real-time countdown updates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                      Customizable themes (dark/light)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                      Optional confidence display
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                      Responsive design
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">JavaScript Code</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(scriptCode, 'script')}
                      className="border-tech-purple/50 text-tech-purple hover:bg-tech-purple/20"
                      data-testid="copy-script-button"
                    >
                      {copiedType === 'script' ? (
                        <><Check className="w-3 h-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 overflow-x-auto">
                    <code className="text-xs font-jetbrains text-gray-300 whitespace-pre">
                      {scriptCode}
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="badge" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Badge Preview</h3>
                  <div className="inline-block p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-tech-purple to-bright-pink">
                      <span className="text-white font-orbitron font-bold">Ω</span>
                      <div className="text-left">
                        <p className="text-xs text-white/80">Singularity in</p>
                        <p className="text-sm font-bold text-white">2,340 days</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    A simple badge that links to the full tracker
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">Badge Code</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(badgeCode, 'badge')}
                      className="border-tech-purple/50 text-tech-purple hover:bg-tech-purple/20"
                      data-testid="copy-badge-button"
                    >
                      {copiedType === 'badge' ? (
                        <><Check className="w-3 h-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 overflow-x-auto">
                    <code className="text-xs font-jetbrains text-gray-300 whitespace-pre">
                      {badgeCode}
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 rounded-lg bg-card/50 border border-border">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-tech-purple mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Need help?</p>
                <p className="text-sm text-muted-foreground">
                  Copy any of the embed codes above and paste them into your website's HTML. 
                  The widget will automatically display the latest singularity countdown.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
