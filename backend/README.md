# Business Finder Backend API

A Python Flask backend service that searches for businesses and checks their website status using Google Places API and OpenStreetMap.

## Features

- 🔍 Search businesses by location using Google Places API
- 🌍 Fallback to OpenStreetMap Nominatim (free, no API key needed)
- ✅ Check website status (active, down, broken-link, no-website)
- 🚀 Fast and efficient with rate limiting
- 🔒 CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys (Optional but Recommended)

1. Get a free Google Places API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Places API"
   - Create credentials (API Key)
   - Copy your API key

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your API key to `.env`:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

**Note:** The service will work without Google Places API key using OpenStreetMap, but results will be less detailed.

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/search

Search for businesses in a location.

**Request:**
```json
{
  "location": "Johannesburg, South Africa",
  "query": "restaurant"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "place_id_123",
      "name": "Business Name",
      "address": "123 Main St, Johannesburg",
      "phone": "+27 11 123 4567",
      "website": "https://example.com",
      "status": "down"  // or "no-website", "broken-link", "active"
    }
  ],
  "total": 1
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "google_places_configured": true
}
```

## Deployment Options

### Option 1: Local Development
Run `python app.py` and access at `http://localhost:5000`

### Option 2: Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set GOOGLE_PLACES_API_KEY=your_key
git push heroku main
```

### Option 3: Deploy to Railway
1. Connect your GitHub repo
2. Add environment variable `GOOGLE_PLACES_API_KEY`
3. Deploy automatically

### Option 4: Deploy to Render
1. Create new Web Service
2. Add environment variable `GOOGLE_PLACES_API_KEY`
3. Deploy

## Rate Limiting

- Google Places API: ~0.1s delay between requests
- OpenStreetMap Nominatim: 1s delay (required by their usage policy)
- Website status checks: 5s timeout per check

## Free Tier Limits

- **Google Places API**: $200 free credit/month (covers ~40,000 requests)
- **OpenStreetMap Nominatim**: Free, but requires 1 request/second max
- **Website Checks**: No limits, but respect target servers

## Troubleshooting

1. **No results returned**: 
   - Check if location is spelled correctly
   - Try a more specific location (city + country)
   - Verify API key is set correctly

2. **CORS errors**: 
   - Ensure `flask-cors` is installed
   - Check frontend is calling correct backend URL

3. **Slow responses**: 
   - Website status checks can take time
   - Consider caching results
   - Reduce number of businesses checked
