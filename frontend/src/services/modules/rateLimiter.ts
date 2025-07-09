export class RateLimiter {
  private rateLimitWindowStart = 0;
  private requestCount = 0;
  private maxRequestsPerWindow: number;
  private windowDuration: number;

  constructor(maxRequestsPerWindow: number, windowDuration: number) {
    this.maxRequestsPerWindow = maxRequestsPerWindow;
    this.windowDuration = windowDuration;
  }

  isRateLimited(): boolean {
    const now = Date.now();
    
    // Reset window if it has passed
    if (now - this.rateLimitWindowStart > this.windowDuration) {
      this.rateLimitWindowStart = now;
      this.requestCount = 0;
    }
    
    const isLimited = this.requestCount >= this.maxRequestsPerWindow;
    
    if (isLimited) {
      console.warn(`Rate limit exceeded: ${this.requestCount}/${this.maxRequestsPerWindow} requests in ${this.windowDuration}ms window`);
    }
    
    return isLimited;
  }

  incrementRequestCount(): void {
    const now = Date.now();
    
    // Reset window if it has passed
    if (now - this.rateLimitWindowStart > this.windowDuration) {
      this.rateLimitWindowStart = now;
      this.requestCount = 0;
    }
    
    this.requestCount++;
  }

  reset(): void {
    this.rateLimitWindowStart = 0;
    this.requestCount = 0;
  }

  async retryWithBackoff<T>(
    operation: () => Promise<{ success: boolean; data?: T; error?: string }>,
    context: string,
    trackingDisabled: boolean,
    maxRetries: number,
    retryDelay: number
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    // If tracking is disabled, don't even try
    if (trackingDisabled) {
      return { success: false, error: 'Tracking disabled' };
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Check rate limit before making request
        if (this.isRateLimited()) {
          console.warn(`Rate limit reached for ${context}, skipping request`);
          return { success: false, error: 'Rate limit exceeded' };
        }

        this.incrementRequestCount();
        const result = await operation();
        
        // Reset retry attempts on success
        if (result.success) {
          return result;
        } else {
          // Don't retry on rate limit or certain errors
          if (result.error?.includes('Rate limit') || result.error?.includes('Unauthorized') || result.error?.includes('Forbidden')) {
            return result;
          }
          throw new Error(result.error || 'Request failed');
        }
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries;
        
        // Don't retry on certain error types
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Forbidden')) {
          return { success: false, error: error.message };
        }
        
        // Don't retry on network exhaustion errors unless it's not the last attempt
        if (error?.message?.includes('Unable to connect') || error?.message?.includes('insufficient resources')) {
          if (isLastAttempt) {
            console.warn(`${context} failed after ${maxRetries} attempts:`, error.message);
            return { success: false, error: error.message };
          }
          
          // Wait longer for resource exhaustion errors
          const delay = retryDelay * Math.pow(2, attempt) * 2;
          console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (isLastAttempt) {
          return { success: false, error: error.message };
        }
        
        // Exponential backoff with longer delays
        const delay = retryDelay * Math.pow(2, attempt + 1);
        console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return { success: false, error: `Failed after ${maxRetries} attempts` };
  }
}
