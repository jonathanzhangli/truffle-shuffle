import { useState, useEffect } from 'react'
import './Discover.css'

const Discover = ({ existingRestaurants, onAddToFavorites }) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cached, setCached] = useState(false)
  const [sortBy, setSortBy] = useState('rating') // rating, distance
  const [filterCuisine, setFilterCuisine] = useState('')

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5001/api/discover')
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }

      const data = await response.json()
      setRestaurants(data.restaurants || [])
      setCached(data.cached || false)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearCacheAndRefresh = async () => {
    try {
      await fetch('http://localhost:5001/api/clear-cache', { method: 'POST' })
      fetchRestaurants()
    } catch (err) {
      console.error('Error clearing cache:', err)
      fetchRestaurants()
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const sortedAndFilteredRestaurants = () => {
    let filtered = [...restaurants]

    // Filter by cuisine if selected
    if (filterCuisine) {
      filtered = filtered.filter(r =>
        r.cuisine.toLowerCase().includes(filterCuisine.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating
      } else if (sortBy === 'distance') {
        return a.distance - b.distance
      }
      return 0
    })

    return filtered
  }

  const isInFavorites = (restaurantId) => {
    return existingRestaurants.some(r => r.foursquareId === restaurantId)
  }

  const handleAddToFavorites = (restaurant) => {
    const newRestaurant = {
      id: Date.now(),
      foursquareId: restaurant.id,
      name: restaurant.name,
      cuisineType: restaurant.cuisine,
      location: restaurant.address,
      rating: restaurant.rating,
      priceRange: '$'.repeat(restaurant.price || 2),
      notes: `Discovered via Foursquare • ${restaurant.neighborhood || ''}`,
      visitDates: [],
      dishes: []
    }
    onAddToFavorites(newRestaurant)
  }

  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisine))].filter(Boolean)

  // Loading state
  if (loading) {
    return (
      <div className="discover-container">
        <div className="discover-loading">
          <div className="sleeping-bear">🐻</div>
          <div className="zzz">💤 💤 💤</div>
          <p>Little bear is exploring the Bay Area...</p>
          <p className="loading-subtext">Searching for sushi, matcha & cozy spots</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="discover-container">
        <div className="discover-error">
          <div className="error-icon">🐻😰</div>
          <h3>Oops! Little bear got lost...</h3>
          <p>{error}</p>
          <p className="error-hint">
            Make sure the Python backend is running on port 5001 and your Foursquare API key is configured.
          </p>
          <button className="btn btn-primary" onClick={fetchRestaurants}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const displayedRestaurants = sortedAndFilteredRestaurants()

  return (
    <div className="discover-container">
      <div className="discover-header">
        <div className="discover-title">
          <h2>🔍 Discover New Spots</h2>
          <p>Recently opened Bay Area restaurants matching little bear's refined tastes</p>
        </div>
        {cached && (
          <div className="cache-indicator">
            <span>📦 Cached results</span>
          </div>
        )}
      </div>

      <div className="discover-controls">
        <div className="discover-filters">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="discover-select"
          >
            <option value="rating">Sort by Rating</option>
            <option value="distance">Sort by Distance</option>
          </select>

          <select
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
            className="discover-select"
          >
            <option value="">All Cuisines</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-secondary"
          onClick={clearCacheAndRefresh}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {displayedRestaurants.length === 0 ? (
        <div className="discover-empty">
          <div className="empty-icon">🐻🔍</div>
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters or refresh to fetch new results</p>
        </div>
      ) : (
        <div className="discover-grid">
          {displayedRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="discover-card">
              {restaurant.photo && (
                <div className="discover-card-image">
                  <img src={restaurant.photo} alt={restaurant.name} />
                </div>
              )}

              <div className="discover-card-content">
                <div className="discover-card-header">
                  <h3>{restaurant.name}</h3>
                  <span className="cuisine-badge">{restaurant.cuisine}</span>
                </div>

                <div className="discover-card-info">
                  <p className="discover-address">📍 {restaurant.address}</p>
                  {restaurant.neighborhood && (
                    <p className="discover-neighborhood">🏘️ {restaurant.neighborhood}</p>
                  )}
                  <p className="discover-distance">📏 {restaurant.distance} miles away</p>
                  <p className="discover-price">{'$'.repeat(restaurant.price || 2)}</p>
                </div>

                <div className="discover-rating">
                  <div className="bear-paws">
                    {[1, 2, 3, 4, 5].map((paw) => (
                      <span
                        key={paw}
                        className={paw <= Math.round(restaurant.rating) ? 'paw filled' : 'paw'}
                      >
                        🐾
                      </span>
                    ))}
                  </div>
                  <span className="rating-number">{restaurant.rating.toFixed(1)}/5</span>
                </div>

                {isInFavorites(restaurant.id) ? (
                  <button className="btn btn-in-favorites" disabled>
                    ✓ Already in Favorites
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToFavorites(restaurant)}
                  >
                    🐻 Add to My Favorites
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="discover-footer">
        <p>
          Found {displayedRestaurants.length} restaurant{displayedRestaurants.length !== 1 ? 's' : ''} •
          Powered by Foursquare
        </p>
      </div>
    </div>
  )
}

export default Discover
