<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUser } from 'vue-clerk'
import RecipeCard from '@/components/Card.vue'
import RecipePost from '@/components/RecipePost.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { user, isLoaded } = useUser()
const activeTab = ref('created')

// Load user information when mounted
onMounted(async () => {
  if (isLoaded.value) {
    // Fetch created recipes and saved boards (if needed)
    // Fetch unorganized images for the user if needed
    axios
      .post(`${BACKEND_URL}/check-user`, {
        userId: user.value.id
      })
      .then((response) => {
        console.log(response.data)
        savedRecipes.value = response.data.userData.ApiSaved
      })
  }
})

// Computed property for filtered and sorted recipes
const filteredRecipes = computed(() => {
  let recipes = []

  if (activeTab.value === 'created') {
    recipes = Object.values(createdRecipes.value || {})
    console.log('Filtered created recipes:', recipes)
  } else {
    const communityRecipes = savedRecipes.value.community || []
    const apiRecipes = savedRecipes.value.api || []
    recipes = [...communityRecipes, ...apiRecipes]
    console.log('Filtered saved recipes:', recipes)
  }

  return recipes.sort((a, b) => {
    if (sortOption.value === 'oldest') {
      return new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    }
    return new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  })
})

// Fetch user's data
const fetchUserData = async () => {
  if (!user.value?.id) return

  console.log('Fetching data for user:', user.value?.id)
  isLoading.value = true

  try {
    // Get created recipes
    const createdResponse = await axios.post('/api/get-recipes-by-user', {
      id: user.value.id
    })
    if (createdResponse.data && createdResponse.data.recipes) {
      createdRecipes.value = createdResponse.data.recipes
      console.log('Created recipes:', createdRecipes.value)
    }

    // Get saved recipes
    const userResponse = await axios.post('/api/check-user', {
      userId: user.value?.id,
      firstName: user.value?.firstName
    })

    if (userResponse.data && userResponse.data.userData) {
      // Get the saved recipe IDs
      const communityIds = userResponse.data.userData.CommunitySaved || []
      const apiIds = userResponse.data.userData.ApiSaved || []

      console.log('Community IDs:', communityIds)
      console.log('API IDs:', apiIds)

      // Fetch community recipes data
      if (communityIds.length > 0) {
        const communityResponse = await axios.get('/api/get-recipes')
        const allRecipes = communityResponse.data.recipes || {}
        const savedCommunityRecipes = communityIds.map((id) => allRecipes[id]).filter(Boolean)
        savedRecipes.value.community = savedCommunityRecipes
        console.log('Saved community recipes:', savedRecipes.value.community)
      }

      // For API recipes, we need to fetch each recipe from Spoonacular
      if (apiIds.length > 0) {
        const apiRecipes = []
        for (const id of apiIds) {
          try {
            const apiResponse = await axios.get(`/api/get-recipe/${id}`)
            if (apiResponse.data) {
              apiRecipes.push(apiResponse.data)
            }
          } catch (error) {
            console.error(`Error fetching API recipe ${id}:`, error)
          }
        }
        savedRecipes.value.api = apiRecipes
        console.log('Saved API recipes:', savedRecipes.value.api)
      }
    
    console.log('User response:', userResponse.data)  // Debug log
    
    if (userResponse.data?.userData?.savedRecipes) {
      // Get the array of saved recipe IDs
      const savedRecipeIds = userResponse.data.userData.savedRecipes
      console.log('Saved recipe IDs:', savedRecipeIds)
      
      // Fetch all recipes
      const recipesResponse = await axios.get('/api/get-recipes')
      const allRecipes = recipesResponse.data.recipes
      
      // Filter recipes that match saved IDs
      savedRecipes.value = Object.values(allRecipes).filter(recipe => 
        savedRecipeIds.includes(recipe.id)
      )
      
      console.log('Filtered saved recipes:', savedRecipes.value)
    } else {
      savedRecipes.value = []
      console.log('No saved recipes found')
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    createdRecipes.value = {}
    savedRecipes.value = { community: [], api: [] }
  } finally {
    isLoading.value = false
  }
}

// Watch for user changes
watch(
  () => user.value?.id,
  (newId) => {
    if (newId) {
      fetchUserData()
    }
  }
)

onMounted(() => {
  if (user.value?.id) {
    fetchUserData()
  }
    console.error('Error fetching saved recipes:', error)
    savedRecipes.value = []
  }
}

// Filter recipes by date
const filteredRecipes = computed(() => {
  if (!selectedDate.value) {
    return activeTab.value === 'created' ? recipes.value : savedRecipes.value
  }

  const selected = new Date(selectedDate.value)
  const startOfDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0)
  const endOfDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59)
  
  console.log('Filtering for date range:', startOfDay, 'to', endOfDay)

  if (activeTab.value === 'created') {
    return recipes.value.filter(recipe => {
      // Extract timestamp from imageUrl
      const timestampMatch = recipe.imageUrl.match(/-(\d+)\?/);
      if (!timestampMatch) return false;
      
      const timestamp = parseInt(timestampMatch[1]);
      const recipeDate = new Date(timestamp);
      
      console.log('Recipe:', recipe.name, 'Date:', recipeDate);
      return recipeDate >= startOfDay && recipeDate <= endOfDay;
    });
  } else {
    return savedRecipes.value.filter(recipe => {
      const timestampMatch = recipe.imageUrl.match(/-(\d+)\?/);
      if (!timestampMatch) return false;
      
      const timestamp = parseInt(timestampMatch[1]);
      const recipeDate = new Date(timestamp);
      
      return recipeDate >= startOfDay && recipeDate <= endOfDay;
    });
  }
})

const clearDateFilter = () => {
  selectedDate.value = null
}

const setRecipe = (recipe) => {
  selectedRecipe.value = recipe
  openRecipe.value = true
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
watch(activeTab, async () => {
  isLoading.value = true
  if (activeTab.value === 'created') {
    await fetchCreatedRecipes()
  } else {
    await fetchSavedRecipes()
  }
  isLoading.value = false
})
</script>

<template>
  <div class="profile-container" v-if="isLoaded">
    <div class="profile-header">
      <h2>My Profile</h2>
      <div class="tab-container">
        <button 
          :class="{ active: activeTab === 'created' }"
          @click="activeTab = 'created'"
        >
          Created
        </button>
        <button 
          :class="{ active: activeTab === 'saved' }"
          @click="activeTab = 'saved'"
        >
          Saved
        </button>
      </div>
    </div>

    <!-- Calendar Filter -->
    <div class="calendar-section">
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
    <div v-if="isLoading" class="loading-state">
      Loading...
    </div>
    <div v-else>
      <!-- Created Tab -->
      <div v-if="activeTab === 'created'">
        <div v-if="filteredRecipes.length === 0" class="empty-state">
          <p>{{ selectedDate ? 'No recipes found for this date' : 'No recipes created yet!' }}</p>
        </div>
        <div v-else class="recipes-grid">
          <RecipeCard
            v-for="recipe in filteredRecipes"
            class="recipecard"
            :key="recipe.id"
            :title="recipe.name"
            :image="recipe.imageUrl"
            @open-recipe="setRecipe(recipe)"
          />
        </div>
      </div>

      <!-- Saved Tab -->
      <div v-if="activeTab === 'saved'">
        <div v-if="filteredRecipes.length === 0" class="empty-state">
          <p>{{ selectedDate ? 'No recipes found for this date' : 'No saved recipes yet!' }}</p>
        </div>
        <div v-else class="recipes-grid">
          <RecipeCard
            v-for="recipe in filteredRecipes"
            class="recipecard"
            :key="recipe.id"
            :title="recipe.name"
            :image="recipe.imageUrl"
            @open-recipe="setRecipe(recipe)"
          />
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <RecipePost
      v-if="openRecipe"
      :recipe-details="selectedRecipe"
      @close-modal="closeModal"
      :userId="user.value?.id"
      :user-name="user.value?.firstName"
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
</style>
