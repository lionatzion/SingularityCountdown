import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Zap, Infinity, Sparkles, TrendingUp } from "lucide-react";

interface ConceptCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

function ConceptCard({ title, description, isActive, onClick }: ConceptCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`p-4 rounded-lg text-left transition-all duration-300 ${
        isActive
          ? 'bg-tech-purple/30 border-2 border-tech-purple text-white'
          : 'bg-slate-800/30 border border-slate-600/50 text-light-grey hover:bg-slate-700/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs opacity-70">{description}</div>
    </motion.button>
  );
}

function ExponentialGrowthAnimation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [0, 800, 1600, 2400, 3200, 4000];
    intervals.forEach((delay, index) => {
      setTimeout(() => setStage(index), delay);
    });
  }, []);

  return (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-tech-purple/20 to-bright-pink/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      <div className="flex items-end justify-between h-full pt-8">
        {[15, 25, 40, 70, 120, 200, 320, 500].map((height, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-t from-tech-purple to-bright-pink rounded-t"
            style={{ width: '10%' }}
            initial={{ height: 0 }}
            animate={{ 
              height: stage > index ? `${Math.min(height, 180)}px` : 0
            }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.3,
              ease: "easeOutCubic"
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="absolute bottom-2 left-2 text-xs text-light-grey"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage > 1 ? 1 : 0 }}
      >
        Current AI Progress
      </motion.div>
      
      <motion.div
        className="absolute top-2 right-2 text-xs text-neon-green font-jetbrains"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: stage > 4 ? 1 : 0,
          scale: stage > 4 ? 1 : 0
        }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        Exponential Takeoff
      </motion.div>
    </div>
  );
}

function AIEvolutionAnimation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [0, 1000, 2000, 3000, 4000];
    intervals.forEach((delay, index) => {
      setTimeout(() => setStage(index), delay);
    });
  }, []);

  const evolutionStages = [
    { icon: Cpu, label: "Narrow AI", color: "#667EEA", year: "2020" },
    { icon: Brain, label: "General AI", color: "#10B981", year: "2028" },
    { icon: Zap, label: "Super AI", color: "#F093FB", year: "2032" },
    { icon: Infinity, label: "Superintelligence", color: "#FF6B6B", year: "2035+" }
  ];

  return (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6">
      <div className="flex justify-between items-center h-full">
        {evolutionStages.map((evolution, index) => {
          const IconComponent = evolution.icon;
          return (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: stage >= index ? 1 : 0.3,
                y: stage >= index ? 0 : 20,
                scale: stage === index ? 1.2 : 1
              }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${evolution.color}20`, 
                  border: `2px solid ${evolution.color}` 
                }}
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  boxShadow: stage >= index ? `0 0 20px ${evolution.color}40` : "none"
                }}
              >
                <IconComponent 
                  size={24} 
                  style={{ color: evolution.color }}
                />
              </motion.div>
              <div className="text-xs text-center">
                <div className="text-white font-semibold">{evolution.label}</div>
                <div className="text-light-grey/60">{evolution.year}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-tech-purple via-neon-green to-bright-pink"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{ transformOrigin: "left" }}
      />
      
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-tech-purple font-jetbrains"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
      >
        Intelligence Evolution Timeline
      </motion.div>
    </div>
  );
}

function SingularityMomentAnimation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [0, 1500, 3000, 4500];
    intervals.forEach((delay, index) => {
      setTimeout(() => setStage(index), delay);
    });
  }, []);

  return (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage >= 2 ? 0.3 : 1 }}
      >
        <div className="text-center">
          <Brain size={32} className="text-tech-purple mx-auto mb-2" />
          <div className="text-sm text-white">Human Intelligence</div>
          <div className="text-xs text-light-grey/60">Baseline Level</div>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-neon-green to-bright-pink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ transformOrigin: "top" }}
      />
      
      <motion.div
        className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: stage >= 2 ? 1 : 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
        >
          <motion.div
            animate={{ rotate: stage >= 3 ? 360 : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={32} className="text-bright-pink mx-auto mb-2" />
          </motion.div>
          <div className="text-sm text-white">Superintelligence</div>
          <div className="text-xs text-bright-pink">Exponential Growth</div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-neon-green font-jetbrains"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
      >
        The Singularity Moment
      </motion.div>
    </div>
  );
}

function IntelligenceExplosionAnimation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervals = [0, 600, 1200, 1800, 2400];
    intervals.forEach((delay, index) => {
      setTimeout(() => setStage(index), delay);
    });
  }, []);

  const levels = [
    { label: "Human Baseline", multiplier: "1x", color: "#667EEA" },
    { label: "Early Superintelligence", multiplier: "10x", color: "#10B981" },
    { label: "Advanced AI", multiplier: "100x", color: "#F093FB" },
    { label: "Transcendent Intelligence", multiplier: "1000x+", color: "#FF6B6B" }
  ];

  return (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      <div className="space-y-3 h-full">
        {levels.map((level, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 rounded"
            style={{ backgroundColor: `${level.color}10` }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: stage >= index ? 0 : -100,
              opacity: stage >= index ? 1 : 0
            }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: level.color }}
                animate={{ 
                  scale: stage >= index ? [1, 1.5, 1] : 1,
                  opacity: stage >= index ? [1, 0.7, 1] : 0.3
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.3 
                }}
              />
              <span className="text-sm text-white">{level.label}</span>
            </div>
            <motion.span
              className="text-sm font-jetbrains font-bold"
              style={{ color: level.color }}
              animate={{ 
                scale: stage >= index ? 1 : 0.8,
                opacity: stage >= index ? 1 : 0.5
              }}
            >
              {level.multiplier}
            </motion.span>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="absolute right-4 top-4 bottom-4 w-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-t from-tech-purple via-neon-green to-bright-pink rounded"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeOutExpo" }}
          style={{ transformOrigin: "bottom" }}
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-bright-pink font-jetbrains"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 4 ? 1 : 0 }}
      >
        Intelligence Explosion
      </motion.div>
    </div>
  );
}

export function ConceptShowcase() {
  const [selectedConcept, setSelectedConcept] = useState<string>('exponential-growth');

  const concepts = [
    {
      key: 'exponential-growth',
      title: 'Exponential Growth',
      description: 'Understanding how AI capabilities accelerate over time',
      component: <ExponentialGrowthAnimation key="exponential" />
    },
    {
      key: 'ai-evolution',
      title: 'AI Evolution',
      description: 'The progression from narrow AI to superintelligence',
      component: <AIEvolutionAnimation key="evolution" />
    },
    {
      key: 'singularity-moment',
      title: 'Singularity Moment',
      description: 'The critical transition point in AI development',
      component: <SingularityMomentAnimation key="singularity" />
    },
    {
      key: 'intelligence-explosion',
      title: 'Intelligence Explosion',
      description: 'Post-singularity exponential capability growth',
      component: <IntelligenceExplosionAnimation key="explosion" />
    }
  ];

  const selectedConceptData = concepts.find(c => c.key === selectedConcept);

  return (
    <section className="mb-12">
      <div className="bg-slate-900/50 border border-tech-purple/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
            Animated Tech Concepts
          </h3>
          <p className="text-sm text-light-grey mb-6">
            Interactive animations explaining complex technological singularity concepts
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {concepts.map((concept) => (
              <ConceptCard
                key={concept.key}
                title={concept.title}
                description={concept.description}
                isActive={selectedConcept === concept.key}
                onClick={() => setSelectedConcept(concept.key)}
              />
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedConcept}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {selectedConceptData?.component}
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          className="mt-6 p-4 bg-slate-800/30 rounded-lg"
          key={selectedConcept}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-sm text-light-grey leading-relaxed">
            {selectedConcept === 'exponential-growth' && (
              "Exponential growth in AI development means that progress doesn't happen linearly. Instead, each advancement builds upon the previous ones, creating an accelerating curve that can lead to dramatic improvements in a short time period."
            )}
            {selectedConcept === 'ai-evolution' && (
              "AI evolution represents the progression from today's narrow AI systems to artificial general intelligence (AGI) and eventually to artificial superintelligence (ASI), each stage representing orders of magnitude improvement in capability."
            )}
            {selectedConcept === 'singularity-moment' && (
              "The technological singularity represents the theoretical point where AI systems become capable of recursive self-improvement, leading to rapid and unpredictable changes in technology and society."
            )}
            {selectedConcept === 'intelligence-explosion' && (
              "An intelligence explosion occurs when AI systems become capable of improving themselves, leading to rapid recursive enhancement that could result in superintelligence far exceeding human cognitive abilities across all domains."
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}