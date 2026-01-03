'use client';

import { useState } from 'react';
import { VideoInfo } from './VideoDownloader';
import Image from 'next/image';

interface VideoCardProps {
  video: VideoInfo;
  onRemove: (videoId: string) => void;
}

export default function VideoCard({ video, onRemove }: VideoCardProps) {
  const [selectedQuality, setSelectedQuality] = useState(video.availableQualities[0] || '720p');
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'webm' | 'mp3'>('mp4');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const formatDuration = (seconds: string) => {
    const sec = parseInt(seconds);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: video.url,
          quality: selectedFormat === 'mp3' ? undefined : selectedQuality,
          format: selectedFormat,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setDownloadError(data.error || 'Download failed');
        setDownloading(false);
        return;
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloading(false);
    } catch {
      setDownloadError('Failed to download video. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Thumbnail */}
        <div className="md:w-64 md:flex-shrink-0">
          <div className="relative h-48 md:h-full w-full">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {video.channel} • {formatDuration(video.duration)}
              </p>
            </div>
            <button
              onClick={() => onRemove(video.videoId)}
              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as 'mp4' | 'webm' | 'mp3')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={downloading}
              >
                <option value="mp4">MP4 (Video)</option>
                <option value="webm">WEBM (Video)</option>
                <option value="mp3">MP3 (Audio Only)</option>
              </select>
            </div>

            {selectedFormat !== 'mp3' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality
                </label>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={downloading}
                >
                  {video.availableQualities.map((quality) => (
                    <option key={quality} value={quality}>
                      {quality}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {downloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            )}
          </button>

          {downloadError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{downloadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
