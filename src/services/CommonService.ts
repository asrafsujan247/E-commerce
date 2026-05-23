const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? "";

const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    let errorMessage = "Failed to fetch data";
    try {
      const error = await response.json() as { message?: string };
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Resilient fetch with retry for network errors.
 * Retries on DNS/connection failures before giving up.
 */
const resilientFetch = async (
  url: string,
  options: RequestInit = {},
  retries = 2,
): Promise<Response> => {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries) throw error;
      // Wait briefly before retry (exponential-ish backoff)
      await new Promise<void>((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  // TypeScript requires an explicit throw here; the loop always returns or throws
  throw new Error("resilientFetch: exhausted retries");
};

export { baseURL, handleResponse, resilientFetch };
