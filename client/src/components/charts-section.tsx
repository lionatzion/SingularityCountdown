import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function ChartsSection() {
  const progressionChartRef = useRef<HTMLCanvasElement>(null);
  const gpuTrendsChartRef = useRef<HTMLCanvasElement>(null);
  const progressionChartInstance = useRef<Chart | null>(null);
  const gpuTrendsChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Computing Power Progression Chart
    if (progressionChartRef.current) {
      if (progressionChartInstance.current) {
        progressionChartInstance.current.destroy();
      }

      const ctx = progressionChartRef.current.getContext('2d');
      if (ctx) {
        progressionChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
            datasets: [
              {
                label: 'Historical (×10²⁰ FLOPS)',
                data: [1.2, 2.8, 4.5, 7.3, 12.1, 18.7, null, null, null, null, null],
                borderColor: '#667EEA',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#667EEA',
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: true
              },
              {
                label: 'Projected Growth',
                data: [null, null, null, null, null, 18.7, 28.5, 43.2, 65.8, 100.2, 152.7],
                borderColor: '#F093FB',
                backgroundColor: 'rgba(240, 147, 251, 0.1)',
                borderWidth: 3,
                borderDash: [8, 4],
                tension: 0.4,
                pointBackgroundColor: '#F093FB',
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#E5E7EB', font: { family: 'Inter' } }
              }
            },
            scales: {
              x: {
                ticks: { color: '#E5E7EB' },
                grid: { color: 'rgba(229, 231, 235, 0.1)' }
              },
              y: {
                ticks: { color: '#E5E7EB' },
                grid: { color: 'rgba(229, 231, 235, 0.1)' }
              }
            }
          }
        });
      }
    }

    // GPU Trends Chart
    if (gpuTrendsChartRef.current) {
      if (gpuTrendsChartInstance.current) {
        gpuTrendsChartInstance.current.destroy();
      }

      const ctx = gpuTrendsChartRef.current.getContext('2d');
      if (ctx) {
        gpuTrendsChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['RTX 3090', 'RTX 4090', 'H100', 'H200', 'Future GPU'],
            datasets: [{
              label: 'Benchmark Score (×1000)',
              data: [45.2, 67.8, 89.5, 94.6, 125.3],
              backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(240, 147, 251, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(240, 147, 251, 0.6)'
              ],
              borderColor: [
                '#667EEA',
                '#764BA2',
                '#F093FB',
                '#10B981',
                '#F093FB'
              ],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '#E5E7EB', font: { family: 'Inter' } }
              }
            },
            scales: {
              x: {
                ticks: { color: '#E5E7EB' },
                grid: { color: 'rgba(229, 231, 235, 0.1)' }
              },
              y: {
                ticks: { color: '#E5E7EB' },
                grid: { color: 'rgba(229, 231, 235, 0.1)' }
              }
            }
          }
        });
      }
    }

    return () => {
      if (progressionChartInstance.current) {
        progressionChartInstance.current.destroy();
      }
      if (gpuTrendsChartInstance.current) {
        gpuTrendsChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Computing Power Progression */}
      <div className="glow-border rounded-xl p-6 gradient-bg">
        <h3 className="text-xl font-inter font-semibold text-white mb-6">Computing Power Progression & Projected Growth</h3>
        <div className="h-64">
          <canvas ref={progressionChartRef}></canvas>
        </div>
      </div>

      {/* GPU Benchmark Trends */}
      <div className="glow-border rounded-xl p-6 gradient-bg">
        <h3 className="text-xl font-inter font-semibold text-white mb-6">GPU Benchmark Trends</h3>
        <div className="h-64">
          <canvas ref={gpuTrendsChartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
