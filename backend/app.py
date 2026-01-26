"""
Business Finder Backend API
Uses completely FREE APIs (no API keys required) to find businesses
and check their website status.

Free APIs Used:
- OpenStreetMap Nominatim (completely free, no API key)
- Overpass API (OpenStreetMap query API, free, no API key)
- Wikipedia API (free, no API key)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from typing import List, Dict, Optional
import time
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration - All FREE APIs (no API keys required!)
NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search'
OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter'
WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php'

# Optional: Google Places API (only if user provides API key)
GOOGLE_PLACES_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY', '')
GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place'


def check_website_status(url: str) -> Dict[str, any]:
    """
    Check if a website is accessible and functional.
    Returns status: 'active', 'down', 'no-website', 'broken-link'
    """
    if not url:
        return {'status': 'no-website', 'accessible': False}
    
    # Normalize URL
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url
    
    try:
        # Try to fetch the website with a timeout
        response = requests.get(
            url,
            timeout=5,
            allow_redirects=True,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        
        if response.status_code == 200:
            # Check if page has meaningful content (not just error pages)
            content = response.text.lower()
            error_indicators = ['404', 'not found', 'error', 'page not found', 'site not found']
            
            if any(indicator in content[:500] for indicator in error_indicators):
                return {'status': 'broken-link', 'accessible': False, 'status_code': response.status_code}
            
            return {'status': 'active', 'accessible': True, 'status_code': response.status_code}
        elif response.status_code in [301, 302, 307, 308]:
            # Redirect - follow it
            return {'status': 'active', 'accessible': True, 'status_code': response.status_code}
        else:
            return {'status': 'down', 'accessible': False, 'status_code': response.status_code}
            
    except requests.exceptions.Timeout:
        return {'status': 'down', 'accessible': False, 'error': 'timeout'}
    except requests.exceptions.ConnectionError:
        return {'status': 'down', 'accessible': False, 'error': 'connection_error'}
    except requests.exceptions.RequestException as e:
        return {'status': 'broken-link', 'accessible': False, 'error': str(e)}
    except Exception as e:
        return {'status': 'unknown', 'accessible': False, 'error': str(e)}


def search_businesses_google_places(location: str, query: str = 'business') -> List[Dict]:
    """
    Search for businesses using Google Places API.
    Requires GOOGLE_PLACES_API_KEY environment variable.
    """
    if not GOOGLE_PLACES_API_KEY:
        return []
    
    businesses = []
    
    try:
        # First, get place_id for the location
        geocode_url = f"{GOOGLE_PLACES_API_URL}/textsearch/json"
        geocode_params = {
            'query': f"{query} in {location}",
            'key': GOOGLE_PLACES_API_KEY,
            'type': 'establishment'
        }
        
        response = requests.get(geocode_url, params=geocode_params, timeout=10)
        data = response.json()
        
        if data.get('status') != 'OK':
            print(f"Google Places API error: {data.get('status')}")
            return []
        
        results = data.get('results', [])
        
        for place in results[:20]:  # Limit to 20 results
            place_id = place.get('place_id')
            if not place_id:
                continue
            
            # Get detailed information
            details_url = f"{GOOGLE_PLACES_API_URL}/details/json"
            details_params = {
                'place_id': place_id,
                'fields': 'name,formatted_address,formatted_phone_number,website,types,business_status',
                'key': GOOGLE_PLACES_API_KEY
            }
            
            details_response = requests.get(details_url, params=details_params, timeout=10)
            details_data = details_response.json()
            
            if details_data.get('status') == 'OK':
                result = details_data.get('result', {})
                
                business = {
                    'id': place_id,
                    'name': result.get('name', 'Unknown'),
                    'address': result.get('formatted_address', ''),
                    'phone': result.get('formatted_phone_number', ''),
                    'website': result.get('website', ''),
                    'types': result.get('types', []),
                    'business_status': result.get('business_status', 'OPERATIONAL')
                }
                
                # Check website status
                website_status = check_website_status(business['website'])
                business['website_status'] = website_status['status']
                business['website_accessible'] = website_status.get('accessible', False)
                
                businesses.append(business)
            
            # Rate limiting - be respectful
            time.sleep(0.1)
        
    except Exception as e:
        print(f"Error searching Google Places: {str(e)}")
    
    return businesses


def search_businesses_nominatim(location: str, query: str = 'business') -> List[Dict]:
    """
    Search for businesses using OpenStreetMap Nominatim (free, no API key needed).
    This is a fallback when Google Places API is not available.
    """
    businesses = []
    
    try:
        # Search for businesses in the location
        params = {
            'q': f"{query} {location}",
            'format': 'json',
            'limit': 20,
            'addressdetails': 1
        }
        
        headers = {
            'User-Agent': 'BusinessFinder/1.0'
        }
        
        response = requests.get(NOMINATIM_API_URL, params=params, headers=headers, timeout=10)
        data = response.json()
        
        for item in data:
            # Extract business information
            business = {
                'id': item.get('place_id', ''),
                'name': item.get('display_name', '').split(',')[0],  # First part is usually the name
                'address': item.get('display_name', ''),
                'phone': '',
                'website': '',
                'types': [],
                'business_status': 'OPERATIONAL',
                'website_status': 'no-website',
                'website_accessible': False
            }
            
            # Try to find website in extras
            extras = item.get('extratags', {})
            if 'website' in extras:
                business['website'] = extras['website']
                website_status = check_website_status(business['website'])
                business['website_status'] = website_status['status']
                business['website_accessible'] = website_status.get('accessible', False)
            
            businesses.append(business)
        
        # Rate limiting for Nominatim
        time.sleep(1)
        
    except Exception as e:
        print(f"Error searching Nominatim: {str(e)}")
    
    return businesses


@app.route('/api/search', methods=['POST'])
def search_businesses():
    """
    Main endpoint to search for businesses.
    Expects JSON: {'location': 'city name', 'query': 'business type (optional)'}
    """
    try:
        data = request.get_json()
        location = data.get('location', '').strip()
        query = data.get('query', 'business').strip()
        
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        businesses = []
        
        # Try Google Places API first (if API key is available)
        if GOOGLE_PLACES_API_KEY:
            print(f"Searching with Google Places API: {location}")
            businesses = search_businesses_google_places(location, query)
        
        # Fallback to Nominatim if Google Places didn't return results or no API key
        if not businesses:
            print(f"Searching with Nominatim: {location}")
            businesses = search_businesses_nominatim(location, query)
        
        # Filter businesses based on website status
        filtered_businesses = []
        for business in businesses:
            status = business.get('website_status', 'no-website')
            if status in ['no-website', 'down', 'broken-link']:
                filtered_businesses.append({
                    'id': business.get('id'),
                    'name': business.get('name'),
                    'address': business.get('address'),
                    'phone': business.get('phone'),
                    'website': business.get('website'),
                    'status': status
                })
        
        return jsonify({
            'success': True,
            'results': filtered_businesses,
            'total': len(filtered_businesses)
        })
        
    except Exception as e:
        print(f"Error in search endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'google_places_configured': bool(GOOGLE_PLACES_API_KEY)
    })


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
