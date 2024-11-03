<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import axios from 'axios'
import { watchEffect } from 'vue'
import { useUser } from 'vue-clerk'

const { user } = useUser()
const userId = user.value.id
const API_KEY = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

// Replace this with the actual meals planned from database
const availableMeals = ref([])

const fetchMeals = async () => {
  axios
    .post(`${BACKEND_URL}/get-meals-planned`, {
      userId: userId
    })
    .then((response) => {
      // iterate through the mealsPlanned, and perform detailed search for each meal planned in DB or API
      // for DB meals, use recipeId to get recipe from DB
      // for API meals, collate IDs to fetch by bulk to reduce API calls
      const mealsPlanned = response.data.mealsPlanned
      const apiMealIds = []
      for (const meal of mealsPlanned) {
        if (meal.type == 'community') {
          axios
            .post(`${BACKEND_URL}/get-recipe-by-id`, {
              recipeId: meal.recipeId
            })
            .then((response) => {
              //   console.log(response.data)
              availableMeals.value.push({
                name: response.data.recipe.name,
                //calories: response.data.recipe.macros.calories ?? 0,
                calories: 0,
                ingredients: response.data.recipe.ingredients,
                id: meal.recipeId,
                prepTime: '0 min'
              })
            })
            .catch((error) => {
              console.error('Error fetching recipe:', error)
            })
        } else {
          apiMealIds.push(meal.recipeId)
        }
      }
      if (apiMealIds.length > 0) {
        axios
          .get('https://api.spoonacular.com/recipes/informationBulk', {
            params: {
              ids: apiMealIds.join(','),
              includeNutrition: true,
              apiKey: API_KEY
            }
          })
          .then((response) => {
            const apiMeals = response.data
            for (const meal of apiMeals) {
              availableMeals.value.push({
                name: meal.title,
                prepTime: meal.readyInMinutes + ' min',
                calories: meal.nutrition.nutrients[0].amount,
                ingredients: meal.extendedIngredients.map((ingredient) => ingredient.name)
              })
            }
          })
          .catch((error) => {
            console.error('Error fetching recipes:', error)
          })
      }
    })
    .catch((error) => {
      console.error('Error fetching meals:', error)
    })
}

// to change to fetch from DB by user
const weeklyPlan = ref({
  Monday: { breakfast: [], lunch: [], dinner: [] },
  Tuesday: { breakfast: [], lunch: [], dinner: [] },
  Wednesday: { breakfast: [], lunch: [], dinner: [] },
  Thursday: { breakfast: [], lunch: [], dinner: [] },
  Friday: { breakfast: [], lunch: [], dinner: [] },
  Saturday: { breakfast: [], lunch: [], dinner: [] },
  Sunday: { breakfast: [], lunch: [], dinner: [] }
})

const fetchScheduledMeals = async () => {
  axios
    .post(`${BACKEND_URL}/get-weekly-plan`, {
      userId: userId
    })
    .then((response) => {
      // Create a new object that copies the current weeklyPlan
      const updatedPlan = { ...weeklyPlan.value }

      // Update only the days and meal types that exist in the response
      if (response.data.weeklyPlan) {
        Object.entries(response.data.weeklyPlan).forEach(([day, meals]) => {
          Object.entries(meals).forEach(([mealType, mealList]) => {
            updatedPlan[day][mealType] = mealList
          })
        })
      }

      // Assign the updated plan back to weeklyPlan
      weeklyPlan.value = updatedPlan
    })
    .catch((error) => {
      console.error('Error fetching scheduled meals:', error)
    })
}

watch(
  weeklyPlan,
  async (newPlan) => {
    if (!newPlan) return

    console.log('Sending to backend:', {
      userId: userId,
      weeklyPlan: newPlan
    })
    try {
      await axios.post(`${BACKEND_URL}/update-weekly-plan`, {
        userId: userId,
        weeklyPlan: newPlan
      })
    } catch (error) {
      console.error('Error updating weekly plan:', error)
    }
  },
  { deep: true }
)

watchEffect(() => {
  if (user.value) {
    console.log(userId)
    fetchMeals()
    fetchScheduledMeals()
  }
})

const shoppingList = computed(() => {
  const ingredients = new Set()
  Object.values(weeklyPlan.value).forEach((day) => {
    Object.values(day).forEach((mealType) => {
      mealType.forEach((meal) => {
        meal.ingredients.forEach((ingredient) => ingredients.add(ingredient))
      })
    })
  })
  return Array.from(ingredients)
})

// Update clone function to include new properties
const cloneMeal = (meal, day) => {
  const dayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7
  }

  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc
  const diff = dayMap[day] - (dayOfWeek === 0 ? 7 : dayOfWeek)
  const targetDate = new Date(today.setDate(today.getDate() + diff))

  return {
    ...meal,
    dateEaten: targetDate.getTime()
  }
}

// Add remove meal function
const removeMeal = (day, mealType, mealId) => {
  weeklyPlan.value[day][mealType] = weeklyPlan.value[day][mealType].filter(
    (meal) => meal.id !== mealId
  )
}
</script>

<template>
  <div class="meal-planner">
    <h1>Meal Planner</h1>

    <div class="planner-container">
      <!-- Weekly Calendar Section -->
      <div class="weekly-calendar">
        <div v-for="(dayMeals, day) in weeklyPlan" :key="day" class="day-column">
          <div class="day-header">{{ day }}</div>
          <div class="meal-slots">
            <div v-for="(meals, type) in dayMeals" :key="type" class="meal-type-section">
              <div class="meal-type-header">{{ type }}</div>
              <draggable
                v-model="weeklyPlan[day][type]"
                group="meals"
                item-key="id"
                class="meal-drop-zone"
              >
                <!-- To change to component -->
                <template #item="{ element }">
                  <div class="planned-meal-card">
                    <div class="meal-header">
                      <h4>{{ element.name }}</h4>
                      <button
                        class="remove-button"
                        @click="removeMeal(day, type, element.id)"
                        title="Remove meal"
                      >
                        ×
                      </button>
                    </div>
                    <div class="meal-details">
                      <span>{{ element.calories }} cal</span>
                      <span>{{ element.prepTime }}</span>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>

      <!-- Shopping List Section -->
      <div class="shopping-list">
        <h2>Shopping List</h2>
        <ul>
          <li v-for="ingredient in shoppingList" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Available Meals Section -->
    <div class="available-meals">
      <h2>Available Meals</h2>
      <draggable
        :list="availableMeals"
        :clone="cloneMeal"
        :group="{ name: 'meals', pull: 'clone', put: false }"
        item-key="id"
        class="meals-list"
      >
        <template #item="{ element }">
          <div class="meal-card">
            <h3>{{ element.name }}</h3>
            <p>Calories: {{ element.calories }}</p>
            <p>Prep Time: {{ element.prepTime }}</p>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>
.meal-planner {
  padding: 20px;
  height: 100vh;
  overflow: auto;
}

.planner-container {
  display: flex;
  gap: 24px;
  margin: 24px 0;
  overflow-x: auto;
  padding-bottom: 16px;
}

.available-meals {
  margin-top: 20px;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.meals-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meal-card {
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.meal-type-section {
  margin-bottom: 16px;
}

.meal-type-section h4 {
  margin: 8px 0;
  color: #666;
  text-transform: capitalize;
}

.shopping-list {
  width: 250px;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  flex-shrink: 0;
}

.shopping-list ul {
  list-style: none;
  padding: 0;
}

.shopping-list li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.meal-type {
  font-size: 0.8rem;
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.weekly-calendar {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.day-column {
  min-width: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  background: #523e2c;
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.meal-slots {
  padding: 12px;
}

.meal-type-header {
  background: #e9ecef;
  color: #495057;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: capitalize;
  font-size: 0.9rem;
}

.meal-drop-zone {
  min-height: 100px;
  background: #ffffff;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 8px;
  transition: background-color 0.2s;
}

.meal-drop-zone:hover {
  background: #f1f3f5;
  border-color: #adb5bd;
}

.planned-meal-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.planned-meal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.planned-meal-card h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #343a40;
}

.meal-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  border-radius: 4px;
  opacity: 0;
  transition:
    opacity 0.2s,
    background-color 0.2s;
}

.remove-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.planned-meal-card:hover .remove-button {
  opacity: 1;
}
</style>
