export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "Tamanho desconhecido";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};