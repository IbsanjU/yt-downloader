import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { createTimeoutPromise, REQUEST_TIMEOUT_MS } from '../utils/timeout';

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

    // Configure request options with User-Agent headers
    const options = {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
    };

    // Get video info with timeout
    const timeout = createTimeoutPromise(REQUEST_TIMEOUT_MS);
    let info;
    try {
      info = await Promise.race([
        ytdl.getInfo(url, options),
        timeout.promise
      ]);
    } finally {
      timeout.clear();
    }
    
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
    
    // Enhanced error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. Please try again later.' },
        { status: 504 }
      );
    }
    
    if (errorMessage.includes('age restricted') || errorMessage.includes('age-restricted')) {
      return NextResponse.json(
        { error: 'This video is age-restricted and cannot be accessed.' },
        { status: 403 }
      );
    }
    
    if (errorMessage.includes('private') || errorMessage.includes('unavailable')) {
      return NextResponse.json(
        { error: 'This video is private or unavailable.' },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (errorMessage.includes('geo') || errorMessage.includes('location')) {
      return NextResponse.json(
        { error: 'This video is not available in your region.' },
        { status: 451 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch video information. The video may be unavailable or private.' },
      { status: 500 }
    );
  }
}
