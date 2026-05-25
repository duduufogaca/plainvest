type Props = { data: number[]; color?: string; gradientId: string };

export function MiniSparkline({ data, color = '#4ade80', gradientId }: Props) {
  if (data.length < 2) return null;

  const W = 300, H = 60;
  const min = Math.min(...data) * 0.97;
  const max = Math.max(...data) * 1.03;
  const range = max - min || 1;

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * (H - 8) - 4,
  ] as [number, number]);

  const linePath = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const [px, py] = pts[i - 1];
    const cpx = ((px + x) / 2).toFixed(1);
    return `${acc} C ${cpx} ${py.toFixed(1)} ${cpx} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: `${H}px` }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${linePath} L ${W} ${H} L 0 ${H} Z`} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
