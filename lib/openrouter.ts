import axios from 'axios';

export interface OpenRouterParams {
  extractedText: string;
  style: string;
}

export interface OpenRouterResult {
  prompt: string;
  title: string;
  tags: string;
}

export class OpenRouterAPI {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSongPrompt(params: OpenRouterParams): Promise<OpenRouterResult> {
    if (!this.apiKey || this.apiKey === '') {
      throw new Error('OpenRouter API key not configured');
    }

    const styleDescriptions = {
      sad: 'sad, melancholic, heartbreak, emotional, slow tempo',
      savage: 'empowering, confident, revenge, upbeat, sassy',
      healing: 'hopeful, uplifting, growth, peaceful, moving on',
      vibe: 'chill, smooth, atmospheric, laid-back',
      meme: 'funny, quirky, humorous, playful, ironic',
    };

    const systemPrompt = `You are an AI assistant that helps clean up extracted text from images (OCR) and generates Suno AI prompts for song generation.

Your task is to:
1. Clean up any OCR errors or garbled text from the user's story
2. Create a catchy song title (max 50 characters)
3. Generate music genre/style tags (max 80 characters) - be specific with musical styles
4. Create a descriptive prompt for Suno AI that captures the story's emotion and the requested style

The prompt should describe the song's theme, emotion, and narrative arc - NOT full lyrics. Suno AI will generate the actual lyrics and music.

Style requested: ${params.style} (${styleDescriptions[params.style as keyof typeof styleDescriptions] || 'emotional'})

Return your response in this exact JSON format:
{
  "title": "Song Title Here",
  "tags": "genre, style, mood, tempo",
  "prompt": "A descriptive prompt for Suno AI about the song's theme, emotion, and narrative"
}`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Clean up this text and create a Suno AI prompt for a ${params.style} HeartHeal song:\n\n${params.extractedText}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://heartheal.app',
            'X-Title': 'HeartHeal',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      let parsed;

      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenRouter response as JSON:', content);
        throw new Error('Invalid response format from AI model');
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('AI returned invalid data structure');
      }

      const defaultTags = styleDescriptions[params.style as keyof typeof styleDescriptions] || 'emotional';
      
      return {
        prompt: parsed.prompt || parsed.lyrics || parsed.lyric || '',
        title: parsed.title || `${params.style.charAt(0).toUpperCase() + params.style.slice(1)} HeartHeal Anthem`,
        tags: parsed.tags || parsed.genre || defaultTags,
      };
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenRouter API key. Please check your configuration.');
      }
      
      if (error.response?.status === 402) {
        throw new Error('Insufficient OpenRouter credits. Please add more credits.');
      }

      throw new Error(
        `Failed to generate prompt with OpenRouter: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }
}

export function createOpenRouterClient(): OpenRouterAPI {
  const apiKey = process.env.OPENROUTER_API_KEY || '';
  return new OpenRouterAPI(apiKey);
}
