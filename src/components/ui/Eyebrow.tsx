type Props = { children: React.ReactNode; color?: 'signal' | 'electric' | 'chrome' };

export function Eyebrow({ children, color = 'signal' }: Props) {
  const dot = color === 'electric' ? 'bg-electric' : color === 'chrome' ? 'bg-chrome' : 'bg-signal';
  return (
    <p className="font-mono text-caption uppercase tracking-[0.3em] text-chrome-lo inline-flex items-center gap-3">
      <span className={`inline-block w-1.5 h-1.5 ${dot}`} />
      {children}
    </p>
  );
}
