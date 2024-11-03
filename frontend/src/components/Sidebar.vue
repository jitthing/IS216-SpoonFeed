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
      // Handle both string and array cases for instructions
      instructions: Array.isArray(recipe.value.instructions)
        ? recipe.value.instructions.map((step) => ({ step }))
        : recipe.value.instructions
            .split('\n')
            .filter((step) => step.trim())
            .map((step) => ({ step: step.trim() }))
    }
    isLoaded.value = true
    return
  }

  // For API recipes, fetch additional details
  try {
    const recipeInfoAPI = `https://api.spoonacular.com/recipes/${recipe.value.id}/information`
    const response = await axios.get(recipeInfoAPI, {
      params: {
        apiKey: spoonacularApiKey,
        includeNutrition: true
      }
    })

    recipeInfo.value.ingredients = response.data.extendedIngredients
    recipeInfo.value.instructions = response.data.analyzedInstructions[0]?.steps || [
      { step: response.data.instructions }
    ]
    recipeInfo.value.prepTime = response.data.readyInMinutes
    recipeInfo.value.macros = {}
    for (const macro of response.data.nutrition.nutrients) {
      if (['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(macro.name)) {
        recipeInfo.value.macros[macro.name] = macro.amount
      }
    }
    console.log(recipeInfo.value.macros)
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

const addMealPlanned = async () => {
  try {
    axios
      .post(BACKEND_URL + '/add-meals-planned', {
        userId: userId,
        recipeId: recipeDetails.id,
        type: 'api'
      })
      .then((response) => {
        console.log(response.data)
        toast.success('Added to meals planned!', {
          autoClose: 1000
        })
      })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Transition name="slide" appear>
    <div class="sidebar" :class="dynamicLoadingStyle" v-if="isLoaded">
      <div class="sidebar-content">
        <!-- Header -->
        <div class="recipe-header">
          <h2 class="recipe-title">{{ recipeDetails.title || recipeDetails.name }}</h2>
          <button class="close-button" @click="$emit('closeSide')">×</button>
        </div>

        <!-- Image -->
        <div class="image-container">
          <img
            :src="
              recipeDetails.image ||
              recipeDetails.imageUrl ||
              `https://img.spoonacular.com/recipes/${recipeDetails.id}-312x231.jpg`
            "
            alt="Recipe Image"
            class="recipe-image"
          />
        </div>

        <!-- Save Button -->
        <div class="action-buttons">
          <button @click="saveRecipe" class="save-button">
            <span v-if="savedRecipes?.includes(recipeDetails.id)">★ Saved</span>
            <span v-else>★ Save Recipe</span>
          </button>
          <button @click="addMealPlanned" class="add-meal-btn">Add to meals planned</button>
        </div>

        <!-- Recipe Details -->
        <div class="recipe-details">
          <div class="section">
            <span
              ><h3>Prep Time:</h3>
              <p>{{ recipeInfo.prepTime }} mins</p></span
            >
          </div>
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
          <div class="section" v-if="recipeInfo.macros">
            <h3>Nutrition</h3>
            <ul>
              <li v-for="(amount, name) in recipeInfo.macros">{{ name }}: {{ amount }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else class="loading">
      <h2>Loading...</h2>
    </div> -->
  </Transition>
</template>

<style scoped>
.sidebar {
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
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

.action-buttons button {
  margin: 0 10px;
}

.save-button {
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

.save-button:hover {
  background-color: #517470;
}

.add-meal-btn {
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

.add-meal-btn:hover {
  background-color: #517470;
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
  color: #acbaa1;
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
  color: #acbaa1;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    z-index: 1000;
  }

  .recipe-header {
    padding: 20px 16px;
  }

  .close-button {
    font-size: 28px;
    padding: 10px;
  }

  .image-container {
    max-height: 200px;
  }

  .recipe-details {
    padding: 20px;
  }
}

/* Tablet styles */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    height: 90vh;
  }

  .image-container {
    max-height: 250px;
  }
}

/* Desktop styles */
@media screen and (min-width: 769px) {
  .sidebar {
    height: 100vh;
    border-radius: 12px 0 0 12px;
  }
}

/* Add these transition classes to the bottom of the style section */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* For mobile devices */
@media screen and (max-width: 768px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
}
</style>
