import { useState, useEffect } from "react";

interface CountdownData {
  years: number;
  months: number;
  days: number;
  hours: number;
}

export default function CountdownTimer() {
  const [countdown, setCountdown] = useState<CountdownData>({
    years: 7,
    months: 3,
    days: 15,
    hours: 12,
  });

  useEffect(() => {
    const updateCountdown = () => {
      // Target date: March 15, 2032
      const targetDate = new Date('2032-03-15T12:00:00').getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setCountdown({ years, months, days, hours });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glow-border rounded-2xl p-8 gradient-bg mb-8">
      <div className="text-center">
        <h3 className="text-2xl font-orbitron font-bold text-bright-pink mb-6">Predicted Singularity Date</h3>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-4 border border-tech-purple/30">
              <div className="text-4xl md:text-5xl font-jetbrains font-bold countdown-digit text-bright-pink">
                {String(countdown.years).padStart(2, '0')}
              </div>
              <div className="text-sm font-inter uppercase tracking-wider text-light-grey/60">Years</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-4 border border-tech-purple/30">
              <div className="text-4xl md:text-5xl font-jetbrains font-bold countdown-digit text-bright-pink">
                {String(countdown.months).padStart(2, '0')}
              </div>
              <div className="text-sm font-inter uppercase tracking-wider text-light-grey/60">Months</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-4 border border-tech-purple/30">
              <div className="text-4xl md:text-5xl font-jetbrains font-bold countdown-digit text-bright-pink">
                {String(countdown.days).padStart(2, '0')}
              </div>
              <div className="text-sm font-inter uppercase tracking-wider text-light-grey/60">Days</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-tech-purple/20 to-deep-purple/20 rounded-lg p-4 border border-tech-purple/30">
              <div className="text-4xl md:text-5xl font-jetbrains font-bold countdown-digit text-bright-pink">
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <div className="text-sm font-inter uppercase tracking-wider text-light-grey/60">Hours</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-jetbrains text-white mb-2">March 15, 2032</p>
          <p className="text-sm text-light-grey/60">Based on current GPU performance and AI advancement trends</p>
        </div>
      </div>
    </div>
  );
}
