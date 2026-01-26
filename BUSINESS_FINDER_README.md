# 🎯 Business Finder - Complete Implementation

A powerful tool that finds businesses in any location and identifies those without websites or with non-functional websites. Perfect for telesales teams to find potential clients!

## ✨ Features

- 🔍 **Smart Business Search**: Uses Google Places API and OpenStreetMap
- 🌐 **Website Status Detection**: Automatically checks if websites are:
  - Missing (no website)
  - Down (server not responding)
  - Broken (404 errors, invalid links)
- 📍 **Location-Based Search**: Find businesses in any city/area
- 🏷️ **Business Type Filtering**: Search for specific business types
- 🎨 **Beautiful UI**: Clean, modern interface with status badges
- ⚡ **Fast & Efficient**: Optimized API calls with rate limiting

## 📁 Files Created

### Backend (Python Flask)
- `backend/app.py` - Main Flask API server
- `backend/requirements.txt` - Python dependencies
- `backend/.env.example` - Environment variables template
- `backend/README.md` - Backend documentation
- `backend/start.sh` - Quick start script
- `backend/Procfile` - Heroku deployment config
- `backend/runtime.txt` - Python version for deployment

### Frontend (React)
- `src/components/BusinessFinder.jsx` - Updated with API integration
- `src/components/BusinessFinder.css` - Styling

### Documentation
- `BUSINESS_FINDER_SETUP.md` - Complete setup guide
- `BUSINESS_FINDER_README.md` - This file

## 🚀 Quick Start

### 1. Backend Setup (5 minutes)

```bash
cd backend
./start.sh
```

Or manually:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GOOGLE_PLACES_API_KEY
python app.py
```

### 2. Frontend Configuration

Add to your root `.env` file:
```
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Get Google Places API Key (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project or select existing
3. Enable "Places API"
4. Create API Key
5. Add to `backend/.env`

**Free Tier**: $200/month credit (~40,000 requests)

### 4. Test It!

1. Start backend: `cd backend && python app.py`
2. Start frontend: `npm run dev`
3. Login as telesales user
4. Go to "Business Finder" tab
5. Search for businesses!

## 🎯 How It Works

```
User Input (Location)
    ↓
Backend API (Python Flask)
    ↓
Google Places API / OpenStreetMap
    ↓
Find Businesses
    ↓
Check Each Website Status
    ↓
Filter: No Website / Down / Broken
    ↓
Return Results to Frontend
```

## 📊 API Endpoints

### POST /api/search
Search for businesses in a location.

**Request:**
```json
{
  "location": "Johannesburg, South Africa",
  "query": "restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "place_id",
      "name": "Business Name",
      "address": "123 Main St",
      "phone": "+27 11 123 4567",
      "website": "https://example.com",
      "status": "down"
    }
  ],
  "total": 1
}
```

### GET /api/health
Check if backend is running.

## 🌍 Deployment Options

### Backend Deployment

**Heroku:**
```bash
cd backend
heroku create your-app-name
heroku config:set GOOGLE_PLACES_API_KEY=your_key
git push heroku main
```

**Railway:**
- Connect GitHub repo
- Set root to `backend`
- Add `GOOGLE_PLACES_API_KEY` env var
- Deploy

**Render:**
- Create Web Service
- Build: `pip install -r requirements.txt`
- Start: `python app.py`
- Add env vars

### Frontend Deployment

Update `.env` with your backend URL:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

## 🔧 Configuration

### Backend Environment Variables

```bash
GOOGLE_PLACES_API_KEY=your_key_here  # Optional but recommended
PORT=5000                             # Default port
```

### Frontend Environment Variables

```bash
VITE_BACKEND_URL=http://localhost:5000  # Backend API URL
```

## 📈 Usage Tips

1. **Be Specific**: Use "City, Country" format for better results
   - ✅ "Johannesburg, South Africa"
   - ❌ "Joburg"

2. **Business Types**: Add specific types for better filtering
   - "restaurant"
   - "retail shop"
   - "law firm"
   - "dentist"

3. **Rate Limits**: 
   - Google Places: ~40,000 requests/month free
   - OpenStreetMap: 1 request/second

4. **Website Checks**: Each check takes ~5 seconds, so be patient

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 5000 is available

**No results returned:**
- Verify API key is set correctly
- Try more specific location
- Check backend logs for errors

**CORS errors:**
- Ensure `flask-cors` is installed
- Check backend is running
- Verify frontend URL matches backend CORS settings

**Slow responses:**
- Website checks take time (5s each)
- Consider reducing number of businesses
- Use caching for repeated searches

## 🔒 Security

- ✅ Never commit `.env` files
- ✅ Use environment variables for API keys
- ✅ Restrict API keys to specific domains
- ✅ Monitor API usage

## 📚 Additional Resources

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [OpenStreetMap Nominatim](https://nominatim.org/release-docs/develop/api/Overview/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🎉 Success!

You now have a powerful business finder that:
- ✅ Searches real businesses using Google Maps
- ✅ Checks website status automatically
- ✅ Filters to show only businesses needing websites
- ✅ Works with free APIs
- ✅ Ready for production deployment

Happy hunting! 🚀
