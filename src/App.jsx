import { useState, useEffect } from 'react'
import './App.css'

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hover, setHover] = useState(0)

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => !readOnly && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// Dish Item Component
const DishItem = ({ dish, onEdit, onDelete }) => {
  return (
    <div className="dish-item">
      <div className="dish-header">
        <h4>{dish.name}</h4>
        <div className="dish-actions">
          <button className="btn-icon" onClick={() => onEdit(dish)}>✏️</button>
          <button className="btn-icon" onClick={() => onDelete(dish.id)}>🗑️</button>
        </div>
      </div>
      <StarRating rating={dish.rating} readOnly />
      {dish.description && <p className="dish-description">{dish.description}</p>}
      {dish.notes && <p className="dish-notes"><em>{dish.notes}</em></p>}
    </div>
  )
}

// Dish Form Component
const DishForm = ({ restaurantId, dish, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    dish || {
      name: '',
      description: '',
      rating: 0,
      notes: ''
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave(restaurantId, {
        ...formData,
        id: dish?.id || Date.now()
      })
    }
  }

  return (
    <form className="dish-form" onSubmit={handleSubmit}>
      <h4>{dish ? 'Edit Dish' : 'Add New Dish'}</h4>
      <input
        type="text"
        placeholder="Dish name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows="2"
      />
      <div className="form-group">
        <label>Rating:</label>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>
      <textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows="2"
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

// Restaurant Card Component
const RestaurantCard = ({ restaurant, onEdit, onDelete, onAddDish, onEditDish, onDeleteDish }) => {
  const [showDishes, setShowDishes] = useState(false)
  const [showDishForm, setShowDishForm] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  const handleSaveDish = (restaurantId, dish) => {
    if (editingDish) {
      onEditDish(restaurantId, dish)
      setEditingDish(null)
    } else {
      onAddDish(restaurantId, dish)
    }
    setShowDishForm(false)
  }

  const handleEditDish = (dish) => {
    setEditingDish(dish)
    setShowDishForm(true)
  }

  return (
    <div className="restaurant-card">
      <div className="restaurant-header">
        <div>
          <h3>{restaurant.name}</h3>
          <p className="cuisine-type">{restaurant.cuisineType}</p>
        </div>
        <div className="restaurant-actions">
          <button className="btn-icon" onClick={() => onEdit(restaurant)}>✏️</button>
          <button className="btn-icon" onClick={() => onDelete(restaurant.id)}>🗑️</button>
        </div>
      </div>

      <div className="restaurant-info">
        <p>🏮 {restaurant.location}</p>
        {restaurant.priceRange && <p>🍱 {restaurant.priceRange}</p>}
        <div className="rating-display">
          <StarRating rating={restaurant.rating} readOnly />
        </div>
      </div>

      {restaurant.notes && (
        <div className="restaurant-notes">
          <p>{restaurant.notes}</p>
        </div>
      )}

      {restaurant.visitDates && restaurant.visitDates.length > 0 && (
        <div className="visit-dates">
          <small>Visited: {restaurant.visitDates.join(', ')}</small>
        </div>
      )}

      <div className="dishes-section">
        <button
          className="btn btn-text"
          onClick={() => setShowDishes(!showDishes)}
        >
          {showDishes ? '🥢 Hide' : '🍣 Show'} Favorite Dishes ({restaurant.dishes?.length || 0})
        </button>

        {showDishes && (
          <div className="dishes-list">
            {restaurant.dishes?.map((dish) => (
              <DishItem
                key={dish.id}
                dish={dish}
                onEdit={handleEditDish}
                onDelete={(dishId) => onDeleteDish(restaurant.id, dishId)}
              />
            ))}

            {showDishForm ? (
              <DishForm
                restaurantId={restaurant.id}
                dish={editingDish}
                onSave={handleSaveDish}
                onCancel={() => {
                  setShowDishForm(false)
                  setEditingDish(null)
                }}
              />
            ) : (
              <button
                className="btn btn-secondary btn-add-dish"
                onClick={() => setShowDishForm(true)}
              >
                🍜 Add Dish
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Restaurant Form Component
const RestaurantForm = ({ restaurant, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    restaurant || {
      name: '',
      cuisineType: '',
      location: '',
      rating: 0,
      priceRange: '',
      notes: '',
      visitDates: [],
      dishes: []
    }
  )

  const [visitDate, setVisitDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() && formData.cuisineType.trim() && formData.location.trim()) {
      onSave({
        ...formData,
        id: restaurant?.id || Date.now()
      })
    }
  }

  const addVisitDate = () => {
    if (visitDate) {
      setFormData({
        ...formData,
        visitDates: [...(formData.visitDates || []), visitDate]
      })
      setVisitDate('')
    }
  }

  const removeVisitDate = (index) => {
    setFormData({
      ...formData,
      visitDates: formData.visitDates.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="restaurant-form" onSubmit={handleSubmit}>
          <h2>{restaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>

          <div className="form-group">
            <label>Restaurant Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Cuisine Type *</label>
            <input
              type="text"
              placeholder="e.g., Italian, Japanese, Mexican"
              value={formData.cuisineType}
              onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              placeholder="Address or neighborhood"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Overall Rating</label>
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <select
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Expensive</option>
              <option value="$$$$">$$$$ - Very Expensive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Visit Dates</label>
            <div className="visit-dates-input">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
              <button type="button" className="btn btn-secondary" onClick={addVisitDate}>
                Add
              </button>
            </div>
            {formData.visitDates && formData.visitDates.length > 0 && (
              <div className="visit-dates-list">
                {formData.visitDates.map((date, index) => (
                  <span key={index} className="visit-date-tag">
                    {date}
                    <button type="button" onClick={() => removeVisitDate(index)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Ambiance, parking, special occasions, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Restaurant</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [restaurants, setRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCuisine, setFilterCuisine] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRestaurants = localStorage.getItem('restaurants')
    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants))
    }
  }, [])

  // Save to localStorage whenever restaurants change
  useEffect(() => {
    localStorage.setItem('restaurants', JSON.stringify(restaurants))
    filterRestaurants()
  }, [restaurants, searchTerm, filterCuisine])

  // Filter restaurants based on search and cuisine filter
  const filterRestaurants = () => {
    let filtered = restaurants

    if (searchTerm) {
      filtered = filtered.filter((restaurant) => {
        const searchLower = searchTerm.toLowerCase()
        const nameMatch = restaurant.name.toLowerCase().includes(searchLower)
        const cuisineMatch = restaurant.cuisineType.toLowerCase().includes(searchLower)
        const dishMatch = restaurant.dishes?.some(dish =>
          dish.name.toLowerCase().includes(searchLower)
        )
        return nameMatch || cuisineMatch || dishMatch
      })
    }

    if (filterCuisine) {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisineType.toLowerCase().includes(filterCuisine.toLowerCase())
      )
    }

    setFilteredRestaurants(filtered)
  }

  useEffect(() => {
    filterRestaurants()
  }, [searchTerm, filterCuisine])

  const handleSaveRestaurant = (restaurant) => {
    if (editingRestaurant) {
      setRestaurants(restaurants.map((r) =>
        r.id === restaurant.id ? restaurant : r
      ))
    } else {
      setRestaurants([...restaurants, restaurant])
    }
    setShowForm(false)
    setEditingRestaurant(null)
  }

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant)
    setShowForm(true)
  }

  const handleDeleteRestaurant = (id) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(restaurants.filter((r) => r.id !== id))
    }
  }

  const handleAddDish = (restaurantId, dish) => {
    setRestaurants(restaurants.map((r) =>
      r.id === restaurantId
        ? { ...r, dishes: [...(r.dishes || []), dish] }
        : r
    ))
  }

  const handleEditDish = (restaurantId, updatedDish) => {
    setRestaurants(restaurants.map((r) =>
      r.id === restaurantId
        ? {
            ...r,
            dishes: r.dishes.map((d) =>
              d.id === updatedDish.id ? updatedDish : d
            )
          }
        : r
    ))
  }

  const handleDeleteDish = (restaurantId, dishId) => {
    setRestaurants(restaurants.map((r) =>
      r.id === restaurantId
        ? { ...r, dishes: r.dishes.filter((d) => d.id !== dishId) }
        : r
    ))
  }

  const cuisineTypes = [...new Set(restaurants.map((r) => r.cuisineType))].filter(Boolean)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Little Bear's Foodie Dreams</h1>
        <p className="tagline">A cozy collection of sushi spots, matcha cafés & dreamy dining experiences</p>
      </header>

      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search for sushi, matcha, or cozy spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingRestaurant(null)
              setShowForm(true)
            }}
          >
            🐻 Add Restaurant
          </button>
        </div>
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">😴💤</div>
            <h3>Little Bear's journal is empty...</h3>
            <p>Wake up and discover some cozy food spots! Add your first restaurant to begin your culinary adventure.</p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onEdit={handleEditRestaurant}
              onDelete={handleDeleteRestaurant}
              onAddDish={handleAddDish}
              onEditDish={handleEditDish}
              onDeleteDish={handleDeleteDish}
            />
          ))
        )}
      </div>

      {showForm && (
        <RestaurantForm
          restaurant={editingRestaurant}
          onSave={handleSaveRestaurant}
          onCancel={() => {
            setShowForm(false)
            setEditingRestaurant(null)
          }}
        />
      )}
    </div>
  )
}

export default App
