import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SongStyle } from '@/lib/lyrics';
import { createOpenRouterClient } from '@/lib/openrouter';
import { createSunoClient } from '@/lib/suno';

interface GenerateSongRequest {
  story: string;
  style: SongStyle;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSongRequest = await request.json();
    const { story, style } = body;

    if (!story || story.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Story is too short' },
        { status: 400 }
      );
    }

    const validStyles: SongStyle[] = ['sad', 'savage', 'healing', 'vibe', 'meme'];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { success: false, error: 'Invalid style selected' },
        { status: 400 }
      );
    }

    console.log('Step 1: Generating song prompt with OpenRouter...');
    
    let promptResult;
    try {
      const openRouterClient = createOpenRouterClient();
      promptResult = await openRouterClient.generateSongPrompt({
        extractedText: story,
        style,
      });
      
      if (!promptResult.prompt || promptResult.prompt.length < 20) {
        throw new Error('Generated lyrics are too short');
      }
      
      console.log('Step 2: Prompt generated:', promptResult.title);
    } catch (promptError) {
      console.error('OpenRouter prompt generation failed:', promptError);
      
      promptResult = {
        title: `${style.charAt(0).toUpperCase() + style.slice(1)} HeartHeal Song`,
        tags: `${style}, emotional, heartbreak, healing`,
        prompt: `A ${style} song about heartbreak, emotional healing, and moving forward.\n${story.substring(0, 200)}`,
      };
      
      console.log('Using fallback prompt template');
    }

    let previewUrl = '';
    let fullUrl = '';
    let lyrics = promptResult.prompt;
    let duration = 30;

    const sunoClient = createSunoClient();
    
    try {
      console.log('Step 3: Generating music with Suno AI...');
      
      const musicResult = await sunoClient.generateSong({
        prompt: promptResult.prompt,
        title: promptResult.title,
        tags: promptResult.tags,
        style,
      });

      previewUrl = musicResult.audioUrl;
      fullUrl = musicResult.videoUrl || musicResult.audioUrl;
      duration = musicResult.duration || 60;
      
      if (musicResult.lyrics && musicResult.lyrics.length > lyrics.length) {
        lyrics = musicResult.lyrics;
      }

      console.log('Music generated successfully');
    } catch (musicError) {
      console.warn('Suno music generation failed, using placeholder:', musicError);
      
      previewUrl = '/audio/placeholder-preview.mp3';
      fullUrl = '/audio/placeholder-full.mp3';
      duration = 10;
    }

    const song = await prisma.song.create({
      data: {
        title: promptResult.title,
        story,
        style,
        lyrics: lyrics,
        genre: promptResult.tags,
        mood: style,
        previewUrl,
        fullUrl,
        isPurchased: false,
      },
    });

    return NextResponse.json({
      success: true,
      songId: song.id,
      title: promptResult.title,
      lyrics: lyrics,
      message: 'Song generated successfully',
    });
  } catch (error) {
    console.error('Error generating song:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate song',
      },
      { status: 500 }
    );
  }
}
