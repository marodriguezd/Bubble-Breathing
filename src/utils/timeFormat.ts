export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${seconds}s (${m}m ${s}s)` : `${seconds}s (${m}m)`;
};
