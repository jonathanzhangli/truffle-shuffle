# truffle-shuffle

An application to showcase cool food spots I've been to.

## Overview

Truffle Shuffle is a personal restaurant and favorite dishes tracker built with React. Keep track of your favorite restaurants, rate them, add notes about your visits, and remember the best dishes you've tried at each location.

## Features

- **Restaurant Management**: Add, edit, and delete restaurants with detailed information
- **Dish Tracking**: Track specific dishes you loved at each restaurant
- **Star Ratings**: Rate both restaurants (1-5 stars) and individual dishes
- **Search & Filter**: Search by restaurant name, cuisine type, or dish name
- **Visit History**: Keep track of when you visited each restaurant
- **Personal Notes**: Add notes about ambiance, price range, parking, and more
- **🆕 Discover Feature**: Find new restaurants in the Bay Area via Foursquare API
  - Searches for sushi, Japanese cuisine, matcha cafés, tea houses, and Asian fusion
  - Shows ratings, distance, photos, and detailed information
  - One-click add to your favorites from discovered restaurants
  - 24-hour caching to optimize API usage
- **LocalStorage Persistence**: All your data is saved locally in your browser
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Clean UI**: Modern, food-friendly "Little Bear" themed design with warm colors

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Python 3.8+ (for the Discover feature backend)
- Foursquare API key (for the Discover feature)

### Frontend Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd truffle-shuffle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Backend Installation (Optional - for Discover Feature)

The Discover feature requires a Python backend to connect to the Foursquare API.

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your Foursquare API credentials:
   - Copy `.env.example` to `.env`
   - Get your credentials from [Foursquare Developers](https://foursquare.com/developers/apps)
   - Add your client ID and secret to the `.env` file:
     ```
     FOURSQUARE_CLIENT_ID=your_client_id_here
     FOURSQUARE_CLIENT_SECRET=your_client_secret_here
     ```

5. Start the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5001`

> **Note**: The frontend will work without the backend, but the Discover feature will show an error message if the backend is not running.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Usage

### My Restaurants Tab

#### Adding a Restaurant

1. Click the "+ Add Restaurant" button
2. Fill in the restaurant details:
   - Name (required)
   - Cuisine type (required)
   - Location (required)
   - Overall rating (1-5 stars)
   - Price range ($, $$, $$$, $$$$)
   - Visit dates
   - Personal notes
3. Click "Save Restaurant"

#### Adding Dishes

1. Click on a restaurant card to expand the dishes section
2. Click "+ Add Dish"
3. Enter dish details:
   - Dish name (required)
   - Description
   - Rating (1-5 stars)
   - Notes
4. Click "Save"

#### Searching and Filtering

- Use the search bar to find restaurants by name, cuisine type, or dish name
- Use the cuisine filter dropdown to filter by specific cuisine types
- Combine search and filter for more refined results

### Discover Tab

The Discover feature helps you find new restaurants in the Bay Area that match your tastes.

1. Click the "🔍 Discover" tab
2. Browse through discovered restaurants with:
   - Photos and ratings (displayed as bear paws 🐾)
   - Distance from San Francisco
   - Cuisine type and price range
   - Address and neighborhood information
3. Filter and sort results:
   - Sort by rating or distance
   - Filter by cuisine type
4. Add restaurants to your favorites:
   - Click "🐻 Add to My Favorites" on any restaurant
   - The restaurant will be automatically added to your collection
   - You'll be switched back to the "My Restaurants" tab
5. Refresh results:
   - Click the "🔄 Refresh" button to clear the cache and fetch new restaurants

## Data Structure

Your restaurant data includes:
- Restaurant name, cuisine type, and location
- Overall restaurant rating and price range
- Array of favorite dishes with individual ratings and notes
- Visit dates and general notes
- All data is stored in your browser's localStorage

## Extending the Application

The application is built with modular components, making it easy to extend:

- **Add new fields**: Update the form components and data structure in `src/App.jsx`
- **Add photos**: Extend the restaurant/dish data structure to include image URLs
- **Export data**: Add functionality to export your restaurant list as JSON or CSV
- **Import data**: Add functionality to import restaurant data from other sources
- **Social features**: Add the ability to share favorite restaurants with friends

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties for theming
- **LocalStorage API** - Data persistence

### Backend (Discover Feature)
- **Python 3.8+** - Backend runtime
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP library for API calls
- **python-dotenv** - Environment variable management
- **Foursquare Places API** - Restaurant data source

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This is a personal project. Feel free to use and modify as needed.