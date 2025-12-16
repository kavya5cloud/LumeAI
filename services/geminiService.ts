const API_URL = "https://cathodic-fatima-unbrazen.ngrok-free.dev/generate";

/**
 * Generates content by calling the custom Ngrok backend.
 * Adapts the single-response API to the generator pattern expected by the UI.
 * 
 * @param prompt The user's input string.
 * @returns An async generator that yields the text response.
 */
export async function* streamGenerateContent(prompt: string) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Important: This header bypasses the Ngrok browser warning page for free tier users
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Backend connection failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // The UI expects a generator, so we yield the response.
    // Checks for { reply: string } format commonly used in Colab backends
    if (data && data.reply) {
      yield data.reply;
    } else {
      // Fallback if the backend returns the string directly or in a different format
      yield typeof data === 'string' ? data : JSON.stringify(data);
    }

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}