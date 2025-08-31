# Google Play Store Comments Scraper API

A robust backend service that fetches user reviews and comments from Google Play Store for any given Android app. Built with Node.js, Express, and Cheerio for web scraping.

## 🚀 Features

- **Single App Comments**: Fetch comments for a specific app by its Google Play Store ID
- **Batch Processing**: Get comments for multiple apps in a single request
- **Comment Statistics**: Generate analytics and insights from comment data
- **Flexible Sorting**: Sort comments by recent, rating, or helpfulness
- **Rate Limiting**: Built-in protection against abuse
- **Robust Parsing**: Multiple fallback strategies for reliable data extraction
- **Input Validation**: Comprehensive validation for app IDs and parameters

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Internet connection to access Google Play Store

## 🛠️ Installation

1. **Clone or download the project**
   ```bash
   cd google-play-comments-scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your preferred settings (optional)

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### 1. Get Comments for a Single App

```http
GET /api/comments/{appId}?limit={number}&sort={sortOption}
```

**Parameters:**
- `appId` (path): Google Play Store app ID (e.g., `com.whatsapp`)
- `limit` (query): Maximum number of comments to return (1-200, default: 50)
- `sort` (query): Sort order - `recent`, `rating`, or `helpfulness` (default: `recent`)

**Example Request:**
```bash
curl "http://localhost:3000/api/comments/com.whatsapp?limit=20&sort=rating"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "appId": "com.whatsapp",
    "totalComments": 20,
    "comments": [
      {
        "text": "Great app! Very useful for communication.",
        "rating": 5,
        "date": "2024-01-15",
        "author": "John Doe",
        "helpful": 12,
        "source": "scraped"
      }
    ],
    "metadata": {
      "scrapedAt": "2024-01-15T10:30:00.000Z",
      "limit": 20,
      "sort": "rating"
    }
  }
}
```

### 2. Batch Comments for Multiple Apps

```http
POST /api/comments/batch
```

**Request Body:**
```json
{
  "appIds": ["com.whatsapp", "com.instagram.android", "com.twitter.android"],
  "limit": 15,
  "sort": "recent"
}
```

**Parameters:**
- `appIds` (array): Array of app IDs (max 10 apps)
- `limit` (number): Comments per app (1-100, default: 20)
- `sort` (string): Sort order (default: `recent`)

### 3. Get Comment Statistics

```http
GET /api/comments/{appId}/stats?limit={number}
```

**Parameters:**
- `appId` (path): Google Play Store app ID
- `limit` (query): Sample size for statistics (1-200, default: 100)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "appId": "com.whatsapp",
    "stats": {
      "totalComments": 100,
      "ratingDistribution": {
        "1": 5,
        "2": 8,
        "3": 15,
        "4": 25,
        "5": 47
      },
      "dateDistribution": {
        "2024-01": 45,
        "2023-12": 55
      },
      "averageRating": 4.11,
      "totalRating": 411
    },
    "metadata": {
      "scrapedAt": "2024-01-15T10:30:00.000Z",
      "sampleSize": 100
    }
  }
}
```

### 4. Health Check

```http
GET /health
```

Returns server status and uptime information.

## 🔍 How to Find App IDs

Google Play Store app IDs can be found in the URL when viewing an app:

1. Go to [Google Play Store](https://play.google.com)
2. Search for your desired app
3. Click on the app
4. The URL will look like: `https://play.google.com/store/apps/details?id=com.whatsapp`
5. The part after `id=` is your app ID: `com.whatsapp`

**Common App IDs:**
- WhatsApp: `com.whatsapp`
- Instagram: `com.instagram.android`
- Twitter: `com.twitter.android`
- Facebook: `com.facebook.katana`
- YouTube: `com.google.android.youtube`

## ⚠️ Important Notes

### Rate Limiting
- **Single App**: 100 requests per 15 minutes per IP
- **Batch Requests**: Limited to 10 apps per request
- **Comments per Request**: Maximum 200 comments per app

### Legal Considerations
- This tool is for educational and research purposes
- Respect Google's Terms of Service and robots.txt
- Implement reasonable delays between requests
- Consider using official APIs when available

### Technical Limitations
- Web scraping may break if Google changes their HTML structure
- Some apps may have limited or no public reviews
- Network issues may affect scraping reliability

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive parameter validation
- **Error Handling**: Secure error responses

## 🔧 Configuration

The application can be configured through environment variables. See `env.example` for all available options:

```bash
# Server settings
PORT=3000
NODE_ENV=development

# Scraping behavior
REQUEST_DELAY=1000
MAX_COMMENTS_PER_REQUEST=200
ENABLE_FALLBACK_PARSING=true

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## 🚀 Deployment

### Environment Variables
Set production environment variables:
```bash
NODE_ENV=production
PORT=8080
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start server.js --name "playstore-scraper"
pm2 startup
pm2 save
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is provided as-is for educational purposes. Users are responsible for ensuring compliance with applicable laws and terms of service. The developers are not responsible for any misuse of this tool.

## 🆘 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your app ID format
3. Ensure you're not hitting rate limits
4. Check if Google Play Store is accessible from your location

## 🔮 Future Enhancements

- [ ] Caching layer for improved performance
- [ ] Database integration for comment storage
- [ ] Sentiment analysis of comments
- [ ] Export functionality (CSV, JSON)
- [ ] Webhook support for real-time updates
- [ ] Advanced filtering options
- [ ] Comment analytics dashboard
# probable-goggles
