import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function SingularityProgression() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Generate progression data points from 2020 to 2035
        const years = [];
        const singularityProgress = [];
        const currentYear = new Date().getFullYear();
        
        for (let year = 2020; year <= 2035; year++) {
          years.push(year.toString());
          
          // Calculate exponential progression towards singularity
          // Using a sigmoid-like curve that accelerates and approaches 100% by 2032
          const yearsSince2020 = year - 2020;
          let progress;
          
          if (year <= currentYear) {
            // Historical/current data with exponential growth
            progress = Math.min(95, 8 * Math.pow(1.4, yearsSince2020));
          } else if (year <= 2032) {
            // Projected rapid acceleration
            const yearsTo2032 = 2032 - year;
            progress = 100 - (yearsTo2032 * yearsTo2032 * 2); // Quadratic approach to 100%
          } else {
            // Post-singularity plateau
            progress = 100;
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
              borderColor: '#F093FB',
              backgroundColor: 'rgba(240, 147, 251, 0.1)',
              borderWidth: 4,
              tension: 0.4,
              pointBackgroundColor: '#F093FB',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: true,
              // Add gradient effect
              segment: {
                borderColor: (ctx) => {
                  const progress = ctx.p1.parsed.y;
                  if (progress >= 100) return '#10B981'; // Green for post-singularity
                  if (progress >= 90) return '#F093FB'; // Pink for near-singularity
                  return '#667EEA'; // Purple for current progress
                }
              }
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
                backgroundColor: 'rgba(15, 15, 35, 0.9)',
                titleColor: '#E5E7EB',
                bodyColor: '#E5E7EB',
                borderColor: '#667EEA',
                borderWidth: 1,
                callbacks: {
                  label: function(context) {
                    const year = parseInt(context.label);
                    const progress = context.parsed.y;
                    
                    if (year === 2032 && progress >= 100) {
                      return `Singularity Achieved: ${progress}%`;
                    } else if (year <= new Date().getFullYear()) {
                      return `Current Progress: ${progress}%`;
                    } else {
                      return `Projected Progress: ${progress}%`;
                    }
                  }
                }
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
                title: {
                  display: true,
                  text: 'Singularity Progress (%)',
                  color: '#E5E7EB',
                  font: { family: 'Orbitron', size: 14, weight: 'bold' }
                },
                min: 0,
                max: 110,
                ticks: { 
                  color: '#E5E7EB',
                  font: { family: 'JetBrains Mono', size: 12 },
                  callback: function(value) {
                    return value + '%';
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-3 border border-tech-purple/30">
            <div className="text-lg font-jetbrains font-bold text-tech-purple">
              {new Date().getFullYear()}
            </div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Current Year</div>
          </div>
          <div className="bg-gradient-to-br from-bright-pink/20 to-deep-purple/20 rounded-lg p-3 border border-bright-pink/30">
            <div className="text-lg font-jetbrains font-bold text-bright-pink">2032</div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Predicted Singularity</div>
          </div>
          <div className="bg-gradient-to-br from-neon-green/20 to-deep-purple/20 rounded-lg p-3 border border-neon-green/30">
            <div className="text-lg font-jetbrains font-bold text-neon-green">100%</div>
            <div className="text-xs text-light-grey/60 uppercase tracking-wide">Target Progress</div>
          </div>
        </div>
      </div>
    </section>
  );
}