import VideoDownloader from '@/components/VideoDownloader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            YouTube Video Downloader
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Download YouTube videos in different resolutions and formats
          </p>
        </div>
        <VideoDownloader />
      </div>
    </div>
  );
}
