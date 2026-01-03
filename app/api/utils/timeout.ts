// Helper function to create a timeout promise that can be cleared
export function createTimeoutPromise(ms: number): { promise: Promise<never>; clear: () => void } {
  let timeoutId: NodeJS.Timeout;
  const promise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timeout')), ms);
  });
  return {
    promise,
    clear: () => clearTimeout(timeoutId)
  };
}

// Constants
export const REQUEST_TIMEOUT_MS = 30000;
