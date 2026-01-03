import ytdl from '@distube/ytdl-core';

/**
 * Creates a ytdl agent with cookies if available from environment variables.
 * This helps bypass YouTube's bot detection.
 * 
 * To use cookies:
 * 1. Install EditThisCookie extension in your browser
 * 2. Go to YouTube and log in
 * 3. Click the extension and export cookies
 * 4. Set the YOUTUBE_COOKIES environment variable with the JSON array
 * 
 * @returns ytdl.Agent if cookies are available, undefined otherwise
 */
export function createYtdlAgent(): ytdl.Agent | undefined {
  try {
    const cookiesEnv = process.env.YOUTUBE_COOKIES;
    
    if (!cookiesEnv) {
      return undefined;
    }
    
    // Parse cookies from environment variable
    const cookies = JSON.parse(cookiesEnv);
    
    if (!Array.isArray(cookies) || cookies.length === 0) {
      console.warn('YOUTUBE_COOKIES is not a valid array');
      return undefined;
    }
    
    // Create agent with cookies
    const agent = ytdl.createAgent(cookies);
    console.log('YouTube agent created with cookies');
    return agent;
  } catch (error) {
    console.error('Error creating ytdl agent with cookies:', error);
    return undefined;
  }
}

/**
 * Error message for bot detection
 */
export const BOT_DETECTION_ERROR_MESSAGE = 'YouTube detected automated access. Configure YOUTUBE_COOKIES environment variable to fix this. See README for setup instructions.';

/**
 * Options type for ytdl that supports both getInfo and download
 */
interface YtdlOptions {
  requestOptions?: {
    headers?: Record<string, string>;
  };
  agent?: ytdl.Agent;
}

/**
 * Gets the options for ytdl with agent and headers
 */
export function getYtdlOptions(): YtdlOptions {
  const agent = createYtdlAgent();
  
  const options: YtdlOptions = {
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }
  };
  
  // Add agent if available
  if (agent) {
    options.agent = agent;
  }
  
  return options;
}
