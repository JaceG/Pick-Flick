// src/utils/getBaseUrl.ts
export const getBaseUrl = async (): Promise<string> => {
    try {
      const response = await fetch("http://localhost:3001/health");
      if (response.ok) {
        return "http://localhost:3001"; // Local server is available
      }
    } catch (err) {
      console.warn("Local server not available, falling back to production.");
    }
    return "https://pick-flick.onrender.com"; // Fallback to production
  };
  