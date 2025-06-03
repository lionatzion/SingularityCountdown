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
              borderColor: '#667EEA',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: years.map((year, index) => {
                if (year === '2032') return '#10B981'; // Bright green for singularity
                if (year === currentYear.toString()) return '#F093FB'; // Bright pink for current year
                return '#667EEA'; // Default purple
              }),
              pointBorderColor: years.map((year, index) => {
                if (year === '2032') return '#FFFFFF'; // White border for singularity
                if (year === currentYear.toString()) return '#FFFFFF'; // White border for current year
                return '#667EEA'; // Default border
              }),
              pointBorderWidth: years.map((year, index) => {
                if (year === '2032' || year === currentYear.toString()) return 4; // Thicker border for key points
                return 2; // Default border
              }),
              pointRadius: years.map((year, index) => {
                if (year === '2032') return 12; // Largest for singularity
                if (year === currentYear.toString()) return 10; // Large for current year
                return 5; // Default size
              }),
              pointHoverRadius: years.map((year, index) => {
                if (year === '2032') return 15; // Largest hover for singularity
                if (year === currentYear.toString()) return 12; // Large hover for current year
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
                borderWidth: 2,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  title: function(context) {
                    const year = context[0].label;
                    if (year === '2032') return '🎯 SINGULARITY YEAR';
                    if (year === currentYear.toString()) return '📍 CURRENT YEAR';
                    return `Year ${year}`;
                  },
                  label: function(context) {
                    const year = parseInt(context.label);
                    const progress = context.parsed.y;
                    
                    if (year === 2032 && progress >= 100) {
                      return [`AI Surpasses Human Intelligence`, `Progress: ${progress}%`, `Technological Singularity Achieved!`];
                    } else if (year === currentYear) {
                      return [`Current AI Development Level`, `Progress: ${progress}%`, `${100 - progress}% remaining to singularity`];
                    } else if (year > currentYear) {
                      return [`Projected AI Progress`, `Estimated: ${progress}%`];
                    } else {
                      return [`Historical Progress`, `Achieved: ${progress}%`];
                    }
                  },
                  labelColor: function(context) {
                    const year = context.label;
                    if (year === '2032') return { borderColor: '#10B981', backgroundColor: '#10B981' };
                    if (year === currentYear.toString()) return { borderColor: '#F093FB', backgroundColor: '#F093FB' };
                    return { borderColor: '#667EEA', backgroundColor: '#667EEA' };
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
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#F093FB' }}></div>
            <span className="text-sm text-light-grey font-inter">Current Year ({new Date().getFullYear()})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-sm text-light-grey font-inter">Singularity Point (2032)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border border-tech-purple" style={{ backgroundColor: '#667EEA' }}></div>
            <span className="text-sm text-light-grey font-inter">Other Years</span>
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