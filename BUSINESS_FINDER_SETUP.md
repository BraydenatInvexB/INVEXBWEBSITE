# Business Finder Setup Guide

This guide will help you set up the powerful Business Finder feature that uses Google Maps and other free APIs to find businesses without websites or with non-functional websites.

## Architecture

- **Frontend**: React component (`src/components/BusinessFinder.jsx`)
- **Backend**: Python Flask API (`backend/app.py`)
- **APIs Used**:
  - Google Places API (primary, recommended)
  - OpenStreetMap Nominatim (fallback, free, no API key needed)

## Quick Start

### Step 1: Set Up Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure API Key (Optional but Recommended):**
   
   Get a free Google Places API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Enable "Places API" in the API Library
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API key
   
   Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Add your API key:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

4. **Run the backend server:**
   ```bash
   python app.py
   ```
   
   The server will start on `http://localhost:5000`

### Step 2: Configure Frontend

1. **Update backend URL in `.env` file (root directory):**
   ```bash
   VITE_BACKEND_URL=http://localhost:5000
   ```
   
   For production, update this to your deployed backend URL:
   ```bash
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

2. **Restart your frontend dev server:**
   ```bash
   npm run dev
   ```

## How It Works

### Business Search Flow

1. **User enters location** (e.g., "Johannesburg, South Africa")
2. **Backend searches** using Google Places API or OpenStreetMap
3. **Website status check** for each business found:
   - Checks if website exists
   - Tests if website is accessible
   - Identifies broken links or down websites
4. **Filters results** to show only businesses that need websites:
   - No website
   - Website is down
   - Website link is broken
5. **Returns filtered results** to frontend

### Website Status Detection

The backend checks each business website by:
- Making HTTP requests with timeout
- Checking response status codes
- Detecting error pages (404, etc.)
- Handling redirects properly
- Identifying connection errors

## Deployment Options

### Option 1: Local Development (Both Frontend & Backend)

**Backend:**
```bash
cd backend
python app.py
```

**Frontend:**
```bash
npm run dev
```

Update `.env`:
```
VITE_BACKEND_URL=http://localhost:5000
```

### Option 2: Deploy Backend to Heroku

1. **Install Heroku CLI** and login
2. **Create Heroku app:**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Add API key:**
   ```bash
   heroku config:set GOOGLE_PLACES_API_KEY=your_key_here
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Update frontend `.env`:**
   ```
   VITE_BACKEND_URL=https://your-app-name.herokuapp.com
   ```

### Option 3: Deploy Backend to Railway

1. **Connect GitHub repo** to Railway
2. **Set root directory** to `backend`
3. **Add environment variable:**
   - `GOOGLE_PLACES_API_KEY` = your key
4. **Deploy automatically**
5. **Update frontend `.env`** with Railway URL

### Option 4: Deploy Backend to Render

1. **Create new Web Service** on Render
2. **Connect your repo**
3. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Environment: Python 3
4. **Add environment variable:**
   - `GOOGLE_PLACES_API_KEY` = your key
5. **Deploy**
6. **Update frontend `.env`** with Render URL

## Free Tier Limits

### Google Places API
- **Free Credit**: $200/month (covers ~40,000 requests)
- **Cost per request**: ~$0.005
- **Best for**: Production use with many searches

### OpenStreetMap Nominatim
- **Free**: Yes, completely free
- **Rate Limit**: 1 request/second (required by usage policy)
- **Best for**: Development, fallback, low-volume use

### Website Status Checks
- **Free**: No limits
- **Consideration**: Be respectful of target servers
- **Timeout**: 5 seconds per check

## Testing

### Test Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "google_places_configured": true
}
```

### Test Business Search

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"location": "Johannesburg, South Africa", "query": "restaurant"}'
```

## Troubleshooting

### Backend Issues

1. **"Module not found" errors:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Port already in use:**
   - Change port in `.env`: `PORT=5001`
   - Or kill process using port 5000

3. **CORS errors:**
   - Ensure `flask-cors` is installed
   - Check backend is running
   - Verify frontend URL matches backend CORS settings

### Frontend Issues

1. **"Failed to fetch" errors:**
   - Check backend is running
   - Verify `VITE_BACKEND_URL` in `.env`
   - Restart dev server after changing `.env`

2. **No results returned:**
   - Check browser console for errors
   - Verify backend logs for API errors
   - Try a more specific location (city + country)

### API Issues

1. **Google Places API errors:**
   - Verify API key is correct
   - Check API is enabled in Google Cloud Console
   - Verify billing is set up (free tier still requires billing account)
   - Check API quota limits

2. **Slow responses:**
   - Website checks take time (5s timeout each)
   - Consider reducing number of businesses checked
   - Use caching for repeated searches

## Advanced Configuration

### Customize Search Parameters

Edit `backend/app.py` to customize:
- Number of results returned
- Website check timeout
- Rate limiting delays
- Additional business types

### Add More Data Sources

You can extend the backend to use:
- Yelp Fusion API
- Foursquare Places API
- Facebook Graph API
- Custom business directories

## Security Notes

1. **Never commit `.env` files** to git
2. **Use environment variables** for API keys
3. **Restrict API key** to specific domains/IPs in Google Cloud Console
4. **Monitor API usage** to prevent unexpected charges

## Support

For issues or questions:
1. Check backend logs: `python app.py` (shows errors)
2. Check browser console: F12 → Console tab
3. Verify API keys are set correctly
4. Test backend health endpoint first
