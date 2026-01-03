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
- **@distube/ytdl-core** for YouTube video extraction

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

3. (Optional) Configure YouTube cookies to bypass bot detection:

YouTube may block automated requests with "Sign in to confirm you're not a bot" error. To fix this, you need to configure YouTube cookies:

**Step 1:** Install [EditThisCookie](http://www.editthiscookie.com/) extension in your browser (Chrome/Edge).

**Step 2:** Go to [YouTube](https://www.youtube.com/) and log in with your account (use a dedicated account for this purpose).

**Step 3:** Click on the EditThisCookie extension icon and click the "Export" button (looks like a clipboard icon).

**Step 4:** Your cookies will be copied to your clipboard as a JSON array.

**Step 5:** Create a `.env.local` file in the project root and add:
```bash
YOUTUBE_COOKIES='[{"domain":".youtube.com","expirationDate":1234567890,"hostOnly":false,"httpOnly":true,"name":"CONSENT","path":"/","sameSite":"no_restriction","secure":true,"session":false,"value":"YES+..."},{"domain":".youtube.com","name":"VISITOR_INFO1_LIVE","value":"..."}]'
```

Paste the entire JSON array from your clipboard as the value (wrapped in single quotes). The actual array will be much longer with many cookie entries - paste all of them.

**Important Notes:**
- Paste ALL cookies from the clipboard - don't remove or edit any entries
- Don't log out by clicking the logout button on YouTube, as it will expire your cookies
- Use the same IP address consistently to keep cookies alive longer
- Keep your cookies private and never commit them to version control (`.env.local` is in `.gitignore` by default)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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
- Bot detection by YouTube

## Troubleshooting

### "Sign in to confirm you're not a bot" Error

This error occurs when YouTube detects automated requests. To fix it:

1. **Configure YouTube cookies** (Recommended): Follow the cookie setup instructions in the Installation section above.

2. **Wait it out**: YouTube's rate limiting usually expires within a few hours or days.

3. **Use a VPN or proxy**: Sometimes changing your IP address can help.

### Cookies Not Working

If you've configured cookies but still getting errors:

- Make sure the cookies JSON is valid (check for syntax errors)
- Ensure you're using the same IP address as when you exported the cookies
- Don't log out from the YouTube account on your browser
- Try exporting fresh cookies from YouTube
- Verify the `.env.local` file is in the project root directory

### Other Common Issues

- **Video unavailable**: The video may be private, deleted, or region-restricted
- **Age-restricted videos**: These require cookie authentication
- **Timeout errors**: The video server may be slow or overloaded; try again later

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

