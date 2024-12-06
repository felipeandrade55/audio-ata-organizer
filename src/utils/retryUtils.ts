const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  delayMs: number,
  backoff: number = 2
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Tentativa ${attempt + 1} falhou:`, error);
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const waitTime = delayMs * Math.pow(backoff, attempt);
        await delay(waitTime);
      }
    }
  }
  
  throw lastError || new Error('Todas as tentativas falharam');
}