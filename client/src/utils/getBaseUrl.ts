// src/utils/getBaseUrl.ts

/**
 * Determines the base URL for the backend API.
 * It first checks if the local server is running by pinging the /health endpoint.
 * If the local server is available, it uses the local base URL.
 * Otherwise, it falls back to the production URL.
 */

export const getBaseUrl = async (): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3001/health");

    if (response.ok) {
      console.log("Local server is available");
      return "http://localhost:3001"; // Use the local server if available
    }
  } catch (err) {
    console.warn("Local server not available, falling back to production.");
    console.error(err); // Log the error for debugging
  }

  console.log("Falling back to production server.");
  return "https://pick-flick.onrender.com";
};

