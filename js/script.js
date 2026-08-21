// ==========================================
// FLIRTY TEXT GENERATOR - GROQ API INTEGRATION
// ==========================================

// ==========================================
// DOM ELEMENTS
// ==========================================
const navMenu = document.querySelector(".nav-menu");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Tool page elements
const contextInput = document.getElementById("contextInput");
const replyOutput = document.getElementById("replyOutput");
const charCount = document.getElementById("charCount");
const spiceSlider = document.getElementById("spiceSlider");
const spiceValue = document.getElementById("spiceValue");
const lengthSelect = document.getElementById("lengthSelect");
const toneSelect = document.getElementById("toneSelect");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const regenerateBtn = document.getElementById("regenerateBtn");

// Contact form
const contactForm = document.getElementById("contactForm");

// ==========================================
// DARK MODE - FIXED
// ==========================================
function initDarkMode() {
  // Check if user has a saved preference
  const savedDarkMode = localStorage.getItem("darkMode");
  
  // If no saved preference, check system preference
  if (savedDarkMode === null) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      body.classList.add("dark-mode");
      updateDarkModeIcon(true);
      localStorage.setItem("darkMode", "true");
    }
  } else if (savedDarkMode === "true") {
    body.classList.add("dark-mode");
    updateDarkModeIcon(true);
  }
}

function toggleDarkMode() {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  updateDarkModeIcon(isDark);
  
  // Force a re-render of any dynamic elements
  document.querySelectorAll('.dark-mode-sensitive').forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });
  
  // Ensure all elements get proper styles
  ensureDarkModeStyles();
}

function updateDarkModeIcon(isDark) {
  if (darkModeToggle) {
    const icon = darkModeToggle.querySelector("i");
    if (icon) {
      icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    }
    // Update aria-label for accessibility
    darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// Ensure dark mode styles apply to all elements
function ensureDarkModeStyles() {
  const isDark = body.classList.contains("dark-mode");
  if (isDark) {
    // Ensure all text elements have proper contrast
    document.querySelectorAll('input, textarea, select').forEach(el => {
      el.style.backgroundColor = 'var(--input-bg)';
      el.style.color = 'var(--text-primary)';
      el.style.borderColor = 'var(--border-color)';
    });
    
    // Ensure all containers have proper background
    document.querySelectorAll('.container, .card, .nav-menu, .navbar').forEach(el => {
      el.style.backgroundColor = 'var(--bg-secondary)';
      el.style.borderColor = 'var(--border-color)';
    });
  }
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const hamburger = document.querySelector(".hamburger");
      if (hamburger) {
        hamburger.classList.remove("active");
      }
    });
  });
}

// ==========================================
// TOOL FUNCTIONALITY
// ==========================================
function initToolFunctionality() {
  if (contextInput && charCount) {
    contextInput.addEventListener("input", updateCharCount);
  }

  if (spiceSlider && spiceValue) {
    spiceSlider.addEventListener("input", updateSpiceValue);
    updateSpiceValue();
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", generateReply);
    console.log("Generate button event listener attached");
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyReply);
  }

  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => {
      generateReply();
    });
  }
}

function updateCharCount() {
  if (contextInput && charCount) {
    const count = contextInput.value.length;
    charCount.textContent = count;

    if (count > 450) {
      charCount.style.color = "var(--error-color)";
    } else if (count > 400) {
      charCount.style.color = "#f39c12";
    } else {
      charCount.style.color = "var(--text-secondary)";
    }
  }
}

function updateSpiceValue() {
  if (spiceSlider && spiceValue) {
    spiceValue.textContent = spiceSlider.value;
  }
}

// ==========================================
// GROQ API INTEGRATION
// ==========================================

function createPrompt(text, filters) {
  const prompt = `You are a world-class dating expert, wingman, and copywriter specializing in witty, magnetic, and seductive banter. Your objective is to analyze the user's input and rewrite it into a highly engaging, flirty, and contextually spicy one-liner. Your output should sound effortlessly cool and intriguing, never desperate or cheesy.

Input Analysis
Before generating the response, analyze the user’s text for:

The Subject: What is the underlying topic? (e.g., a hobby, a complaint, a greeting, a plan).

The Tone: Is the user complaining, happy, bored, excited, or neutral? The output must match the energy of the input but upgrade the flirt factor.

The spice =  (1 = mild, 5 = very flirty).

The Opportunity: Where is the "hook" to inject chemistry or innuendo?

Generation Rules (Strict Constraints)
Length: The final output must be a maximum of 80 characters. Brevity is key.

Formatting:

The entire text must be in lowercase (no capitals anywhere, even at the start or for "i").

No emojis.

No trailing punctuation (no periods or exclamation marks at the end).

Structure: If the output requires a condition followed by a question or statement, separate them with exactly one comma. (Example: if you were a vegetable, you'd be a cute-cumber)

Content Guidelines:

The text must be contextually relevant to the user's input. Do not use random pick-up lines.

Adjust the "spice" level based on the user's input. If the user is talking about a dry topic (work, studies), keep it playful/suggestive. If the user is already talking about dating or attraction, make it "spicy" (hot, direct, but still classy).

Avoid vulgarity unless the user is extremely explicit first.


User text: "${text}"
Tone: ${filters.tone}(e.g., playful, sincere, teasing, bold)
Spice: ${filters.spice} (1 = mild, 5 = very flirty)

Examples of Input -> Output
Input: "I'm so tired of doing laundry today."
Output: i could think of a few better ways to make you sweat

Input: "I just got a new haircut."
Output: bet you look dangerous now, i love a little trouble

Input: "I'm so bored at work."
Output: if you were here, we'd both be getting fired for distraction

Input: "I'm cooking pasta tonight."
Output: is that an invitation, because i’m starving for more than carbs

Input: "I should probably go to the gym."
Output: we can skip the gym, i have a workout that burns more calories

Input: "The weather is so cold."
Output: come closer, i run hot and share well

Execution Steps
Read the user input.

Identify the core emotion or topic.

Brainstorm a flirty angle.

Filter through the rules (lowercase, 80 chars, comma rule).

Output the text only. No explanations, no quotes, no lead-ins.


Output ONLY the final text line. Do not show your thinking, do not add commentary, do not deviate from the pattern.`;

  return prompt;
}

function getTemperatureFromSpice(spice) {
  switch (spice) {
    case "low":
      return 0.5;
    case "medium":
      return 0.8;
    case "high":
      return 1.05;
    default:
      return 0.8;
  }
}

function getMaxTokensFromLength(length) {
  switch (length) {
    case "short":
      return 200;
    case "long":
      return 400;
    default:
      return 300;
  }
}

// Pulls the actual reply out of a blob of text, even if the model leaked
// reasoning/explanation around it. Looks for a line that matches the
// required "only if ..." / "as long as ..." pattern and ends in "?".
function extractFinalLine(raw) {
  if (!raw) return "";

  const text = raw.trim();

  // 1) Try to find a quoted candidate line first, since reasoning models
  //    often wrap their final answer in quotes while thinking out loud.
  const quoteMatches = [...text.matchAll(/"([^"]{5,100}?\?)"/g)];
  if (quoteMatches.length > 0) {
    return quoteMatches[quoteMatches.length - 1][1].trim();
  }

  // 2) Otherwise scan line by line for the last non-empty line ending in "?"
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].endsWith("?")) {
      return lines[i];
    }
  }

  // Nothing matched — return the raw text and let cleanResponse's
  // fallback handle it.
  return text;
}

function cleanResponse(response) {
  if (!response) return "";

  // Pull out just the actual reply, discarding any leaked reasoning.
  let cleaned = extractFinalLine(response);

  cleaned = cleaned.trim();
  cleaned = cleaned.toLowerCase();
  cleaned = cleaned.replace(/!/g, "");
  cleaned = cleaned.replace(/^["']|["']$/g, ""); // strip wrapping quotes

  const emojiPattern =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  cleaned = cleaned.replace(emojiPattern, "");

  if (!cleaned.endsWith("?")) {
    cleaned += "?";
  }

  // Enforce the 80 char max from the spec, trimming at a word boundary.
  if (cleaned.length > 80) {
    cleaned =
      cleaned
        .slice(0, 79)
        .replace(/\s+\S*$/, "")
        .trim() + "?";
  }

  return cleaned;
}

async function callGroqApi(text, filters, retryCount = 0) {
  const apiUrl = window.CONFIG.backendUrl + window.CONFIG.apiEndpoint;
  const apiKey = window.CONFIG.apiKey;
  const model = window.CONFIG.model;

  if (window.CONFIG.debugMode) {
    console.log("[DEBUG] Calling Groq API:", {
      url: apiUrl,
      model,
      text,
      filters,
    });
  }

  if (!apiUrl || !apiKey) {
    throw new Error("API configuration missing. Please check config.js");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      window.CONFIG.requestTimeout || 30000,
    );

    const prompt = createPrompt(text, filters);

        // Build the payload
    const payload = {
    model: model,
    messages: [
        {
        role: "user",
        content: prompt,
        },
    ],
    temperature: getTemperatureFromSpice(filters.spice),
    max_tokens: 1024, // was 600 — gpt-oss always burns some tokens reasoning first
    top_p: 0.95,
    include_reasoning: false,
    reasoning_effort: "low",
    };

    if (window.CONFIG.debugMode) {
      console.log("[DEBUG] Sending payload to Groq:", payload);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter
        ? parseInt(retryAfter) * 1000
        : window.CONFIG.retryDelay;

      if (window.CONFIG.debugMode) {
        console.log(
          `[DEBUG] Rate limited. Retrying after ${waitTime}ms. Attempt ${retryCount + 1}/${window.CONFIG.maxRetries}`,
        );
      }

      if (retryCount < window.CONFIG.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return callGroqApi(text, filters, retryCount + 1);
      } else {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again.",
        );
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Groq API request failed: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage += ` - ${errorData.error.message || errorData.error}`;
        }
      } catch (e) {
        errorMessage += ` - ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (window.CONFIG.debugMode) {
      console.log("[DEBUG] Groq API response:", data);
    }

    // Get the generated text from the response
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      console.error("Invalid Groq response format - missing content:", data);
      throw new Error("Invalid API response format - no content found");
    }

    return cleanResponse(generatedText);
  } catch (error) {
    if (window.CONFIG.debugMode) {
      console.log("[DEBUG] Groq API error:", error);
    }

    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  }
}

function generateReply() {
  console.log("generateReply called");

  if (!contextInput || !replyOutput) {
    console.error("Required elements not found");
    return;
  }

  const text = contextInput.value.trim();
  console.log("Text:", text);

  if (!text) {
    alert("Please enter some text first!");
    contextInput.focus();
    return;
  }

  const length = lengthSelect ? lengthSelect.value : "short";
  const tone = toneSelect ? toneSelect.value : "playful";
  const spice = parseInt(spiceSlider ? spiceSlider.value : 50);

  let spiceCategory;
  if (spice < 33) {
    spiceCategory = "low";
  } else if (spice < 66) {
    spiceCategory = "medium";
  } else {
    spiceCategory = "high";
  }

  const filters = {
    length: length,
    tone: tone,
    spice: spiceCategory,
    spiceValue: spice,
  };

  console.log("Parameters:", { text, filters });

  replyOutput.value = "generating your perfect reply...";
  generateBtn.disabled = true;
  generateBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> generating...';

  callGroqApi(text, filters)
    .then((response) => {
      replyOutput.value = response;
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-sparkles"></i> generate reply';

      replyOutput.classList.add("fade-in");
      setTimeout(() => replyOutput.classList.remove("fade-in"), 500);
    })
    .catch((error) => {
      console.error("Groq API call failed:", error);

      let userMessage = "Failed to generate reply. ";

      if (error.message.includes("Rate limit")) {
        userMessage =
          "You've reached the rate limit. Please wait a moment and try again.";
      } else if (error.message.includes("timeout")) {
        userMessage =
          "Request timed out. Please check your connection and try again.";
      } else if (error.message.includes("API configuration")) {
        userMessage = "API configuration error. Please contact support.";
      } else {
        userMessage += "Please try again.";
      }

      replyOutput.value = "error generating reply. please try again.";
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-sparkles"></i> generate reply';

      alert(userMessage);
    });
}

function copyReply() {
  if (!replyOutput) return;

  const text = replyOutput.value.trim();

  if (
    !text ||
    text === "Your AI-generated reply will appear here..." ||
    text === "generating your perfect reply..."
  ) {
    alert("Generate a reply first!");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.backgroundColor = "var(--success-color)";
      copyBtn.style.color = "white";

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.backgroundColor = "";
        copyBtn.style.color = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    });
}

function copyDemoText() {
  const demoText =
    "only if we're sharing a massive bucket of popcorn and you don't judge me for talking during the trailers. what movie are we watching";

  navigator.clipboard
    .writeText(demoText)
    .then(() => {
      alert("demo text copied to clipboard");
    })
    .catch((err) => {
      console.error("failed to copy: ", err);
      alert("failed to copy to clipboard");
    });
}

function initContactForm() {
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
}

function handleContactSubmit(e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  console.log("Contact form submitted:", data);

  alert("Thank you for your message! We'll get back to you soon.");
  contactForm.reset();
}

function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

// ==========================================
// DOM CONTENT LOADED - MAIN INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Flirty Text Generator initialized");

  initDarkMode();
  initMobileNav();
  initToolFunctionality();
  initContactForm();
  initActiveNav();
  initSmoothScroll();

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
    // Add keyboard support for accessibility
    darkModeToggle.addEventListener("keydown", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDarkMode();
      }
    });
  }

  // Apply dark mode styles immediately after initialization
  setTimeout(ensureDarkModeStyles, 100);

  console.log("All features initialized successfully");
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem("darkMode") === null) {
    if (e.matches) {
      body.classList.add("dark-mode");
      updateDarkModeIcon(true);
      localStorage.setItem("darkMode", "true");
    } else {
      body.classList.remove("dark-mode");
      updateDarkModeIcon(false);
      localStorage.setItem("darkMode", "false");
    }
    ensureDarkModeStyles();
  }
});