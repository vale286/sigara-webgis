"use client";

import React, { useEffect, useState, useRef } from "react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface CountUpNumberProps {
  value: number | null | undefined;
  duration?: number;
  decimals?: number;
  isCurrency?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 1200,
  decimals = 0,
  isCurrency = false,
  className = "",
  prefix = "",
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null || value === undefined || isNaN(value)) {
      setDisplayValue(0);
      return;
    }

    const startValue = 0;
    const targetValue = value;
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration]);

  if (value === null || value === undefined || isNaN(value)) {
    return <span className={className}>-</span>;
  }

  const formatted = isCurrency
    ? formatCurrency(displayValue)
    : formatNumber(displayValue, decimals);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
