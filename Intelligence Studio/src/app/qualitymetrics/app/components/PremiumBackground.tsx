interface PremiumBackgroundProps {
  variant?: 'landing' | 'default';
}

export function PremiumBackground({ variant = 'default' }: PremiumBackgroundProps) {
  if (variant === 'landing') {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#1a1035] to-[#0f1e3a]" />

        <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden opacity-60">
          {[...Array(25)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-[#e91e8c] to-transparent"
              style={{
                left: `${i * 4}%`,
                transformOrigin: 'top',
                transform: 'rotate(-45deg) scaleY(1)',
              }}
            />
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden opacity-60">
          {[...Array(25)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-[#00c9ff] to-transparent"
              style={{
                right: `${i * 4}%`,
                transformOrigin: 'top',
                transform: 'rotate(45deg) scaleY(1)',
              }}
            />
          ))}
        </div>

        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#e91e8c] opacity-10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#2e5bff] opacity-10 blur-[120px]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#141b2d] to-[#0f1420]">
      <div className="absolute left-0 top-0 h-full w-1/3 overflow-hidden opacity-40">
        {[...Array(15)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#e91e8c] to-transparent"
            style={{
              left: `${i * 6.67}%`,
              transform: 'rotate(-45deg)',
              transformOrigin: 'top',
            }}
          />
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-40">
        {[...Array(15)].map((_, i) => (
          <div
            key={`line-r-${i}`}
            className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00c9ff] to-transparent"
            style={{
              right: `${i * 6.67}%`,
              transform: 'rotate(45deg)',
              transformOrigin: 'top',
            }}
          />
        ))}
      </div>
    </div>
  );
}
