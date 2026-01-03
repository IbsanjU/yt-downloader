import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url, quality, format } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!ytdl.validateURL(url)) {
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

    // Get video info to extract title for filename with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );
    
    const info = await Promise.race([
      ytdl.getInfo(url, options),
      timeoutPromise
    ]) as ytdl.videoInfo;
    
    const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Determine filter based on format
    let filter: ytdl.Filter = 'videoandaudio';
    let extension = 'mp4';

    if (format === 'mp3') {
      filter = 'audioonly';
      extension = 'mp3';
    } else if (format === 'webm') {
      filter = 'videoandaudio';
      extension = 'webm';
    }

    // Find the best format matching the criteria
    let selectedFormat;
    if (quality && format !== 'mp3') {
      const formats = info.formats.filter(f => 
        f.qualityLabel === quality && 
        f.hasVideo && 
        f.hasAudio &&
        (format === 'webm' ? f.container === 'webm' : f.container === 'mp4')
      );
      selectedFormat = formats[0];
    }

    // Create download stream with options
    const videoStream = selectedFormat
      ? ytdl(url, { format: selectedFormat, ...options })
      : ytdl(url, { filter, quality: 'highest', ...options });

    // Set response headers for file download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${title}.${extension}"`);
    headers.set('Content-Type', format === 'mp3' ? 'audio/mpeg' : `video/${extension}`);

    // Create a readable stream for the response
    const stream = new ReadableStream({
      start(controller) {
        videoStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        videoStream.on('end', () => {
          controller.close();
        });

        videoStream.on('error', (error) => {
          console.error('Stream error:', error);
          controller.error(error);
        });
      },
    });

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error('Error downloading video:', error);
    
    // Enhanced error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Download request timed out. Please try again later.' },
        { status: 504 }
      );
    }
    
    if (errorMessage.includes('age restricted') || errorMessage.includes('age-restricted')) {
      return NextResponse.json(
        { error: 'This video is age-restricted and cannot be downloaded.' },
        { status: 403 }
      );
    }
    
    if (errorMessage.includes('private') || errorMessage.includes('unavailable')) {
      return NextResponse.json(
        { error: 'This video is private or unavailable for download.' },
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
      { error: 'Failed to download video. Please try again.' },
      { status: 500 }
    );
  }
}
