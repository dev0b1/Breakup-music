import axios from 'axios';
import { getFallbackMotivation } from './daily-motivations';

export interface NudgeGenerationParams {
  userStory: string;
  dayNumber: number;
  userName?: string;
}

export interface NudgeGenerationResult {
  id: string;
  audioUrl: string;
  motivationText: string;
  duration: number;
}

const savageMotivationTemplates = [
  "Your ex's downgrade means you're the upgrade; level up with this petty flex 💅",
  "They're out here struggling while you're glowing up. That's called karma, baby 🔥",
  "While they're posting thirst traps, you're posting W's. Stay savage 👑",
  "They thought you'd cry? Nah, you're out here thriving. Plot twist of the century 😈",
  "They lost a real one and gained regret. You lost dead weight and gained freedom 💅",
  "Your glow-up is their worst nightmare. Keep that energy petty and pretty 🔥",
  "They're watching your stories? Good. Let 'em see what they fumbled 👀",
  "Every day you level up is another day they realize they messed up. Stay unbothered ✨",
  "They wanted you broken? You came back titanium. That's big flex energy 💪",
  "Your ex is your biggest hater and biggest fan. Watch them lurk from the sidelines 😏"
];

export class SunoNudgeAPI {
  private apiKey: string;
  private baseUrl = 'https://api.sunoapi.org/v1/suno';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateAudioNudge(params: NudgeGenerationParams): Promise<NudgeGenerationResult> {
    if (!this.apiKey || this.apiKey === '') {
      throw new Error('Suno API key not configured');
    }

    const motivationText = this.getPersonalizedMotivation(params);
    const prompt = this.buildNudgePrompt(params, motivationText);

    try {
      console.log(`Generating Day ${params.dayNumber} audio nudge...`);
      
      const createResponse = await axios.post(
        `${this.baseUrl}/create`,
        {
          custom_mode: true,
          title: `Day ${params.dayNumber} Glow-Up Nudge`,
          tags: 'lo-fi trap, hype beats, confident voiceover, motivational',
          prompt: prompt,
          make_instrumental: false,
          mv: 'chirp-v4',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const taskId = createResponse.data.data?.id || createResponse.data.id;
      
      if (!taskId) {
        throw new Error('No task ID returned from Suno API');
      }

      console.log('Audio nudge task created, polling for completion...');
      
      const result = await this.pollForCompletion(taskId);
      
      return {
        id: result.id,
        audioUrl: result.audioUrl,
        motivationText,
        duration: result.duration || 20,
      };
    } catch (error: any) {
      console.error('Suno Nudge API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Suno API key. Please check your configuration.');
      }
      
      if (error.response?.status === 402) {
        throw new Error('Insufficient Suno API credits. Please add more credits.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Suno API rate limit exceeded. Please try again later.');
      }

      throw new Error(
        `Failed to generate audio nudge: ${error.response?.data?.error || error.message}`
      );
    }
  }

  private getPersonalizedMotivation(params: NudgeGenerationParams): string {
    const templates = savageMotivationTemplates;
    const index = (params.dayNumber - 1) % templates.length;
    let motivation = templates[index];
    
    if (params.userName) {
      motivation = `${params.userName}, ${motivation.charAt(0).toLowerCase()}${motivation.slice(1)}`;
    } else {
      motivation = `Day ${params.dayNumber}: ${motivation}`;
    }
    
    return motivation;
  }

  private buildNudgePrompt(params: NudgeGenerationParams, motivationText: string): string {
    const storySnippet = params.userStory.substring(0, 150);
    
    return `Create a 15-20 second spoken motivational voiceover with confident female narrator in sarcastic hype tone, boosting breakup confidence with petty twists. Background music: upbeat lo-fi trap with high-energy glow-up vibe. NO SINGING, just talking with beats.

Context: User's breakup story snippet: "${storySnippet}"

Narrator says (with attitude and confidence): "${motivationText}"

Style: Sassy, empowering, petty energy. Think TikTok motivational audio meets savage breakup coach. Upbeat trap beats with crisp hi-hats and bass. Vocal delivery: confident, slightly sarcastic, hyping up the listener to flex on their ex.

Duration: 15-20 seconds max. End cleanly with beat fadeout.`;
  }

  private async pollForCompletion(taskId: string, maxAttempts = 60): Promise<{
    id: string;
    audioUrl: string;
    duration: number;
  }> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.sleep(3000);

      try {
        const response = await axios.get(
          `${this.baseUrl}/get?id=${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );

        const songs = response.data.data || response.data;
        const song = Array.isArray(songs) ? songs[0] : songs;

        if (song && song.status === 'complete' && song.audio_url) {
          console.log('Audio nudge generation complete!');
          
          return {
            id: song.id,
            audioUrl: song.audio_url,
            duration: song.duration || 20,
          };
        }

        if (song && song.status === 'error') {
          throw new Error('Audio nudge generation failed');
        }

        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}...`);
      } catch (error: any) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }

    throw new Error('Audio nudge generation timed out');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export function createSunoNudgeClient(): SunoNudgeAPI {
  const apiKey = process.env.SUNO_API_KEY || '';
  return new SunoNudgeAPI(apiKey);
}
// Keep the original concise set for deterministic day-based selection, but
// prefer a richer fallback list from `daily-motivations`.
export function getDailySavageQuote(dayNumber: number = 1): string {
  try {
    return getFallbackMotivation(dayNumber);
  } catch (e) {
    // Last-resort hardcoded fallback
    const hardFallback = "You're the plot twist they didn't see coming.";
    return hardFallback;
  }
}
