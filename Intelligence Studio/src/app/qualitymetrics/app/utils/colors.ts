export const getStatusColor = (status: 'green' | 'yellow' | 'red' | string) => {
  const colors = {
    green: {
      bg: 'bg-[#4ade80]',
      text: 'text-white',
      border: 'border-[#4ade80]/30',
      glow: 'shadow-[0_4px_20px_rgba(74,222,128,0.3)]',
    },
    yellow: {
      bg: 'bg-[#fbbf24]',
      text: 'text-white',
      border: 'border-[#fbbf24]/30',
      glow: 'shadow-[0_4px_20px_rgba(251,191,36,0.3)]',
    },
    red: {
      bg: 'bg-[#ef4444]',
      text: 'text-white',
      border: 'border-[#ef4444]/30',
      glow: 'shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
    },
  };

  return colors[status as keyof typeof colors] || { bg: 'bg-transparent', text: 'text-white', border: 'border-transparent', glow: '' };
};

export const getPercentageColor = (value: number) => {
  if (value >= 90) return 'green';
  if (value >= 70) return 'yellow';
  return 'red';
};

export const formatPercentage = (value: number | string) => {
  if (typeof value === 'string') return value;
  return `${value}%`;
};
