<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUser } from 'vue-clerk'
import axios from '@/axios'
import RecipeCard from '@/components/Card.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'
import CreateBoard from '@/components/CreateBoard.vue' // Ensure you import CreateBoard.vue
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

// Modal state
const modalOpen = ref(false)
const showCreateBoardModal = ref(false) // For Create Board modal
const selectedBoard = ref(null) // To track which board is selected
const createdRecipes = ref([])
const savedBoards = ref([]) // Store created boards
const unorganizedImages = ref([]) // Store unorganized saved images
const savedRecipes = ref([]) // Store saved recipes

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
      userId: user.value.id,
      firstName: user.value.firstName
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
})

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const setSortOption = (option) => {
  sortOption.value = option
}

const handleRecipeCreated = async () => {
  modalOpen.value = false
  await fetchUserData() // Refresh the data
}
</script>

<template>
  <div class="profile-container" v-if="isLoaded">
    <!-- Profile Header -->
    <div class="profile-header">
      <img :src="user.profileImageUrl" alt="Profile Picture" class="profile-picture" />
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>
      <p>@{{ user.username }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-container">
      <button @click="setActiveTab('created')" :class="{ active: activeTab === 'created' }">
        Created
      </button>
      <button @click="setActiveTab('saved')" :class="{ active: activeTab === 'saved' }">
        Saved
      </button>
    </div>

    <!-- Sort Controls -->
    <div class="sort-controls">
      <select v-model="sortOption" class="sort-select">
        <option value="newest">Most Recent</option>
        <option value="oldest">Least Recent</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">Loading...</div>

    <!-- Content -->
    <div v-else>
      <!-- Created Tab -->
      <div v-if="activeTab === 'created'">
        <div v-if="Object.keys(createdRecipes.value || {}).length === 0" class="empty-state">
          <p>Nothing to show...yet! Recipes you create will live here.</p>
          <button @click="modalOpen = true" class="create-recipe-btn">Create Recipe</button>
        </div>
        <div v-else>
          <button @click="modalOpen = true" class="create-recipe-btn">Create Recipe</button>
          <div class="recipes-grid">
            <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
          </div>
        </div>
      </div>

      <!-- Saved Tab -->
      <div v-if="activeTab === 'saved'">
        <div
          v-if="savedRecipes.community.length === 0 && savedRecipes.api.length === 0"
          class="empty-state"
        >
          <p>No saved recipes yet. Save some recipes to see them here!</p>
        </div>
        <div v-else class="recipes-grid">
          <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
      </div>
    </div>

    <!-- Create Recipe Modal -->
    <CreateRecipe
      v-if="modalOpen"
      @close-modal="modalOpen = false"
      @recipe-created="handleRecipeCreated"
    />
  </div>
</template>

<style scoped>
/* Styles remain unchanged */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.tab-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.tab-container button.active {
  color: #523e2c;
  border-bottom: 2px solid #523e2c;
}

.sort-controls {
  margin: 20px 0;
  text-align: right;
  padding: 0 20px;
}

.sort-select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #523e2c;
  background-color: white;
  color: #523e2c;
}

.loading-state {
  text-align: center;
  margin: 50px 0;
}

.empty-state {
  text-align: center;
  margin: 50px 0;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.create-recipe-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #523e2c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-recipe-btn:hover {
  background-color: #3e2e21;
}
</style>
