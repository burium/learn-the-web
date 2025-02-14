"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { SlidingNumber } from "@/components/animations/sliding-number";
import { GithubIcon } from "@/lib/icons";

export default function HomePage() {
  const targetDate = useMemo(() => new Date("2025-02-21").getTime(), []);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
    const difference = targetDate - Date.now();

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  }, [targetDate]);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="font-mono">Learn the Web</h1>
      <div className="flex items-center gap-1 font-mono mt-2">
        <SlidingNumber value={timeLeft.days} padStart={true} />
        <span className="text-neutral-400 mr-0.5">d</span>
        <SlidingNumber value={timeLeft.hours} padStart={true} />
        <span className="text-neutral-400 mr-0.5">h</span>
        <SlidingNumber value={timeLeft.minutes} padStart={true} />
        <span className="text-neutral-400 mr-0.5">m</span>
        <SlidingNumber value={timeLeft.seconds} padStart={true} />
        <span className="ttext-neutral-400">s</span>
      </div>

      <div className="absolute bottom-3">
        <a
          target="_blank"
          href="https://github.com/r4ultv/learn-the-web"
          className="text-neutral-400 hover:underline font-mono text-sm flex items-center gap-1"
        >
          <GithubIcon className="size-3.5" /> GitHub
        </a>
      </div>
    </main>
  );
}
