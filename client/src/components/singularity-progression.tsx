import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function SingularityProgression() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ year: string; value: number; impact: string } | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'pre' | 'singularity' | 'post'>('all');

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Generate different data ranges based on selected period
        let years: string[] = [];
        let singularityProgress: number[] = [];
        let startYear: number, endYear: number;
        const currentYear = new Date().getFullYear();
        
        // Set date ranges based on selected period
        switch(selectedPeriod) {
          case 'pre':
            startYear = 2020;
            endYear = 2031;
            break;
          case 'singularity':
            startYear = 2030;
            endYear = 2034;
            break;
          case 'post':
            startYear = 2033;
            endYear = 2040;
            break;
          default: // 'all'
            startYear = 2020;
            endYear = 2040;
        }
        
        for (let year = startYear; year <= endYear; year++) {
          years.push(year.toString());
          
          // Calculate exponential progression towards and beyond singularity
          const yearsSince2020 = year - 2020;
          let progress;
          
          if (year <= currentYear) {
            // Historical/current data with exponential growth
            progress = Math.min(95, 8 * Math.pow(1.4, yearsSince2020));
          } else if (year <= 2032) {
            // Projected rapid acceleration to singularity
            const yearsTo2032 = 2032 - year;
            progress = 100 - (yearsTo2032 * yearsTo2032 * 2); // Quadratic approach to 100%
          } else {
            // Post-singularity exponential explosion
            const yearsPastSingularity = year - 2032;
            // Exponential growth beyond human comprehension levels
            progress = 100 * Math.pow(2, yearsPastSingularity * 1.5); // Doubling every ~0.67 years
            // Cap at reasonable chart limits for visualization
            progress = Math.min(progress, 10000);
          }
          
          singularityProgress.push(Math.round(progress * 10) / 10);
        }

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years,
            datasets: [{
              label: selectedPeriod === 'pre' ? 'AI Development Progress' :
                     selectedPeriod === 'singularity' ? 'Singularity Transition' :
                     selectedPeriod === 'post' ? 'Superintelligence Growth' :
                     'Intelligence Progress (%)',
              data: singularityProgress,
              borderColor: selectedPeriod === 'pre' ? '#667EEA' :
                          selectedPeriod === 'singularity' ? '#10B981' :
                          selectedPeriod === 'post' ? '#FF6B6B' : '#667EEA',
              backgroundColor: selectedPeriod === 'pre' ? 'rgba(102, 126, 234, 0.1)' :
                              selectedPeriod === 'singularity' ? 'rgba(16, 185, 129, 0.1)' :
                              selectedPeriod === 'post' ? 'rgba(255, 107, 107, 0.1)' :
                              'rgba(102, 126, 234, 0.1)',
              borderWidth: 3,
              tension: selectedPeriod === 'singularity' ? 0.2 : 0.4,
              pointBackgroundColor: years.map((year) => {
                const yearNum = parseInt(year);
                if (year === '2032') return '#10B981'; // Bright green for singularity
                if (year === currentYear.toString()) return '#F093FB'; // Bright pink for current year
                if (yearNum > 2032) return '#FF6B6B'; // Red for post-singularity explosion
                return '#667EEA'; // Default purple
              }),
              pointBorderColor: years.map((year) => {
                const yearNum = parseInt(year);
                if (year === '2032' || year === currentYear.toString() || yearNum > 2032) {
                  return '#FFFFFF'; // White border for key points
                }
                return '#667EEA'; // Default border
              }),
              pointBorderWidth: years.map((year) => {
                const yearNum = parseInt(year);
                if (year === '2032' || year === currentYear.toString()) return 4;
                if (yearNum > 2032) return 3;
                return 2;
              }),
              pointRadius: years.map((year) => {
                const yearNum = parseInt(year);
                if (year === '2032') return 12;
                if (year === currentYear.toString()) return 10;
                if (yearNum > 2032) return 7;
                return 5;
              }),
              pointHoverRadius: years.map((year) => {
                const yearNum = parseInt(year);
                if (year === '2032') return 15;
                if (year === currentYear.toString()) return 12;
                if (yearNum > 2032) return 10;
                return 8;
              }),
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              legend: {
                labels: { 
                  color: '#E5E7EB', 
                  font: { family: 'Inter', size: 14 },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 15, 35, 0.95)',
                titleColor: '#E5E7EB',
                bodyColor: '#E5E7EB',
                borderColor: '#667EEA',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  title: function(context: any) {
                    const year = context[0].label;
                    const yearNum = parseInt(year);
                    if (yearNum < 2032) return `Pre-Singularity Era: ${year}`;
                    if (yearNum === 2032) return `🚀 SINGULARITY POINT: ${year}`;
                    return `Post-Singularity Era: ${year}`;
                  },
                  label: function(context: any) {
                    const year = parseInt(context.label);
                    const value = context.parsed.y;
                    
                    if (selectedPeriod === 'pre') {
                      if (year <= currentYear) {
                        return `Current Progress: ${value}%\nAI capabilities rapidly advancing`;
                      } else {
                        return `Projected: ${value}%\nAccelerating toward singularity`;
                      }
                    } else if (selectedPeriod === 'singularity') {
                      if (year === 2032) {
                        return `SINGULARITY POINT: ${value}%\nAI matches human intelligence`;
                      } else if (year < 2032) {
                        return `Approach Phase: ${value}%\nCritical threshold imminent`;
                      } else {
                        return `Emergence Phase: ${value}%\nSuperhuman capabilities emerging`;
                      }
                    } else if (selectedPeriod === 'post') {
                      const multiplier = (value / 100).toFixed(1);
                      return `Superintelligence: ${multiplier}x human\nExponential capability explosion`;
                    } else {
                      if (year < 2032) {
                        return `Progress: ${value}%\nExponential acceleration toward superintelligence`;
                      } else if (year === 2032) {
                        return `Progress: 100% - SINGULARITY ACHIEVED!\nAI surpasses human intelligence`;
                      } else {
                        const multiplier = (value / 100).toFixed(1);
                        return `Progress: ${value}% (${multiplier}x human baseline)\nExponential capability explosion`;
                      }
                    }
                  },
                  afterLabel: function(context: any) {
                    const year = parseInt(context.label);
                    
                    if (selectedPeriod === 'pre') {
                      if (year <= currentYear) return '• Current AI development phase';
                      if (year < 2030) return '• Rapid advancement phase';
                      return '• Critical acceleration period';
                    } else if (selectedPeriod === 'singularity') {
                      if (year === 2030) return '• Final approach to singularity';
                      if (year === 2031) return '• Critical threshold proximity';
                      if (year === 2032) return '• SINGULARITY ACHIEVED';
                      if (year === 2033) return '• Post-human intelligence begins';
                      return '• Superintelligence emergence';
                    } else if (selectedPeriod === 'post') {
                      if (year === 2033) return '• First year of superintelligence';
                      if (year < 2037) return '• Rapid capability expansion';
                      return '• Beyond human comprehension';
                    } else {
                      if (year < 2025) return '• Current AI capabilities';
                      if (year < 2030) return '• Rapid AI advancement phase';
                      if (year === 2032) return '• Technological singularity threshold';
                      if (year < 2035) return '• Post-human intelligence era begins';
                      return '• Beyond human comprehension levels';
                    }
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: selectedPeriod === 'singularity' ? 'Year (Singularity Window)' : 
                        selectedPeriod === 'pre' ? 'Year (Pre-Singularity)' :
                        selectedPeriod === 'post' ? 'Year (Post-Singularity)' : 'Year',
                  color: '#E5E7EB',
                  font: { family: 'Orbitron', size: 14, weight: 'bold' }
                },
                ticks: { 
                  color: '#E5E7EB',
                  font: { family: 'JetBrains Mono', size: 12 }
                },
                grid: { 
                  color: 'rgba(229, 231, 235, 0.1)',
                  drawOnChartArea: true
                }
              },
              y: {
                type: selectedPeriod === 'pre' ? 'linear' : 'logarithmic',
                title: {
                  display: true,
                  text: selectedPeriod === 'pre' ? 'AI Progress (% toward Singularity)' :
                        selectedPeriod === 'singularity' ? 'Intelligence Level (Critical Threshold)' :
                        selectedPeriod === 'post' ? 'Superintelligence Multiplier (x Human)' :
                        'Intelligence Level (% of Human Baseline)',
                  color: '#E5E7EB',
                  font: { family: 'Orbitron', size: 14, weight: 'bold' }
                },
                min: selectedPeriod === 'pre' ? 0 : 
                     selectedPeriod === 'singularity' ? 80 : 
                     selectedPeriod === 'post' ? 100 : 1,
                max: selectedPeriod === 'pre' ? 100 : 
                     selectedPeriod === 'singularity' ? 200 : 
                     selectedPeriod === 'post' ? 10000 : 10000,
                ticks: { 
                  color: '#E5E7EB',
                  font: { family: 'JetBrains Mono', size: 12 },
                  callback: function(value: any) {
                    if (selectedPeriod === 'pre') {
                      return `${value}%`;
                    } else if (selectedPeriod === 'singularity') {
                      if (value === 100) return '100% (Human Baseline)';
                      if (value === 150) return '150% (Near Singularity)';
                      if (value === 200) return '200% (Post-Human)';
                      return `${value}%`;
                    } else if (selectedPeriod === 'post') {
                      const multiplier = Math.round(value / 100);
                      if (value === 100) return '1x (Human)';
                      if (value === 1000) return '10x Human';
                      if (value === 10000) return '100x Human';
                      return `${multiplier}x`;
                    } else {
                      if (value === 100) return '100% (Human Baseline)';
                      if (value === 1000) return '1000% (10x Human)';
                      if (value === 10000) return '10000% (100x Human)';
                      return value + '%';
                    }
                  }
                },
                grid: { 
                  color: 'rgba(229, 231, 235, 0.1)',
                  drawOnChartArea: true
                }
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart'
            },
            elements: {
              point: {
                hoverRadius: 15
              }
            },
            onHover: (event: any, elements: any) => {
              if (elements.length > 0) {
                const dataIndex = elements[0].index;
                const year = years[dataIndex];
                const value = singularityProgress[dataIndex];
                
                let impact = '';
                const yearNum = parseInt(year);
                if (yearNum < 2032) {
                  impact = 'Pre-singularity development phase';
                } else if (yearNum === 2032) {
                  impact = 'Technological singularity achieved';
                } else {
                  impact = 'Post-singularity exponential growth';
                }
                
                setHoveredPoint({ year, value, impact });
              } else {
                setHoveredPoint(null);
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedPeriod]);

  const getPeriodData = () => {
    const baseDescription = "Interactive timeline showing exponential AI progress toward and beyond technological singularity";
    
    switch(selectedPeriod) {
      case 'pre':
        return {
          description: "Pre-Singularity Era: Current AI development and rapid acceleration phase",
          highlight: "Years 2020-2031"
        };
      case 'singularity':
        return {
          description: "Singularity Point: The moment AI surpasses human intelligence across all domains",
          highlight: "Year 2032"
        };
      case 'post':
        return {
          description: "Post-Singularity Era: Exponential intelligence explosion beyond human comprehension",
          highlight: "Years 2033-2040+"
        };
      default:
        return {
          description: baseDescription,
          highlight: "Full Timeline 2020-2040"
        };
    }
  };

  const periodData = getPeriodData();

  return (
    <section className="mb-12">
      <div className="bg-slate-900/50 border border-tech-purple/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
            Interactive Singularity Timeline
          </h3>
          <p className="text-sm text-light-grey mb-4">
            {periodData.description}
          </p>
          
          {/* Period Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[
              { key: 'all', label: 'Full Timeline', color: 'tech-purple' },
              { key: 'pre', label: 'Pre-Singularity', color: 'tech-purple' },
              { key: 'singularity', label: 'Singularity Point', color: 'neon-green' },
              { key: 'post', label: 'Post-Singularity', color: 'bright-pink' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-4 py-2 rounded-lg text-xs font-inter font-medium transition-all duration-300 ${
                  selectedPeriod === period.key
                    ? 'bg-tech-purple text-white shadow-lg'
                    : 'bg-slate-800/50 text-light-grey border border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80 mb-6 relative">
          <canvas ref={chartRef}></canvas>
          
          {/* Hover Information Overlay */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-slate-800/90 border border-tech-purple/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm font-jetbrains font-bold text-white mb-1">
                Year {hoveredPoint.year}
              </div>
              <div className="text-xs text-light-grey mb-1">
                Intelligence: {hoveredPoint.value}%
              </div>
              <div className="text-xs text-tech-purple">
                {hoveredPoint.impact}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Legend with Growth Phases */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center space-x-2 bg-slate-800/30 rounded-lg p-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#667EEA' }}></div>
            <span className="text-xs text-light-grey font-inter">Current Progress</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/30 rounded-lg p-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F093FB' }}></div>
            <span className="text-xs text-light-grey font-inter">Today ({new Date().getFullYear()})</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/30 rounded-lg p-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-xs text-light-grey font-inter">Singularity (2032)</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/30 rounded-lg p-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
            <span className="text-xs text-light-grey font-inter">Post-Singularity</span>
          </div>
        </div>

        {/* Growth Phase Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-tech-purple/30">
            <div className="text-xl font-jetbrains font-bold text-white mb-1">
              {new Date().getFullYear()}
            </div>
            <div className="text-xs text-light-grey uppercase tracking-wide mb-2">Current Year</div>
            <div className="text-xs text-tech-purple">
              Rapid AI Development Phase
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-neon-green/30">
            <div className="text-xl font-jetbrains font-bold text-neon-green mb-1">2032</div>
            <div className="text-xs text-light-grey uppercase tracking-wide mb-2">Singularity Point</div>
            <div className="text-xs text-neon-green">
              AI = Human Intelligence
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-bright-pink/30">
            <div className="text-xl font-jetbrains font-bold text-bright-pink mb-1">∞</div>
            <div className="text-xs text-light-grey uppercase tracking-wide mb-2">Post-Singularity</div>
            <div className="text-xs text-bright-pink">
              Exponential Intelligence Explosion
            </div>
          </div>
        </div>
        
        {/* Growth Rate Indicator */}
        <div className="mt-6 text-center">
          <div className="text-sm text-light-grey/70 mb-2">
            Selected Period: <span className="text-white font-semibold">{periodData.highlight}</span>
          </div>
          <div className="text-xs text-tech-purple">
            Hover timeline points for detailed projections • Logarithmic scale shows exponential growth
          </div>
        </div>
      </div>
    </section>
  );
}