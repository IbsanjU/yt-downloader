# YouTube Video Downloader

A Next.js application that allows users to download YouTube videos in different resolutions and formats.

## Features

- **URL Input**: Accept single or multiple YouTube video URLs
- **URL Validation**: Client and server-side validation of YouTube URLs
- **Video Information**: Display video metadata including title, thumbnail, duration, and channel name
- **Multiple Resolutions**: Choose from available resolutions (360p, 720p, 1080p, 4K, etc.)
- **Multiple Formats**: Support for MP4, WEBM video formats and MP3 audio format
- **Responsive Design**: Clean, modern UI that works on all devices
- **Error Handling**: Comprehensive error handling for invalid URLs and failed downloads
- **Loading States**: Visual feedback during video info fetching and downloads

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ytdl-core** for YouTube video extraction

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IbsanjU/yt-downloader.git
cd yt-downloader
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter one or more YouTube video URLs in the input field (one per line or separated by commas)
2. Click "Add Videos" to fetch video information
3. For each video, select your preferred format (MP4, WEBM, or MP3)
4. If downloading video, select the desired quality/resolution
5. Click "Download" to start downloading the video

## Building for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

### POST `/api/video-info`
Fetch video metadata and available formats.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": "180",
  "channel": "Channel Name",
  "videoId": "...",
  "availableQualities": ["1080p", "720p", "480p"],
  "formats": [...]
}
```

### POST `/api/download`
Download video in specified format and quality.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "quality": "720p",
  "format": "mp4"
}
```

**Response:** Binary stream of the video file

## Error Handling

The application handles various error scenarios:
- Invalid YouTube URLs
- Unavailable or private videos
- Network errors
- Download failures

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

