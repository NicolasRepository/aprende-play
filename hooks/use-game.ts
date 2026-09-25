'use client';

import { useState, useCallback, useEffect } from 'react';

export function useGameConfig<T>(initialValue: T) {
  const [config, setConfig] = useState<T>(initialValue);

  const update = useCallback((patch: Partial<T>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setConfig(initialValue), [initialValue]);

  return { config, setConfig, update, reset };
}

export function useScore() {
  const [score, setScore] = useState(0);

  const add = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const reset = useCallback(() => setScore(0), []);

  return { score, setScore, add, reset };
}

export function useTimer(autoStart = false) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(autoStart);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setSeconds(0);
    setRunning(false);
  }, []);

  return { seconds, running, start, stop, reset };
}

export function useShuffle<T>(items: T[]): T[] {
  const [shuffled, setShuffled] = useState<T[]>(items);

  const reshuffle = useCallback(() => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, [items]);

  useEffect(() => {
    reshuffle();
  }, [reshuffle]);

  return shuffled;
}
