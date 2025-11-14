import { NextRequest, NextResponse } from "next/server";

interface GenerateSongRequest {
  story: string;
  style: "sad" | "savage" | "healing";
}

declare global {
  var songs: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSongRequest = await request.json();
    const { story, style } = body;

    if (!story || story.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Story is too short" },
        { status: 400 }
      );
    }

    const songId = generateSongId();
    
    const songData = {
      id: songId,
      title: generateSongTitle(story, style),
      story: story,
      style: style,
      previewUrl: "/audio/sample-preview.mp3",
      fullUrl: `/audio/sample-full-${songId}.mp3`,
      createdAt: new Date().toISOString(),
    };

    global.songs = global.songs || {};
    (global as any).songs[songId] = songData;

    return NextResponse.json({
      success: true,
      songId: songId,
      message: "Song generated successfully",
    });
  } catch (error) {
    console.error("Error generating song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate song" },
      { status: 500 }
    );
  }
}

function generateSongId(): string {
  return `song-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateSongTitle(story: string, style: string): string {
  const words = story.split(" ").slice(0, 5);
  const stylePrefix = {
    sad: "Tears of",
    savage: "Burn It Down:",
    healing: "Moving On From",
  };
  
  return `${stylePrefix[style as keyof typeof stylePrefix]} ${words.join(" ").substring(0, 30)}...`;
}
