import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Share2, Download, Twitter, Linkedin, Copy, Check, Sparkles } from "lucide-react";
import { type Prediction } from "@shared/schema";

export default function ShareableCard() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: prediction } = useQuery<Prediction>({
    queryKey: ["/api/predictions/latest"],
    staleTime: 10 * 60 * 1000,
  });

  const predictionDate = prediction?.predictedDate 
    ? new Date(prediction.predictedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'June 15, 2031';

  const confidence = prediction?.confidenceScore || 75;

  const shareText = `The AI predicts the technological singularity will occur on ${predictionDate} with ${confidence}% confidence. Track the countdown at`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://singularity-tracker.replit.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0F0F23',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'singularity-prediction.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "Prediction card saved as image",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not generate image. Try taking a screenshot instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-bright-pink" />
            <div>
              <CardTitle className="text-xl font-orbitron text-foreground">
                Share Your Prediction
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Download or share the prediction on social media
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              ref={cardRef}
              className="p-8 rounded-2xl bg-gradient-to-br from-[#0F0F23] via-[#1a1a3e] to-[#0F0F23] border border-tech-purple/50 shadow-2xl shadow-tech-purple/20"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-tech-purple to-bright-pink rounded-xl flex items-center justify-center">
                  <span className="text-white font-orbitron font-bold">Ω</span>
                </div>
                <span className="text-lg font-orbitron text-white">Singularity Tracker</span>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">AI Prediction</p>
                <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-1">
                  {predictionDate}
                </h2>
                <p className="text-gray-400">Technological Singularity</p>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-green to-tech-purple rounded-full transition-all duration-500"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50 font-jetbrains">
                  {confidence}% confidence
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-bright-pink" />
                <span>Generated by AI • {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Share on Social</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleTwitterShare}
                    className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                    data-testid="twitter-share-button"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter / X
                  </Button>
                  <Button
                    onClick={handleLinkedInShare}
                    className="bg-[#0A66C2] hover:bg-[#094d92] text-white"
                    data-testid="linkedin-share-button"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-tech-purple/50 text-tech-purple hover:bg-tech-purple/20"
                    data-testid="copy-link-button"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Download Card</h3>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-bright-pink/50 text-bright-pink hover:bg-bright-pink/20"
                  data-testid="download-card-button"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as Image
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Save the prediction card as a PNG image
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Share this prediction with friends and colleagues. The card shows the AI's current 
                  prediction for when technological singularity might occur, based on analysis of 
                  current trends and data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
