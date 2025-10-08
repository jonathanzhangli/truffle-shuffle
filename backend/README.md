# Truffle Shuffle Backend - Foursquare Integration

This is the Python Flask backend that integrates with the Foursquare Places API to discover new restaurants in the Bay Area.

## Setup Instructions

### 1. Install Python Dependencies

Make sure you have Python 3.8+ installed, then install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

Or if you prefer using a virtual environment (recommended):

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your Foursquare API credentials:

```
FOURSQUARE_CLIENT_ID=your_client_id_here
FOURSQUARE_CLIENT_SECRET=your_client_secret_here
```

**To get your Foursquare API credentials:**
1. Go to https://foursquare.com/developers/apps
2. Sign in or create an account
3. Create a new app
4. Copy your Client ID and Client Secret from the app settings

### 3. Run the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5001`

## API Endpoints

### `GET /api/discover`
Fetches restaurants from Foursquare that match little bear's refined tastes (sushi, matcha, Japanese cuisine, cafés, tea houses, Asian fusion).

**Response:**
```json
{
  "restaurants": [...],
  "cached": false,
  "count": 50
}
```

### `GET /api/health`
Health check endpoint to verify the API is running and configured.

**Response:**
```json
{
  "status": "healthy",
  "api_configured": true
}
```

### `POST /api/clear-cache`
Clears the 24-hour cache to force a fresh data fetch from Foursquare.

**Response:**
```json
{
  "message": "Cache cleared successfully"
}
```

## Features

- **24-hour caching**: Results are cached for 24 hours to avoid excessive API calls
- **Bay Area focus**: Searches within 25km radius of San Francisco
- **Refined tastes**: Filters for Japanese, sushi, ramen, cafés, and tea houses
- **Rich data**: Returns name, address, rating, distance, photos, and more

## Troubleshooting

**Error: "Foursquare API credentials not configured"**
- Make sure you created the `.env` file in the `backend` directory
- Verify your Client ID and Client Secret are correct

**CORS errors from frontend**
- Make sure the backend is running on port 5001
- The Flask app has CORS enabled for all origins

**No restaurants found**
- Check your API key is valid
- Try clearing the cache with `POST /api/clear-cache`
- Check the Foursquare API status at https://developer.foursquare.com/
