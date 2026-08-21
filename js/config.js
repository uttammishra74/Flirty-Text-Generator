// Configuration for Flirty Text Generator - Groq API
// Attach CONFIG to window object for global access
window.CONFIG = {
  // Backend URL configuration
  backendUrl: "https://api.groq.com",
  apiEndpoint: "/openai/v1/chat/completions",

  // Your Groq API key
  apiKey: "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",

  // Model to use (Groq offers fast models)
  model: "openai/gpt-oss-20b",

  // Request timeout in milliseconds
  requestTimeout: 10000,

  // Enable debug mode (shows detailed console logs)
  debugMode: true,

  // Enable local fallback if API fails
  enableFallback: true,

  // Rate limiting configuration
  maxRetries: 3,
  retryDelay: 1000, // milliseconds between retries

  // Available filter options
  availableFilters: {
    length: ["short", "long"],
    tone: [
      "playful",
      "funny",
      "confident",
      "witty",
      "romantic",
      "professional",
      "formal",
      "casual",
    ],
    spice: ["low", "medium", "high"],
  },
};

// Export for ES6 modules (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.CONFIG;
}