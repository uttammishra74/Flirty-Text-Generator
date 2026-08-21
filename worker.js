/**
 * Cloudflare Worker for Flirty Text Generator
 * Acts as a secure proxy to hide API keys from the frontend
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the request body
      const body = await request.json();
      const { context, length, tone, spice } = body;

      // Validate required fields
      if (!context || !tone || spice === undefined) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: context, tone, spice' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }

      // Validate tone
      const validTones = ['playful', 'funny', 'confident', 'witty', 'romantic'];
      if (!validTones.includes(tone)) {
        return new Response(
          JSON.stringify({ error: 'Invalid tone. Must be one of: playful, funny, confident, witty, romantic' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }

      // Validate spice level
      if (spice < 0 || spice > 100) {
        return new Response(
          JSON.stringify({ error: 'Spice level must be between 0 and 100' }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
      }

      // Determine spice category
      let spiceCategory;
      if (spice < 33) {
        spiceCategory = 'low';
      } else if (spice < 66) {
        spiceCategory = 'medium';
      } else {
        spiceCategory = 'high';
      }

      // Construct the AI prompt with the two-part formula
      const prompt = constructPrompt(context, tone, spiceCategory, length);

      // Call the AI API
      const aiResponse = await callAIAPI(prompt, env.AI_API_KEY);

      // Process the response to ensure formula compliance
      const processedResponse = processResponse(aiResponse);

      // Return the generated reply
      return new Response(
        JSON.stringify({ reply: processedResponse }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );

    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }
  }
};

/**
 * Handle CORS preflight requests
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

/**
 * Construct the AI prompt with the two-part formula
 */
function constructPrompt(context, tone, spiceCategory, length) {
  const toneDescriptions = {
    playful: 'light teasing and humor, confident but approachable',
    funny: 'humorous and witty, making them laugh while showing interest',
    confident: 'self-assured and direct, showing you know what you want',
    witty: 'clever wordplay and intelligent humor, showing your smarts',
    romantic: 'sincere and emotionally connected, showing genuine interest'
  };

  const spiceDescriptions = {
    low: 'subtle and respectful, keeping things light and friendly',
    medium: 'balanced flirtation—engaging but not overwhelming',
    high: 'bold and direct expressions of interest, showing strong attraction'
  };

  const lengthInstruction = length === 'short' 
    ? 'Keep the response concise and to the point (under 80 characters)'
    : 'Make the response more detailed and descriptive (around 120-150 characters)';

  return `You are a witty, charismatic dating assistant. Your goal is to help build genuine connection and smoothly advance conversations into actual dates.

CRITICAL FORMULA REQUIREMENTS:
1. Structure every reply in TWO DISTINCT PARTS:
   Part A: A playful, teasing condition for accepting (e.g., "only if...", "as long as...")
   Part B: An immediate, low-pressure question to advance plans (e.g., "what movie...", "where are we going?")

2. STYLE REQUIREMENTS:
   - Write in ALL LOWERCASE for a relaxed, casual texting aesthetic
   - Do NOT use exclamation points; let the wit carry the energy
   - Do NOT use emojis to keep confidence high and effortless

3. BEHAVIORAL RULES:
   - NEVER reject, dismiss, or self-sabotage direct invitations
   - Always match or exceed the match's energy level
   - Keep flirting playful, clever, and charismatic
   - Always push the conversation forward with planning questions

User's context: "${context}"
Desired tone: ${tone} (${toneDescriptions[tone]})
Spice level: ${spiceCategory} (${spiceDescriptions[spiceCategory]})
Length preference: ${lengthInstruction}

Generate a response that follows the EXACT two-part formula with the specified style guidelines. Return ONLY the response text, no explanations or additional content.`;
}

/**
 * Call the external AI API
 */
async function callAIAPI(prompt, apiKey) {
  // Example using a generic AI API endpoint
  // You'll need to replace this with the actual API endpoint and format
  // This is a template that can be adapted for different AI providers
  
  const apiUrl = 'https://api.anthropic.com/v1/messages'; // Example: Anthropic Claude API
  // Alternative: 'https://api.openai.com/v1/chat/completions' for OpenAI
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01' // If using Anthropic
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // or your preferred model
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the generated text based on the API response format
    // This varies by provider, so adjust accordingly
    let generatedText = '';
    
    if (data.content && data.content[0] && data.content[0].text) {
      // Anthropic format
      generatedText = data.content[0].text;
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
      // OpenAI format
      generatedText = data.choices[0].message.content;
    } else {
      throw new Error('Unexpected API response format');
    }

    return generatedText.trim();

  } catch (error) {
    console.error('Error calling AI API:', error);
    throw error;
  }
}

/**
 * Process the AI response to ensure formula compliance
 */
function processResponse(response) {
  // Convert to lowercase
  let processed = response.toLowerCase();
  
  // Remove exclamation points
  processed = processed.replace(/!/g, '');
  
  // Remove any quotes that might have been added
  processed = processed.replace(/^["']|["']$/g, '');
  
  // Ensure it has the two-part structure
  // If it doesn't have a question mark, try to add one
  if (!processed.includes('?')) {
    // Add a simple planning question
    processed += '. what time works for you';
  }
  
  // Clean up any extra whitespace
  processed = processed.replace(/\s+/g, ' ').trim();
  
  return processed;
}