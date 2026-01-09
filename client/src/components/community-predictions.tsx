import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ThumbsUp, Calendar, Trophy, Plus, Loader2 } from "lucide-react";
import { type CommunityPrediction } from "@shared/schema";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const confidenceColors = {
  low: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  high: "bg-neon-green/20 text-neon-green border-neon-green/50",
  very_high: "bg-tech-purple/20 text-tech-purple border-tech-purple/50"
};

const confidenceLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  very_high: "Very High"
};

export default function CommunityPredictions() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    predictedYear: 2031,
    predictedMonth: 6,
    reasoning: "",
    confidenceLevel: "medium" as "low" | "medium" | "high" | "very_high"
  });

  const { data: predictions = [], isLoading } = useQuery<CommunityPrediction[]>({
    queryKey: ["/api/community-predictions"],
    staleTime: 2 * 60 * 1000,
  });

  const { data: stats } = useQuery<{ averageYear: number; averageMonth: number; totalPredictions: number }>({
    queryKey: ["/api/community-predictions/stats"],
    staleTime: 2 * 60 * 1000,
  });

  const { mutate: submitPrediction, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/community-predictions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-predictions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-predictions/stats"] });
      toast({
        title: "Prediction Submitted!",
        description: "Your prediction has been added to the community board.",
      });
      setShowForm(false);
      setFormData({
        displayName: "",
        predictedYear: 2031,
        predictedMonth: 6,
        reasoning: "",
        confidenceLevel: "medium"
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Could not submit your prediction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { mutate: upvote } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/community-predictions/${id}/upvote`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-predictions"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.displayName.length < 2 || formData.reasoning.length < 10) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitPrediction(formData);
  };

  return (
    <section className="mb-12">
      <Card className="glow-border gradient-bg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-tech-purple" />
              <div>
                <CardTitle className="text-xl font-orbitron text-white dark:text-white">
                  Community Predictions
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  See what the community thinks about when the singularity will occur
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-bright-pink hover:bg-bright-pink/80 text-dark-space"
              data-testid="add-prediction-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Prediction
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl bg-card/50 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Submit Your Prediction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your name or alias"
                    className="mt-1"
                    data-testid="input-display-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.predictedYear.toString()}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, predictedYear: parseInt(val) }))}
                    >
                      <SelectTrigger className="mt-1" data-testid="select-year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 76 }, (_, i) => 2025 + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Select
                      value={formData.predictedMonth.toString()}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, predictedMonth: parseInt(val) }))}
                    >
                      <SelectTrigger className="mt-1" data-testid="select-month">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((month, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="reasoning">Your Reasoning</Label>
                <Textarea
                  id="reasoning"
                  value={formData.reasoning}
                  onChange={(e) => setFormData(prev => ({ ...prev, reasoning: e.target.value }))}
                  placeholder="Why do you think the singularity will occur at this time?"
                  className="mt-1 min-h-[100px]"
                  data-testid="input-reasoning"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Confidence Level</Label>
                  <div className="flex gap-2 mt-2">
                    {(["low", "medium", "high", "very_high"] as const).map(level => (
                      <Button
                        key={level}
                        type="button"
                        size="sm"
                        variant={formData.confidenceLevel === level ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, confidenceLevel: level }))}
                        className={formData.confidenceLevel === level ? "bg-tech-purple" : ""}
                      >
                        {confidenceLabels[level]}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-neon-green hover:bg-neon-green/80 text-dark-space" data-testid="submit-prediction-button">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Submit Prediction
                  </Button>
                </div>
              </div>
            </form>
          )}

          {stats && stats.totalPredictions > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-tech-purple/20 to-bright-pink/20 border border-tech-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-tech-purple" />
                  <span className="text-sm text-muted-foreground">Community Average</span>
                </div>
                <div className="text-2xl font-bold font-jetbrains text-foreground">
                  {monthNames[stats.averageMonth - 1]} {stats.averageYear}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-neon-green/20 to-tech-purple/20 border border-neon-green/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-neon-green" />
                  <span className="text-sm text-muted-foreground">Total Predictions</span>
                </div>
                <div className="text-2xl font-bold font-jetbrains text-foreground">
                  {stats.totalPredictions}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-bright-pink/20 to-deep-purple/20 border border-bright-pink/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-bright-pink" />
                  <span className="text-sm text-muted-foreground">Top Voted</span>
                </div>
                <div className="text-2xl font-bold font-jetbrains text-foreground">
                  {predictions[0] ? `${monthNames[(predictions[0].predictedMonth || 6) - 1]} ${predictions[0].predictedYear}` : '-'}
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-tech-purple mb-4" />
              <p className="text-muted-foreground">Loading predictions...</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Predictions Yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your prediction!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {predictions.map((prediction, index) => (
                <div
                  key={prediction.id}
                  className="p-4 rounded-lg bg-card/50 border border-border hover:border-tech-purple/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {index === 0 && predictions.length > 1 && (
                          <Trophy className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className="font-semibold text-foreground">{prediction.displayName}</span>
                        <Badge variant="outline" className={confidenceColors[prediction.confidenceLevel as keyof typeof confidenceColors] || confidenceColors.medium}>
                          {confidenceLabels[prediction.confidenceLevel as keyof typeof confidenceLabels] || 'Medium'}
                        </Badge>
                      </div>
                      <div className="text-lg font-jetbrains text-tech-purple mb-2">
                        {monthNames[(prediction.predictedMonth || 6) - 1]} {prediction.predictedYear}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{prediction.reasoning}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {new Date(prediction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => upvote(prediction.id)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-neon-green"
                      data-testid={`upvote-button-${prediction.id}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-jetbrains">{prediction.upvotes}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
