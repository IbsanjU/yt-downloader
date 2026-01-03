import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

// Validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  try {
    return ytdl.validateURL(url);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    
    // Extract available formats
    const formats = info.formats
      .filter(format => format.hasVideo && format.hasAudio)
      .map(format => ({
        quality: format.qualityLabel || 'Unknown',
        container: format.container,
        hasAudio: format.hasAudio,
        hasVideo: format.hasVideo,
        itag: format.itag,
      }));

    // Get unique qualities
    const uniqueQualities = Array.from(
      new Set(formats.map(f => f.quality))
    ).sort((a, b) => {
      const aNum = parseInt(a) || 0;
      const bNum = parseInt(b) || 0;
      return bNum - aNum;
    });

    // Extract video metadata
    const videoInfo = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url || '',
      duration: info.videoDetails.lengthSeconds,
      channel: info.videoDetails.author.name,
      videoId: info.videoDetails.videoId,
      availableQualities: uniqueQualities,
      formats: formats,
    };

    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video information. The video may be unavailable or private.' },
      { status: 500 }
    );
  }
}
