'use client';

import { useState, FormEvent } from 'react';

interface UrlInputProps {
  onAddVideos: (urls: string[]) => void;
  loading: boolean;
}

export default function UrlInput({ onAddVideos, loading }: UrlInputProps) {
  const [urlInput, setUrlInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!urlInput.trim()) {
      setValidationError('Please enter at least one URL');
      return;
    }

    // Split by newlines or commas to support multiple URLs
    const urls = urlInput
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);

    // Validate all URLs
    const invalidUrls = urls.filter(url => !validateYouTubeUrl(url));
    
    if (invalidUrls.length > 0) {
      setValidationError(
        `Invalid YouTube URL${invalidUrls.length > 1 ? 's' : ''}: ${invalidUrls.join(', ')}`
      );
      return;
    }

    onAddVideos(urls);
    setUrlInput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            YouTube Video URL(s)
          </label>
          <textarea
            id="url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter YouTube URLs (one per line or separated by commas)
Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
            disabled={loading}
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Add Videos'
          )}
        </button>
      </form>
    </div>
  );
}
