import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Foursquare API configuration
FOURSQUARE_CLIENT_ID = os.getenv('FOURSQUARE_CLIENT_ID')
FOURSQUARE_CLIENT_SECRET = os.getenv('FOURSQUARE_CLIENT_SECRET')
FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/search'

# Cache configuration (simple in-memory cache)
cache = {
    'data': None,
    'timestamp': None,
    'ttl': timedelta(hours=24)
}

def get_cached_data():
    """Check if we have valid cached data"""
    if cache['data'] and cache['timestamp']:
        if datetime.now() - cache['timestamp'] < cache['ttl']:
            return cache['data']
    return None

def set_cached_data(data):
    """Store data in cache"""
    cache['data'] = data
    cache['timestamp'] = datetime.now()

@app.route('/api/discover', methods=['GET'])
def discover_restaurants():
    """
    Fetch recently opened Bay Area restaurants from Foursquare API
    Filters for: sushi, Japanese cuisine, ramen, matcha/tea cafés, Asian fusion
    """

    # Check cache first
    cached_data = get_cached_data()
    if cached_data:
        return jsonify({
            'restaurants': cached_data,
            'cached': True,
            'count': len(cached_data)
        })

    if not FOURSQUARE_CLIENT_ID or not FOURSQUARE_CLIENT_SECRET:
        return jsonify({
            'error': 'Foursquare API credentials not configured',
            'message': 'Please add FOURSQUARE_CLIENT_ID and FOURSQUARE_CLIENT_SECRET to the .env file'
        }), 500

    try:
        # Foursquare v2 category IDs for our bear's refined tastes
        # 4bf58dd8d48988d111941735: Japanese Restaurant
        # 4bf58dd8d48988d1d2941735: Sushi Restaurant
        # 55a59bace4b013909087cb24: Ramen Restaurant
        # 4bf58dd8d48988d16d941735: Café
        # 52e81612bcbc57f1066b7a0c: Bubble Tea Shop
        categoryId = "4bf58dd8d48988d111941735,4bf58dd8d48988d1d2941735,55a59bace4b013909087cb24,4bf58dd8d48988d16d941735,52e81612bcbc57f1066b7a0c"

        params = {
            'll': '37.7749,-122.4194',  # San Francisco coordinates
            'radius': 25000,  # 25km radius to cover Bay Area
            'categoryId': categoryId,
            'limit': 50,
            'client_id': FOURSQUARE_CLIENT_ID,
            'client_secret': FOURSQUARE_CLIENT_SECRET,
            'v': '20231010'  # API version date
        }

        response = requests.get(FOURSQUARE_BASE_URL, params=params)
        response.raise_for_status()

        data = response.json()
        restaurants = []

        # Parse and format the results (v2 API format)
        for venue in data.get('response', {}).get('venues', []):
            restaurant = {
                'id': venue.get('id'),
                'name': venue.get('name'),
                'address': format_address_v2(venue.get('location', {})),
                'neighborhood': venue.get('location', {}).get('neighborhood', ''),
                'cuisine': get_cuisine_type_v2(venue.get('categories', [])),
                'rating': venue.get('rating', 0) / 2 if venue.get('rating') else 0,  # Convert to 5-star scale
                'distance': round(venue.get('location', {}).get('distance', 0) / 1609.34, 1),  # Convert meters to miles
                'price': venue.get('price', {}).get('tier', 2) if venue.get('price') else 2,  # Price tier (1-4)
                'photo': None,  # v2 requires separate photo endpoint call
                'hours': 'Hours not available'  # v2 requires separate hours endpoint call
            }
            restaurants.append(restaurant)

        # Cache the results
        set_cached_data(restaurants)

        return jsonify({
            'restaurants': restaurants,
            'cached': False,
            'count': len(restaurants)
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Failed to fetch data from Foursquare',
            'message': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

def format_address(location):
    """Format the address from Foursquare location object (v3)"""
    parts = []
    if location.get('address'):
        parts.append(location['address'])
    if location.get('locality'):
        parts.append(location['locality'])
    if location.get('region'):
        parts.append(location['region'])
    return ', '.join(parts) if parts else 'Address not available'

def format_address_v2(location):
    """Format the address from Foursquare location object (v2)"""
    parts = []
    if location.get('address'):
        parts.append(location['address'])
    if location.get('city'):
        parts.append(location['city'])
    if location.get('state'):
        parts.append(location['state'])
    return ', '.join(parts) if parts else 'Address not available'

def get_cuisine_type(categories):
    """Extract primary cuisine type from categories (v3)"""
    if not categories:
        return 'Restaurant'

    # Map category names to our bear's preferences
    category_map = {
        'sushi': 'Sushi',
        'japanese': 'Japanese',
        'ramen': 'Ramen',
        'tea': 'Tea House',
        'café': 'Café',
        'coffee': 'Café',
        'asian': 'Asian Fusion'
    }

    primary_category = categories[0].get('name', 'Restaurant')

    # Check if it matches any of our preferred categories
    for key, value in category_map.items():
        if key in primary_category.lower():
            return value

    return primary_category

def get_cuisine_type_v2(categories):
    """Extract primary cuisine type from categories (v2)"""
    if not categories:
        return 'Restaurant'

    # Map category names to our bear's preferences
    category_map = {
        'sushi': 'Sushi',
        'japanese': 'Japanese',
        'ramen': 'Ramen',
        'tea': 'Tea House',
        'café': 'Café',
        'coffee': 'Café',
        'bubble tea': 'Bubble Tea',
        'asian': 'Asian Fusion'
    }

    primary_category = categories[0].get('name', 'Restaurant')

    # Check if it matches any of our preferred categories
    for key, value in category_map.items():
        if key in primary_category.lower():
            return value

    return primary_category

def get_photo_url(photos):
    """Get the first photo URL if available"""
    if photos and len(photos) > 0:
        photo = photos[0]
        prefix = photo.get('prefix', '')
        suffix = photo.get('suffix', '')
        # Construct photo URL with desired dimensions
        return f"{prefix}300x300{suffix}"
    return None

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Truffle Shuffle Backend API',
        'endpoints': {
            'health': '/api/health',
            'discover': '/api/discover',
            'clear_cache': '/api/clear-cache (POST)'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'api_configured': bool(FOURSQUARE_CLIENT_ID and FOURSQUARE_CLIENT_SECRET)
    })

@app.route('/api/clear-cache', methods=['POST'])
def clear_cache():
    """Clear the cache to force fresh data fetch"""
    cache['data'] = None
    cache['timestamp'] = None
    return jsonify({'message': 'Cache cleared successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
