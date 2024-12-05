export const getEmotionColor = (emotion: { type: string; confidence: number }) => {
  const opacity = Math.max(0.1, Math.min(emotion.confidence, 0.3));
  switch (emotion.type.toLowerCase()) {
    case 'happy':
    case 'joy':
      return `bg-yellow-100/${Math.round(opacity * 100)} dark:bg-yellow-900/${Math.round(opacity * 100)}`;
    case 'sad':
    case 'sadness':
      return `bg-blue-100/${Math.round(opacity * 100)} dark:bg-blue-900/${Math.round(opacity * 100)}`;
    case 'angry':
    case 'anger':
      return `bg-red-100/${Math.round(opacity * 100)} dark:bg-red-900/${Math.round(opacity * 100)}`;
    case 'neutral':
      return '';
    default:
      return `bg-gray-100/${Math.round(opacity * 100)} dark:bg-gray-900/${Math.round(opacity * 100)}`;
  }
};

export const getTriggerColor = (type: string) => {
  switch (type) {
    case 'task':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'reminder':
      return 'bg-yellow-100 dark:bg-yellow-900/30 underline';
    case 'decision':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'risk':
      return 'bg-red-100 dark:bg-red-900/30';
    case 'highlight':
      return 'bg-purple-100 dark:bg-purple-900/30';
    default:
      return '';
  }
};