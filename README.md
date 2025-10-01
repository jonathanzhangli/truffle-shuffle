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
- **LocalStorage Persistence**: All your data is saved locally in your browser
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Clean UI**: Modern, food-friendly design with warm colors

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

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

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Usage

### Adding a Restaurant

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

### Adding Dishes

1. Click on a restaurant card to expand the dishes section
2. Click "+ Add Dish"
3. Enter dish details:
   - Dish name (required)
   - Description
   - Rating (1-5 stars)
   - Notes
4. Click "Save"

### Searching and Filtering

- Use the search bar to find restaurants by name, cuisine type, or dish name
- Use the cuisine filter dropdown to filter by specific cuisine types
- Combine search and filter for more refined results

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

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties for theming
- **LocalStorage API** - Data persistence

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This is a personal project. Feel free to use and modify as needed.