export const getEmotionColor = (emotion: { type: string; confidence: number }) => {
  const colors: Record<string, string> = {
    positive: 'bg-green-50',
    negative: 'bg-red-50',
    neutral: 'bg-gray-50',
  };
  return colors[emotion.type] || '';
};

export const getTriggerColor = (type: string) => {
  const colors: Record<string, string> = {
    task: 'text-blue-600',
    reminder: 'text-yellow-600 underline',
    decision: 'text-green-600',
    risk: 'text-red-600',
    highlight: 'text-purple-600',
  };
  return colors[type] || '';
};