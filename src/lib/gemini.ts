import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API client
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Only initialize if we have a valid API key
if (apiKey && apiKey !== 'your-gemini-api-key') {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

interface GenerateContentOptions {
  type: 'caption' | 'video' | 'image' | 'trending';
  platform: string;
  prompt: string;
}

export const generateContent = async ({ type, platform, prompt }: GenerateContentOptions) => {
  try {
    // Check for valid API key and model initialization
    if (!genAI || !model) {
      throw new Error('Please check your Gemini API key in the .env file');
    }

    // Validate prompt
    if (!prompt.trim() && type !== 'trending') {
      throw new Error('Please provide a prompt');
    }

    let enhancedPrompt = '';

    switch (type) {
      case 'caption':
        enhancedPrompt = `Generate an engaging social media caption for ${platform} with the following context: ${prompt}. 
          Format the response with:
          - An attention-grabbing opening line
          - Main content (2-3 sentences)
          - Call to action
          - 5-7 relevant hashtags
          
          Make it sound natural and conversational, not overly promotional.`;
        break;

      case 'video':
        enhancedPrompt = `Create a compelling ${platform} video script outline for the following topic: ${prompt}.
          Format the response with:
          - Hook (5-7 seconds)
          - Main content structure (30-45 seconds)
          - Call to action (5-7 seconds)
          - Include timing suggestions
          - Add engagement tips
          
          Keep it concise and engaging.`;
        break;

      case 'image':
        enhancedPrompt = `Generate creative image ideas for ${platform} content with the following theme: ${prompt}.
          For each idea include:
          - Visual concept description
          - Composition suggestions
          - Color palette recommendations
          - Props or elements to include
          - Caption suggestions
          Provide 3 different creative concepts.`;
        break;

      case 'trending':
        enhancedPrompt = `Generate a list of current trending topics and content ideas for ${platform} with focus on: ${prompt || 'general trends'}.
          Include for each trend:
          - Trend description
          - Why it's trending
          - How to leverage it
          - Popular hashtags
          - Content ideas
          List 3-5 trending topics.`;
        break;

      default:
        throw new Error('Invalid content type');
    }

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No content generated. Please try again.');
    }

    return text;
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // Handle specific API errors
    if (error.message?.includes('API key not valid') || 
        error.message?.includes('API key missing') ||
        error.message?.includes('Invalid API key provided')) {
      throw new Error('Invalid Gemini API key. Please check your .env file.');
    }
    
    throw new Error(error.message || 'Failed to generate content. Please try again.');
  }
};