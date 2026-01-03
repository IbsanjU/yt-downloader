import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

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

    // Get video info to extract title for filename
    const info = await ytdl.getInfo(url);
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

    // Create download stream
    const videoStream = selectedFormat
      ? ytdl(url, { format: selectedFormat })
      : ytdl(url, { filter, quality: 'highest' });

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
    return NextResponse.json(
      { error: 'Failed to download video. Please try again.' },
      { status: 500 }
    );
  }
}
