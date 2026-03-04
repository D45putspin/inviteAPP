import React, { useState, useEffect } from 'react';

export default function Countdown({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00' });

    useEffect(() => {
        let target = new Date(targetDate).getTime();

        if (isNaN(target)) {
            target = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: '00', hours: '00', mins: '00' });
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft({
                days: d.toString().padStart(2, '0'),
                hours: h.toString().padStart(2, '0'),
                mins: m.toString().padStart(2, '0')
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown-container" aria-label="Contagem regressiva">
            <div className="countdown-item">
                <span className="countdown-val">{timeLeft.days}</span>
                <span className="countdown-label">Dias</span>
            </div>
            <div className="countdown-item">
                <span className="countdown-val">{timeLeft.hours}</span>
                <span className="countdown-label">Horas</span>
            </div>
            <div className="countdown-item">
                <span className="countdown-val">{timeLeft.mins}</span>
                <span className="countdown-label">Min</span>
            </div>
        </div>
    );
}
