// lib/utils/withErrorBoundary.ts
import { redirect } from 'next/navigation';

export async function withErrorBoundary<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[Server Error]', error);

    // Redirect to /error with error details
    redirect(
      `/error?message=${encodeURIComponent((error as Error).message || 'Something went wrong')}`
    );
  }
}
