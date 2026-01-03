'use client';

import { useState } from 'react';
import UrlInput from './UrlInput';
import VideoCard from './VideoCard';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  videoId: string;
  availableQualities: string[];
  formats: Array<{
    quality: string;
    container: string;
    hasAudio: boolean;
    hasVideo: boolean;
    itag: number;
  }>;
  url: string;
}

export default function VideoDownloader() {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAddVideos = async (urls: string[]) => {
    setLoading(true);
    setError('');

    const newVideos: VideoInfo[] = [];
    const errors: string[] = [];

    for (const url of urls) {
      try {
        const response = await fetch('/api/video-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!response.ok) {
          const data = await response.json();
          errors.push(`${url}: ${data.error}`);
          continue;
        }

        const videoInfo = await response.json();
        newVideos.push({ ...videoInfo, url: url.trim() });
      } catch {
        errors.push(`${url}: Failed to fetch video info`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    setVideos([...videos, ...newVideos]);
    setLoading(false);
  };

  const handleRemoveVideo = (videoId: string) => {
    setVideos(videos.filter(v => v.videoId !== videoId));
  };

  return (
    <div className="space-y-6">
      <UrlInput onAddVideos={handleAddVideos} loading={loading} />
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 whitespace-pre-line text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {videos.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            onRemove={handleRemoveVideo}
          />
        ))}
      </div>

      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No videos</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add YouTube video URLs to get started
          </p>
        </div>
      )}
    </div>
  );
}
