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
        // Generate progression data points from 2020 to 2040
        const years: string[] = [];
        const singularityProgress: number[] = [];
        const currentYear = new Date().getFullYear();
        
        for (let year = 2020; year <= 2040; year++) {
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
              label: 'Singularity Progress (%)',
              data: singularityProgress,
              borderColor: '#667EEA',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: years.map((year, index) => {
                const yearNum = parseInt(year);
                if (year === '2032') return '#10B981'; // Bright green for singularity
                if (year === currentYear.toString()) return '#F093FB'; // Bright pink for current year
                if (yearNum > 2032) return '#FF6B6B'; // Red for post-singularity explosion
                return '#667EEA'; // Default purple
              }),
              pointBorderColor: years.map((year, index) => {
                const yearNum = parseInt(year);
                if (year === '2032') return '#FFFFFF'; // White border for singularity
                if (year === currentYear.toString()) return '#FFFFFF'; // White border for current year
                if (yearNum > 2032) return '#FFFFFF'; // White border for post-singularity
                return '#667EEA'; // Default border
              }),
              pointBorderWidth: years.map((year, index) => {
                const yearNum = parseInt(year);
                if (year === '2032' || year === currentYear.toString()) return 4; // Thicker border for key points
                if (yearNum > 2032) return 3; // Thick border for post-singularity
                return 2; // Default border
              }),
              pointRadius: years.map((year, index) => {
                const yearNum = parseInt(year);
                if (year === '2032') return 12; // Largest for singularity
                if (year === currentYear.toString()) return 10; // Large for current year
                if (yearNum > 2032) return 7; // Medium-large for post-singularity
                return 5; // Default size
              }),
              pointHoverRadius: years.map((year, index) => {
                const yearNum = parseInt(year);
                if (year === '2032') return 15; // Largest hover for singularity
                if (year === currentYear.toString()) return 12; // Large hover for current year
                if (yearNum > 2032) return 10; // Large hover for post-singularity
                return 8; // Default hover
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
                    
                    if (year < 2032) {
                      return `Progress: ${value}%\nExponential acceleration toward superintelligence`;
                    } else if (year === 2032) {
                      return `Progress: 100% - SINGULARITY ACHIEVED!\nAI surpasses human intelligence`;
                    } else {
                      const multiplier = (value / 100).toFixed(1);
                      return `Progress: ${value}% (${multiplier}x human baseline)\nExponential capability explosion`;
                    }
                  },
                  afterLabel: function(context: any) {
                    const year = parseInt(context.label);
                    if (year < 2025) return '• Current AI capabilities';
                    if (year < 2030) return '• Rapid AI advancement phase';
                    if (year === 2032) return '• Technological singularity threshold';
                    if (year < 2035) return '• Post-human intelligence era begins';
                    return '• Beyond human comprehension levels';
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year',
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
                type: 'logarithmic',
                title: {
                  display: true,
                  text: 'Intelligence Level (% of Human Baseline)',
                  color: '#E5E7EB',
                  font: { family: 'Orbitron', size: 14, weight: 'bold' }
                },
                min: 1,
                max: 10000,
                ticks: { 
                  color: '#E5E7EB',
                  font: { family: 'JetBrains Mono', size: 12 },
                  callback: function(value) {
                    const numValue = Number(value);
                    if (numValue >= 1000) return (numValue / 1000) + 'k%';
                    if (numValue >= 100) return numValue + '%';
                    return numValue + '%';
                  }
                },
                grid: { 
                  color: 'rgba(229, 231, 235, 0.1)',
                  drawOnChartArea: true
                }
              }
            },
            // Add annotation for singularity point
            elements: {
              point: {
                hoverBorderWidth: 4,
                hoverRadius: 10
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
  }, []);

  return (
    <section className="mb-12">
      <div className="glow-border rounded-2xl p-8 gradient-bg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
            Singularity Progression Timeline
          </h3>
          <p className="text-sm text-light-grey/70">
            Exponential growth trajectory toward technological singularity
          </p>
        </div>
        
        <div className="h-80 mb-4">
          <canvas ref={chartRef}></canvas>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#F093FB' }}></div>
            <span className="text-xs text-light-grey font-inter">Current Year ({new Date().getFullYear()})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-xs text-light-grey font-inter">Singularity Point (2032)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#FF6B6B' }}></div>
            <span className="text-xs text-light-grey font-inter">Post-Singularity Era</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border border-tech-purple" style={{ backgroundColor: '#667EEA' }}></div>
            <span className="text-xs text-light-grey font-inter">Pre-Singularity</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gradient-to-br from-bright-pink/20 to-deep-purple/20 rounded-lg p-3 border border-bright-pink/30">
            <div className="text-lg font-jetbrains font-bold text-bright-pink">
              {new Date().getFullYear()}
            </div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Current Year</div>
          </div>
          <div className="bg-gradient-to-br from-neon-green/20 to-deep-purple/20 rounded-lg p-3 border border-neon-green/30">
            <div className="text-lg font-jetbrains font-bold text-neon-green">2032</div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Predicted Singularity</div>
          </div>
          <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-3 border border-tech-purple/30">
            <div className="text-lg font-jetbrains font-bold text-tech-purple">100%</div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Target Progress</div>
          </div>
        </div>
      </div>
    </section>
  );
}