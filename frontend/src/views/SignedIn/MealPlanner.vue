<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import axios from 'axios'
import { watchEffect } from 'vue'
import { useUser } from 'vue-clerk'
import { toast } from 'vue3-toastify'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import MealDetailsModal from '@/components/MealDetailsModal.vue'
import MacroChart from '@/components/MacroChart.vue'

const openInformation = ref(false)

const selectedMeal = ref(null)

const { user } = useUser()
const userId = user.value.id
const API_KEY = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const showMealHistory = ref(false)
const mealHistory = ref([])

const availableMeals = ref([])

// for the onclick of meal card or planned meal
const setMeal = (meal) => {
  selectedMeal.value = meal
  console.log(selectedMeal.value)
  openInformation.value = true
}

const fetchMeals = async () => {
  availableMeals.value = []
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
                calories: response.data.recipe.macros.Calories,
                protein: response.data.recipe.macros.Protein,
                instructions: response.data.recipe.instructions,
                ingredients: response.data.recipe.ingredients,
                id: meal.recipeId,
                type: 'community',
                prepTime: response.data.recipe.prepTime + ' min'
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
                id: meal.id,
                name: meal.title,
                prepTime: meal.readyInMinutes + ' min',
                calories: meal.nutrition.nutrients[0].amount,
                protein: meal.nutrition.nutrients[1].amount,
                ingredients: meal.extendedIngredients.map((ingredient) => ingredient.name),
                instructions: meal.analyzedInstructions[0]?.steps.map((step) => step.step),
                type: 'api'
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

const logMealsAndResetPlan = async () => {
  axios
    .post(`${BACKEND_URL}/update-meal-log`, {
      userId: userId
    })
    .then((response) => {
      fetchScheduledMeals()
      toast.success(`${response.data.message}`, {
        autoClose: 1000
      })
    })
}

const cloneMeal = (meal) => {
  return {
    ...meal,
    dateLogged: Date.now()
  }
}

const removeMeal = (day, mealType, mealId) => {
  weeklyPlan.value[day][mealType] = weeklyPlan.value[day][mealType].filter(
    (meal) => meal.id !== mealId
  )
}

const removeMealPlanned = async (mealId) => {
  axios
    .post(`${BACKEND_URL}/delete-meals-planned`, {
      userId: userId,
      recipeId: mealId
    })
    .then((response) => {
      toast.success('Meal removed from planner', {
        autoClose: 1000
      })
      fetchMeals()
    })
}

const dateRange = ref(null)

const fetchMealHistory = async () => {
  axios
    .post(`${BACKEND_URL}/get-meal-history`, {
      userId: userId,
      dateRange: dateRange.value
        ? {
            start: dateRange.value[0],
            end: dateRange.value[1]
          }
        : null
    })
    .then((response) => {
      mealHistory.value = response.data.mealHistory.sort(
        (a, b) => new Date(b.dateLogged) - new Date(a.dateLogged)
      )
    })
}

const toggleMode = () => {
  showMealHistory.value = !showMealHistory.value
  if (showMealHistory.value) {
    fetchMealHistory()
  }
}

watchEffect(() => {
  if (user.value) {
    console.log(userId)
    fetchMeals()
    fetchScheduledMeals()
    fetchMealHistory()
  }
})
</script>

<template>
  <div class="meal-planner" v-if="!showMealHistory">
    <div class="header">
      <h1>Meal Planner</h1>
      <div class="header-buttons">
        <button class="action-button" @click="logMealsAndResetPlan">Log Your Meals</button>
        <button class="action-button" @click="toggleMode">Meal History</button>
      </div>
    </div>

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
                <template #item="{ element }">
                  <div class="planned-meal-card">
                    <div class="meal-header">
                      <h4 @click="setMeal(element)">{{ element.name }}</h4>
                      <button
                        class="remove-button"
                        @click="removeMeal(day, type, element.id)"
                        title="Remove meal"
                      >
                        ×
                      </button>
                    </div>
                    <div class="meal-details">
                      <span>{{ Number(element.calories).toFixed(2) }} cal</span>
                      <span>{{ element.prepTime }}</span>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Meals Section -->
    <div class="available-meals">
      <div class="meals-header">
        <h2>Meals Planned</h2>
        <span class="info-icon" title="Drag meals from here to plan them in your weekly calendar"
          >ⓘ</span
        >
      </div>
      <draggable
        :list="availableMeals"
        :clone="cloneMeal"
        :group="{ name: 'meals', pull: 'clone', put: false }"
        item-key="id"
        class="meals-list"
        v-if="availableMeals.length > 0"
      >
        <template #item="{ element }">
          <div class="meal-card">
            <div class="meal-header">
              <h5 @click="setMeal(element)">{{ element.name }}</h5>
              <button class="remove-meal-button mx-2 mb-1" @click="removeMealPlanned(element.id)">
                ×
              </button>
            </div>

            <p>Calories: {{ Number(element.calories).toFixed(2) }}</p>
            <p>Protein: {{ Number(element.protein).toFixed(2) }}</p>
            <p>Prep Time: {{ element.prepTime }}</p>
          </div>
        </template>
      </draggable>
      <div v-else class="no-meals-message">No meals planned yet</div>
    </div>
  </div>
  <div class="meal-history" v-else>
    <div class="header">
      <h1>Meal History</h1>
      <button class="action-button" @click="toggleMode">Back to Planner</button>
    </div>

    <div class="date-picker-container">
      <VueDatePicker
        v-model="dateRange"
        range
        :enable-time-picker="false"
        placeholder="Select date range to filter meals"
        :clearable="true"
        @update:model-value="fetchMealHistory"
      />
    </div>

    <div class="meal-history-container">
      <div v-if="mealHistory.length > 0" class="meal-history-grid">
        <div v-for="meal in mealHistory" :key="meal.id" class="meal-history-card">
          <div class="meal-history-content">
            <h3 @click="setMeal(meal)">{{ meal.name }}</h3>
            <div class="meal-history-details">
              <span class="meal-calories">{{ Number(meal.calories).toFixed(2) }} calories</span>
            </div>
            <div class="meal-date">
              {{
                new Date(meal.dateLogged).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-meals-message">
        <p>No meals logged{{ dateRange ? ' for selected date range' : '' }}</p>
      </div>
      <MacroChart v-if="mealHistory.length > 0" :meal-history="mealHistory" />
    </div>
  </div>
  <MealDetailsModal
    v-if="openInformation && selectedMeal"
    :meal="selectedMeal"
    @close-modal="openInformation = false"
  />
</template>

<style scoped>
.meal-planner {
  padding: 20px;
  height: 100vh;
  overflow: auto;
  background-color: rgb(255, 254, 245);
}
.meal-history {
  padding: 20px;
  height: 100vh;
  overflow: auto;
}

h1 {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: bold;
  color: #517470;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
}
.header-buttons {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button {
  background-color: #acbaa1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #517470;
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
  background: rgb(255, 254, 245);
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
  background: #acbaa1;
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

.remove-meal-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  border-radius: 4px;
}

.date-picker-container {
  max-width: 300px;
  margin: 20px 0;
}

.meal-history-container {
  padding: 20px 0;
  background-color: rgb(255, 254, 245);
}

.meal-history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.meal-history-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.meal-history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.meal-history-content {
  padding: 16px;
}

.meal-history-content h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.meal-history-details {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.meal-type {
  background: #acbaa1;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.meal-calories {
  color: #666;
  font-size: 0.9rem;
}

.meal-date {
  color: #888;
  font-size: 0.85rem;
}

.no-meals-message {
  text-align: center;
  color: #666;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
}
.recipe-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 25%;
  z-index: 1000;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 20px;
}

.recipe-post {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
}

.meals-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  color: #517470;
  cursor: help;
  font-size: 1.2rem;
}
</style>
