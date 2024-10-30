<script setup>
import axios from 'axios'
import { watch, ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const recipe = ref({})
const recipeInfo = ref({})
const isLoaded = ref(false)

defineEmits(['closeSide'])

const { recipeDetails, userId } = defineProps({
  recipeDetails: {
    type: Object,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  savedRecipes: {
    type: Array,
    required: true
  }
})
const fetchData = async () => {
  // If it's a community recipe, use the data directly
  if (recipe.value.type === 'community') {
    recipeInfo.value = {
      ingredients: recipe.value.extendedIngredients,
      instructions: [{ step: recipe.value.instructions }]
    }
    isLoaded.value = true
    return
  }

  // For API recipes, fetch additional details
  try {
    const recipeInfoAPI = `https://api.spoonacular.com/recipes/${recipe.value.id}/information`
    const response = await axios.get(recipeInfoAPI, {
      params: {
        apiKey: spoonacularApiKey
      }
    })

    recipeInfo.value.ingredients = response.data.extendedIngredients
    recipeInfo.value.instructions = response.data.analyzedInstructions[0]?.steps || [
      { step: response.data.instructions }
    ]
    isLoaded.value = true
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    // Use existing data if API call fails
    recipeInfo.value = {
      ingredients: recipe.value.extendedIngredients || [],
      instructions: [{ step: recipe.value.instructions || 'No instructions available' }]
    }
    isLoaded.value = true
  }
}

const dynamicLoadingStyle = computed(() => {
  return !isLoaded.value ? 'd-flex justify-content-center align-items-center' : 'none'
})

watch(
  () => recipeDetails,
  (newVal) => {
    if (newVal) {
      recipe.value = { ...newVal } // Create a copy of the recipe details
      fetchData()
    }
  },
  { immediate: true, deep: true } // Add deep watching
)

const saveRecipe = async () => {
  try {
    axios
      .post(`${BACKEND_URL}/update-saved-api`, {
        userId: userId,
        recipeId: recipe.value.id
      })
      .then((response) => {
        const wasSaved = response.data.wasSaved
        if (!wasSaved) {
          toast.success('Save updated!', { autoClose: 1000 })
        } else {
          toast.warning('Recipe removed from saved!', { autoClose: 1000 })
        }
      })
  } catch (error) {
    toast.error(`Error: ${error.response.data.message}`)
  }
}
</script>

<template>
  <div class="sidebar" :class="dynamicLoadingStyle">
    <div v-if="isLoaded" class="sidebar-content">
      <!-- Header -->
      <div class="recipe-header">
        <h2 class="recipe-title">{{ recipeDetails.title || recipeDetails.name }}</h2>
        <button class="close-button" @click="$emit('closeSide')">×</button>
      </div>

      <!-- Image -->
      <div class="image-container">
        <img
          :src="recipeDetails.image || recipeDetails.imageUrl"
          alt="Recipe Image"
          class="recipe-image"
        />
      </div>

      <!-- Save Button -->
      <div class="action-buttons">
        <button @click="saveRecipe" class="save-button">
          <span v-if="savedRecipes.includes(recipeDetails.id)">★ Saved</span>
          <span v-else>★ Save Recipe</span>
        </button>
      </div>

      <!-- Recipe Details -->
      <div class="recipe-details">
        <div class="section">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipeInfo.ingredients" :key="index">
              {{ ingredient.original || ingredient.name }}
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>Instructions</h3>
          <ol class="instructions-list">
            <li v-for="(instruction, index) in recipeInfo.instructions" :key="index">
              {{ instruction.step || instruction }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sidebar-content {
  height: 100%;
  overflow-y: auto;
}

.recipe-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #dbdbdb;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.recipe-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #262626;
}

.image-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-buttons {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.save-button {
  background-color: #523e2c;
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

.save-button:hover {
  background-color: #3e2e21;
}

.recipe-details {
  padding: 16px;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #523e2c;
}

.ingredients-list,
.instructions-list {
  padding-left: 24px;
  line-height: 1.6;
}

.ingredients-list li,
.instructions-list li {
  margin-bottom: 8px;
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #523e2c;
}
</style>
