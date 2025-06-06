import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Zap, TrendingUp, Infinity, Sparkles, LucideIcon } from "lucide-react";

interface AnimatedConceptProps {
  concept: 'exponential-growth' | 'ai-evolution' | 'singularity-moment' | 'intelligence-explosion';
  isVisible: boolean;
}

export function AnimatedConcept({ concept, isVisible }: AnimatedConceptProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isVisible && !isPlaying) {
      setIsPlaying(true);
      setStage(0);
      
      const stageTimings = concept === 'exponential-growth' ? [0, 1000, 2000, 3500, 5000] :
                          concept === 'ai-evolution' ? [0, 800, 1600, 2800, 4000] :
                          concept === 'singularity-moment' ? [0, 1200, 2400, 3600] :
                          [0, 600, 1200, 2000, 3000, 4500];

      stageTimings.forEach((timing, index) => {
        setTimeout(() => {
          setStage(index);
        }, timing);
      });

      setTimeout(() => {
        setIsPlaying(false);
      }, stageTimings[stageTimings.length - 1] + 1000);
    }
  }, [isVisible, concept, isPlaying]);

  const renderExponentialGrowth = () => (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      <motion.div className="absolute inset-0 bg-gradient-to-r from-tech-purple/20 to-bright-pink/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 0 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Growth bars representing exponential increase */}
      <div className="flex items-end justify-between h-full pt-8">
        {[10, 15, 25, 45, 80, 150, 280, 500].map((height, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-t from-tech-purple to-bright-pink rounded-t"
            style={{ width: '10%' }}
            initial={{ height: 0 }}
            animate={{ 
              height: stage >= index ? `${Math.min(height, 220)}px` : 0,
              backgroundColor: stage >= 6 ? '#F093FB' : '#667EEA'
            }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.2,
              ease: "easeOutCubic"
            }}
          />
        ))}
      </div>
      
      {/* Exponential curve overlay */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: stage >= 4 ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <motion.path
          d="M 20 240 Q 100 220 200 180 Q 300 100 400 20"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />
      </motion.svg>
      
      {/* Labels */}
      <motion.div
        className="absolute bottom-2 left-2 text-xs text-light-grey"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
      >
        Current Progress
      </motion.div>
      
      <motion.div
        className="absolute top-2 right-2 text-xs text-neon-green font-jetbrains"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: stage >= 5 ? 1 : 0,
          scale: stage >= 5 ? 1 : 0
        }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        Exponential Takeoff
      </motion.div>
    </div>
  );

  const renderAIEvolution = () => (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6">
      {/* Evolution stages */}
      <div className="flex justify-between items-center h-full">
        {[
          { icon: Cpu, label: "Narrow AI", color: "#667EEA", year: "2020" },
          { icon: Brain, label: "General AI", color: "#10B981", year: "2028" },
          { icon: Zap, label: "Super AI", color: "#F093FB", year: "2032" },
          { icon: Infinity, label: "Superintelligence", color: "#FF6B6B", year: "2035+" }
        ].map((evolution, index) => (
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
              style={{ backgroundColor: `${evolution.color}20`, border: `2px solid ${evolution.color}` }}
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: stage >= index ? `0 0 20px ${evolution.color}40` : "none"
              }}
            >
              {React.createElement(evolution.icon, { 
                size: 24, 
                style: { color: evolution.color }
              })}
            </motion.div>
            <div className="text-xs text-center">
              <div className="text-white font-semibold">{evolution.label}</div>
              <div className="text-light-grey/60">{evolution.year}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Connection lines */}
      <motion.div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-tech-purple via-neon-green to-bright-pink"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{ transformOrigin: "left" }}
      />
      
      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-tech-purple font-jetbrains"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
      >
        Intelligence Evolution Timeline
      </motion.div>
    </div>
  );

  const renderSingularityMoment = () => (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      {/* Pre-singularity state */}
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
      
      {/* Singularity moment */}
      <motion.div
        className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-neon-green to-bright-pink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ transformOrigin: "top" }}
      />
      
      {/* Post-singularity explosion */}
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
      
      {/* Explosion effect */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-bright-pink rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * Math.PI / 4) * 100,
                  y: Math.sin(i * Math.PI / 4) * 100,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-neon-green font-jetbrains"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 1 : 0 }}
      >
        The Singularity Moment
      </motion.div>
    </div>
  );

  const renderIntelligenceExplosion = () => (
    <div className="relative w-full h-64 bg-slate-900/30 rounded-lg p-6 overflow-hidden">
      {/* Intelligence levels */}
      <div className="space-y-3 h-full">
        {[
          { label: "Human Baseline", multiplier: "1x", color: "#667EEA", delay: 0 },
          { label: "Early Superintelligence", multiplier: "10x", color: "#10B981", delay: 0.5 },
          { label: "Advanced AI", multiplier: "100x", color: "#F093FB", delay: 1 },
          { label: "Transcendent Intelligence", multiplier: "1000x+", color: "#FF6B6B", delay: 1.5 }
        ].map((level, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 rounded"
            style={{ backgroundColor: `${level.color}10` }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: stage >= index ? 0 : -100,
              opacity: stage >= index ? 1 : 0
            }}
            transition={{ duration: 0.8, delay: level.delay }}
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
                  delay: level.delay 
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
      
      {/* Growth curve */}
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

  const conceptRenderers = {
    'exponential-growth': renderExponentialGrowth,
    'ai-evolution': renderAIEvolution,
    'singularity-moment': renderSingularityMoment,
    'intelligence-explosion': renderIntelligenceExplosion
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6 }}
    >
      {conceptRenderers[concept]()}
      
      {/* Replay button */}
      <motion.button
        className="mt-4 px-4 py-2 bg-tech-purple/20 border border-tech-purple/50 rounded-lg text-tech-purple text-xs font-inter hover:bg-tech-purple/30 transition-colors"
        onClick={() => {
          setIsPlaying(false);
          setStage(0);
          setTimeout(() => setIsPlaying(true), 100);
        }}
        disabled={isPlaying}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? 'Playing...' : 'Replay Animation'}
      </motion.button>
    </motion.div>
  );
}

export function ConceptShowcase() {
  const [selectedConcept, setSelectedConcept] = useState<'exponential-growth' | 'ai-evolution' | 'singularity-moment' | 'intelligence-explosion'>('exponential-growth');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const concepts = [
    {
      key: 'exponential-growth' as const,
      title: 'Exponential Growth',
      description: 'Understanding how AI capabilities accelerate over time'
    },
    {
      key: 'ai-evolution' as const,
      title: 'AI Evolution',
      description: 'The progression from narrow AI to superintelligence'
    },
    {
      key: 'singularity-moment' as const,
      title: 'Singularity Moment',
      description: 'The critical transition point in AI development'
    },
    {
      key: 'intelligence-explosion' as const,
      title: 'Intelligence Explosion',
      description: 'Post-singularity exponential capability growth'
    }
  ];

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
          
          {/* Concept selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {concepts.map((concept) => (
              <button
                key={concept.key}
                onClick={() => setSelectedConcept(concept.key)}
                className={`p-4 rounded-lg text-left transition-all duration-300 ${
                  selectedConcept === concept.key
                    ? 'bg-tech-purple/30 border-2 border-tech-purple text-white'
                    : 'bg-slate-800/30 border border-slate-600/50 text-light-grey hover:bg-slate-700/30'
                }`}
              >
                <div className="text-sm font-semibold mb-1">{concept.title}</div>
                <div className="text-xs opacity-70">{concept.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Animation display */}
        <AnimatedConcept concept={selectedConcept} isVisible={isVisible} />
        
        {/* Concept explanation */}
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