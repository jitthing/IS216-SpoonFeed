<script setup>
import { ref, onMounted, computed, watch, watchEffect } from 'vue'
import { useUser } from 'vue-clerk'
import axios from '@/axios'
import RecipeCard from '@/components/Card.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Sidebar from '@/components/Sidebar.vue'
import RecipePost from '@/components/RecipePost.vue'

const { user, isLoaded } = useUser()
const activeTab = ref('created')
const recipes = ref([])
const savedRecipes = ref({
  community: [],
  api: []
})
const selectedRecipe = ref({
  community: {},
  api: {}
})
const openRecipe = ref(false)
const isLoading = ref(true)
const selectedDate = ref(null)
const showCalendar = ref(false)
const isDevelopment = computed(() => import.meta.env.MODE === 'development')
const fridgeIngredients = ref([])
const currentIngredient = ref('')
const suggestedRecipes = ref([])
const ingredientSuggestions = ref([])
const showSuggestions = ref(false)
const userId = ref('')
const userName = ref('')
const userEmail = ref('')

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

watchEffect(() => {
  if (user.value) {
    userId.value = user.value.id
    userName.value = user.value.firstName
    userEmail.value = user.value.emailAddresses[0].emailAddress
  }
})

// Fetch created recipes
const fetchCreatedRecipes = async () => {
  try {
    console.log('Fetching created recipes for user:', user.value?.id)
    const response = await axios.get(`${BACKEND_URL}/get-recipes`)
    const allRecipes = response.data.recipes

    const userRecipes = Object.values(allRecipes).filter(
      (recipe) => recipe.authorId === user.value?.id
    )

    // Log each recipe with its extracted timestamp
    userRecipes.forEach((recipe) => {
      const timestampMatch = recipe.imageUrl.match(/-(\d+)\?/)
      if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1])
        const date = new Date(timestamp)
        console.log('Recipe:', recipe.name, 'Date:', date)
      }
    })

    recipes.value = userRecipes
  } catch (error) {
    console.error('Error fetching created recipes:', error)
    recipes.value = []
  }
}

// Fetch saved recipes
const fetchSavedRecipes = async () => {
  try {
    console.log('Fetching saved recipes for user:', user.value?.id)

    const userResponse = await axios.post(`${BACKEND_URL}/check-user`, {
      userId: user.value?.id,
      firstName: user.value?.firstName
    })

    console.log('Full user response:', userResponse.data)

    if (userResponse.data?.userData) {
      const communityIds = userResponse.data.userData.CommunitySaved || []
      const apiIds = userResponse.data.userData.ApiSaved || []

      console.log('Community IDs:', communityIds)
      console.log('API IDs:', apiIds)

      // Fetch community recipes
      if (communityIds.length > 0) {
        console.log('Fetching community recipes with IDs:', communityIds)
        const communityResponse = await axios.post(`${BACKEND_URL}/get-community-saved`, {
          recipeIds: communityIds
        })

        console.log('Raw community response:', communityResponse.data)

        if (communityResponse.data.recipes && communityResponse.data.recipes.length > 0) {
          const communityRecipes = communityResponse.data.recipes.map((recipe) => ({
            ...recipe,
            type: 'community'
          }))
          savedRecipes.value.community = communityRecipes
          console.log('Processed community recipes:', savedRecipes.value.community)
        } else {
          console.log('No recipes found in community response')
          savedRecipes.value.community = []
        }
      } else {
        console.log('No community IDs found')
        savedRecipes.value.community = []
      }

      // Fetch Spoonacular API recipes
      if (apiIds.length > 0) {
        const apiResponse = await axios.get(`https://api.spoonacular.com/recipes/informationBulk`, {
          params: {
            ids: apiIds.join(','),
            apiKey: import.meta.env.VITE_APP_SPOONACULAR_KEY
          }
        })
        // Add type field to API recipes
        const apiRecipes = (apiResponse.data || []).map((recipe) => ({
          ...recipe,
          type: 'api'
        }))
        savedRecipes.value.api = apiRecipes
        console.log('Saved API recipes:', savedRecipes.value.api)
      } else {
        savedRecipes.value.api = []
      }
    }
  } catch (error) {
    console.error('Error in fetchSavedRecipes:', error.response || error)
    savedRecipes.value = { community: [], api: [] }
  }
}

// Filter recipes by date
const filteredRecipes = computed(() => {
  if (!selectedDate.value) {
    if (activeTab.value === 'created') {
      return recipes.value
    } else {
      // Return separate arrays for community and API recipes
      return {
        community: savedRecipes.value.community,
        api: savedRecipes.value.api
      }
    }
  }

  const selected = new Date(selectedDate.value)
  const startOfDay = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate(),
    0,
    0,
    0
  )
  const endOfDay = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate(),
    23,
    59,
    59
  )

  if (activeTab.value === 'created') {
    return recipes.value.filter((recipe) => {
      const timestampMatch = recipe.imageUrl?.match(/-(\d+)\?/)
      if (!timestampMatch) return false
      const timestamp = parseInt(timestampMatch[1])
      const recipeDate = new Date(timestamp)
      return recipeDate >= startOfDay && recipeDate <= endOfDay
    })
  } else {
    // Return filtered community recipes and all API recipes separately
    return {
      community: savedRecipes.value.community.filter((recipe) => {
        const timestampMatch = recipe.imageUrl?.match(/-(\d+)\?/)
        if (!timestampMatch) return false
        const timestamp = parseInt(timestampMatch[1])
        const recipeDate = new Date(timestamp)
        return recipeDate >= startOfDay && recipeDate <= endOfDay
      }),
      api: savedRecipes.value.api
    }
  }
})

const clearDateFilter = () => {
  selectedDate.value = null
}

const setRecipe = async (recipe) => {
  try {
    if (activeTab.value === 'fridge' || recipe.type === 'api') {
      // Handle API recipes (including fridge tab)
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey: import.meta.env.VITE_APP_SPOONACULAR_KEY
          }
        }
      )

      selectedRecipe.value = {
        api: {
          id: response.data.id,
          title: response.data.title,
          image: response.data.image,
          summary: response.data.summary,
          instructions: response.data.instructions,
          extendedIngredients: response.data.extendedIngredients,
          readyInMinutes: response.data.readyInMinutes,
          servings: response.data.servings,
          type: 'api'
        },
        community: null
      }
    } else {
      // Handle community recipes
      selectedRecipe.value = {
        api: null,
        community: {
          id: recipe.id,
          name: recipe.name,
          imageUrl: recipe.imageUrl,
          description: recipe.description,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
          readyInMinutes: recipe.readyInMinutes || 0,
          servings: recipe.servings || 0,
          author: recipe.author,
          authorId: recipe.authorId,
          comments: recipe.comments || [],
          numSaves: recipe.numSaves || 0
        }
      }
    }
    openRecipe.value = true
  } catch (error) {
    console.error('Error in setRecipe:', error)
    toast.error('Failed to load recipe details. Please try again.')
  }
}

const closeModal = () => {
  openRecipe.value = false
}

onMounted(async () => {
  if (user.value) {
    isLoading.value = true
    await Promise.all([fetchCreatedRecipes(), fetchSavedRecipes()])
    isLoading.value = false
  }
})

// Watch for tab changes to refresh data
watch(activeTab, async (newTab) => {
  console.log('Tab changed to:', newTab)
  if (newTab === 'fridge') return // Don't load anything for fridge tab

  isLoading.value = true
  try {
    if (newTab === 'saved') {
      await fetchSavedRecipes()
    } else {
      await fetchCreatedRecipes()
    }
  } catch (error) {
    console.error(`Error fetching ${newTab} recipes:`, error)
  } finally {
    isLoading.value = false
  }
})

const searchIngredients = async () => {
  if (currentIngredient.value.length < 2) {
    showSuggestions.value = false
    return
  }

  try {
    const response = await axios.get('https://api.spoonacular.com/food/ingredients/autocomplete', {
      params: {
        query: currentIngredient.value,
        number: 5, // Show top 5 suggestions
        apiKey: import.meta.env.VITE_APP_SPOONACULAR_KEY
      }
    })
    // For example, typing "cury" might suggest "curry", "curry leaves", etc.
    ingredientSuggestions.value = response.data.map((item) => item.name)
    showSuggestions.value = true
  } catch (error) {
    console.error('Error fetching ingredient suggestions:', error)
    showSuggestions.value = false
  }
}

const selectIngredient = (ingredient) => {
  currentIngredient.value = ingredient
  showSuggestions.value = false
  addIngredient()
}

const addIngredient = () => {
  const ingredient = currentIngredient.value.trim().toLowerCase()
  if (ingredient && !fridgeIngredients.value.includes(ingredient)) {
    fridgeIngredients.value.push(ingredient)
    currentIngredient.value = ''
    showSuggestions.value = false
  }
}

const removeIngredient = (index) => {
  fridgeIngredients.value.splice(index, 1)
}

const findRecipes = async () => {
  if (!fridgeIngredients.value.length) return

  isLoading.value = true
  try {
    // Using the complex search endpoint instead
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        includeIngredients: fridgeIngredients.value.join(','),
        instructionsRequired: true,
        fillIngredients: true,
        addRecipeInformation: true,
        number: 12,
        sort: 'max-used-ingredients',
        apiKey: import.meta.env.VITE_APP_SPOONACULAR_KEY
      }
    })

    suggestedRecipes.value = response.data.results

    console.log('Found recipes:', suggestedRecipes.value)
  } catch (error) {
    console.error('Error finding recipes:', error)
    if (error.response?.status === 402) {
      alert('API daily limit reached. Please try again tomorrow.')
    } else {
      alert('Error finding recipes. Please try again later.')
    }
    suggestedRecipes.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="profile-container" v-if="isLoaded">
    <div class="profile-header">
      <h2>My Profile</h2>
      <div class="tab-container">
        <button
          :class="{ active: activeTab === 'created' }"
          @click="
            () => {
              if (!isLoading.value) activeTab = 'created'
            }
          "
          :disabled="isLoading.value"
        >
          Created
        </button>
        <button
          :class="{ active: activeTab === 'saved' }"
          @click="
            () => {
              if (!isLoading.value) activeTab = 'saved'
            }
          "
          :disabled="isLoading.value"
        >
          Saved
        </button>
        <button
          :class="{ active: activeTab === 'fridge' }"
          @click="
            () => {
              if (!isLoading.value) activeTab = 'fridge'
            }
          "
          :disabled="isLoading.value"
        >
          My Fridge
        </button>
      </div>
    </div>

    <!-- Calendar Filter -->
    <div v-if="activeTab !== 'fridge'" class="calendar-section">
      <button @click="showCalendar = !showCalendar" class="calendar-toggle">
        {{ showCalendar ? 'Hide Calendar' : 'Show Calendar' }}
      </button>
      <div v-if="showCalendar" class="calendar-container">
        <VueDatePicker
          v-model="selectedDate"
          :enable-time-picker="false"
          :auto-apply="true"
          placeholder="Select Date"
        />
        <button v-if="selectedDate" @click="clearDateFilter" class="clear-filter">
          Clear Filter
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <div v-if="isLoading" class="loading-state">Loading...</div>
      <div v-else>
        <!-- Created Tab -->
        <div v-if="activeTab === 'created'">
          <div v-if="filteredRecipes.length === 0" class="empty-state">
            <p>{{ selectedDate ? 'No recipes found for this date' : 'No recipes created yet!' }}</p>
          </div>
          <div v-else class="recipes-grid">
            <RecipeCard
              v-for="recipe in filteredRecipes"
              :key="recipe.id"
              class="recipecard"
              :title="recipe.name"
              :image="recipe.imageUrl"
              @open-recipe="setRecipe(recipe)"
            />
          </div>
        </div>

        <!-- Saved Tab -->
        <div v-else-if="activeTab === 'saved'">
          <div
            v-if="
              activeTab === 'saved' &&
              filteredRecipes.community.length === 0 &&
              filteredRecipes.api.length === 0
            "
            class="empty-state"
          >
            <p>{{ selectedDate ? 'No recipes found for this date' : 'No saved recipes yet!' }}</p>
          </div>
          <div v-else class="recipes-grid">
            <!-- Community Recipes -->
            <RecipeCard
              v-for="recipe in filteredRecipes.community"
              :key="`community-${recipe.id}`"
              class="recipecard"
              :title="recipe.name"
              :image="recipe.imageUrl"
              @open-recipe="setRecipe(recipe)"
            >
              <template #badge>
                <span class="recipe-badge community">Community</span>
              </template>
            </RecipeCard>

            <!-- API Recipes -->
            <RecipeCard
              v-for="recipe in filteredRecipes.api"
              :key="`api-${recipe.id}`"
              class="recipecard"
              :title="recipe.title"
              :image="recipe.image"
              @open-recipe="setRecipe({ ...recipe, type: 'api' })"
            >
              <template #badge>
                <span class="recipe-badge api">Spoonacular</span>
              </template>
            </RecipeCard>
          </div>
        </div>

        <!-- Fridge Tab -->
        <div v-else-if="activeTab === 'fridge'" class="fridge-container">
          <!-- Ingredient Input Section -->
          <div class="ingredient-input">
            <div class="input-wrapper">
              <input
                v-model="currentIngredient"
                @input="searchIngredients"
                @keyup.enter="addIngredient"
                placeholder="Add ingredients from your fridge..."
                class="ingredient-search"
              />
              <button @click="addIngredient" class="add-ingredient">Add</button>
            </div>

            <!-- Suggestions dropdown -->
            <div v-if="showSuggestions && ingredientSuggestions.length" class="suggestions">
              <div
                v-for="suggestion in ingredientSuggestions"
                :key="suggestion"
                @click="selectIngredient(suggestion)"
                class="suggestion-item"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>

          <!-- Ingredient Tags -->
          <div class="ingredient-tags">
            <div
              v-for="(ingredient, index) in fridgeIngredients"
              :key="index"
              class="ingredient-tag"
            >
              {{ ingredient }}
              <span @click="removeIngredient(index)" class="remove-tag">&times;</span>
            </div>
          </div>

          <!-- Find Recipes Button -->
          <button
            @click="findRecipes"
            class="find-recipes-btn"
            :disabled="!fridgeIngredients.length"
          >
            Find Recipes
          </button>

          <!-- Results Section -->
          <div v-if="suggestedRecipes.length" class="suggested-recipes">
            <h3>Recipes You Can Make:</h3>
            <div class="recipes-grid">
              <RecipeCard
                v-for="recipe in suggestedRecipes"
                :key="recipe.id"
                :title="recipe.title"
                :image="recipe.image"
                @open-recipe="setRecipe(recipe)"
              >
                <template #extra>
                  <div class="recipe-match-info">
                    <p>Used Ingredients: {{ recipe.usedIngredientCount }}</p>
                    <p>Missing Ingredients: {{ recipe.missedIngredientCount }}</p>
                  </div>
                </template>
              </RecipeCard>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <Sidebar
      v-if="openRecipe && selectedRecipe.api"
      :recipe-details="selectedRecipe.api"
      :user-id="user.value?.id"
      @close-side="closeModal"
      class="recipe-sidebar"
    />

    <RecipePost
      v-if="openRecipe && selectedRecipe.community"
      :recipe-details="selectedRecipe.community"
      :userId="userId"
      :userName="userName"
      :userEmail="userEmail"
      @close-modal="closeModal"
      class="recipe-post"
    />
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.profile-header {
  margin-bottom: 30px;
}

.tab-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.tab-container button {
  padding: 10px 20px;
  border: none;
  background-color: #523e2c;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.tab-container button.active {
  background-color: #3e2e21;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.recipecard {
  margin: 10px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.recipecard:hover {
  transform: translateY(-5px);
}

.calendar-section {
  margin: 20px 0;
  text-align: center;
}

.calendar-toggle {
  background-color: #523e2c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.calendar-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clear-filter {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-filter:hover {
  background-color: #5a6268;
}

.loading-state {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.tab-container button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.debug-info {
  background: #f8f9fa;
  padding: 1rem;
  margin: 1rem;
  border-radius: 4px;
  text-align: left;
}

.debug-info pre {
  margin: 0.5rem 0;
  font-family: monospace;
}

.fridge-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.ingredient-input {
  position: relative;
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.ingredient-search {
  flex: 1;
  padding: 10px;
  border: 2px solid #523e2c;
  border-radius: 4px;
  font-size: 1rem;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.ingredient-tag {
  background: #523e2c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-tag {
  cursor: pointer;
  font-weight: bold;
}

.find-recipes-btn {
  background: #523e2c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 20px 0;
}

.find-recipes-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.recipe-match-info {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
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

.recipe-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.recipe-badge.community {
  background-color: #523e2c;
  color: white;
}

.recipe-badge.api {
  background-color: #2c4152;
  color: white;
}
</style>
