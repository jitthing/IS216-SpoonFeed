<script setup>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'
import RecipePost from '@/components/RecipePost.vue'
import { ref, onMounted, watchEffect, computed } from 'vue'
import { useUser } from 'vue-clerk'

const { user } = useUser()

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const sidebarOpen = ref(false)
const openRecipe = ref(false)
const selectedRecipe = ref({})
const similarRecipes = ref([]) // At random
const trendingRecipes = ref({})
const savedRecipes = ref([])
const savedRecipesData = ref([])
const userId = ref('')
const userName = ref('')
const foodTrivia = ref('')

onMounted(() => {
  fetchHottestRecipes()
  displayFoodTrivia()
})

const fetchHottestRecipes = async () => {
  axios.get(BACKEND_URL + '/get-hottest-recipes').then((response) => {
    trendingRecipes.value = response.data.recipes
    // console.log(trendingRecipes.value)
  })
}

const fetchUser = async () => {
  try {
    axios
      .post(BACKEND_URL + '/check-user', {
        userId: user.value.id
      })
      .then((response) => {
        const userSaved = response.data.userData.ApiSaved
        savedRecipes.value = response.data.userData.ApiSaved
        userId.value = user.value.id
        userName.value = user.value.firstName
        const randomNum = Math.floor(Math.random() * userSaved.length)
        axios
          .get(`https://api.spoonacular.com/recipes/${userSaved[randomNum]}/similar`, {
            params: {
              apiKey: spoonacularApiKey,
              number: 10
            }
          })
          .then((response) => {
            console.log(response.data)
            similarRecipes.value = response.data
          })
      })
  } catch (error) {
    console.error(error)
  }
}

watchEffect(() => {
  if (user.value) {
    fetchUser()
  }
})

const setApiRecipe = (recipe) => {
  selectedRecipe.value = recipe
  sidebarOpen.value = true
}

const setCommunityRecipe = (recipe) => {
  selectedRecipe.value = recipe
  openRecipe.value = true
  console.log(savedRecipes.value.includes(recipe.id))
}

const closeRecipe = () => {
  openRecipe.value = false
  fetchHottestRecipes()
}

const closeSide = () => {
  sidebarOpen.value = false
}

const dynamicColumnClass = computed(() => {
  return sidebarOpen.value ? 'col-9' : 'col-12'
})

const fetchSavedData = async () => {
  axios
    .get('https://api.spoonacular.com/recipes/informationBulk', {
      params: {
        ids: savedRecipes.value.join(','),
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      // console.log(response.data.results)
      savedRecipesData.value = response.data
    })
}

watchEffect(() => {
  if (savedRecipes.value.length > 0) {
    fetchSavedData()
  }
})

const displayFoodTrivia = () => {
  axios
    .get('https://api.spoonacular.com/food/trivia/random', {
      params: {
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      foodTrivia.value = response.data.text
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <div class="homepage">
    <!-- ideas for the main page: show what the user has saved and maybe somehow recommend some online recipes for them based on an algo or something idk -->
    <!-- but might be better to just focus on the frontend itself -->
    <!-- <div class="top">
      <input
        type="text"
        class="searchbar"
        v-model="search"
        placeholder="Search for recipes here"
        size="50"
        height="20"
      />
    </div> -->
    <div class="homepage-container">
      <div :class="dynamicColumnClass" class="main-content">
        <!-- <div class="second justify-content-end" :class="dynamicLoading">
          <button type="button" class="btn mx-2">Filter</button>
          <button type="button" class="btn">Sort</button>
        </div> -->
        <!-- <div class="container-fluid row results" v-if="isLoaded">
          <RecipeCard
            class="recipecard col-xl-3 col-lg-4 col-md-10 col-sm-10"
            v-for="recipe in displayedItems"
            :key="recipe.id"
            :title="recipe.title"
            :image="recipe.image"
            @open-recipe="setRecipe(recipe)"
          />
          <div>
            <button type="button" class="btn load" @click="fetchMore" v-if="canLoadMore">
              Load More
            </button>
          </div>
        </div>
        <h2 v-else>Loading...</h2> -->
        <div class="banner">
          <!-- Need to replace <user> with username -->
          <span class="banner-title">Welcome back {{ userName }}</span> <br />
          <span class="banner-text">Did you know? </span>
          <span class="banner-text"> {{ foodTrivia }} </span>
        </div>
        <div class="h2 custom-margins">Saved Recipes</div>
        <div class="scroll-container" v-if="savedRecipesData.length > 0">
          <div class="scroll-menu inline-margin">
            <RecipeCard
              class="recipe-card"
              v-for="recipe in savedRecipesData"
              :key="recipe.id"
              :title="recipe.title"
              :image="recipe.image"
              :userId="userId"
              @open-recipe="setApiRecipe(recipe)"
            />
          </div>
        </div>
        <h4 class="mt-2 inline-margin" v-else><i>No saved recipes... Please start using our app.</i></h4>
        <div class="h2 custom-margins">Recommended for you</div>
        <div class="scroll-container" v-if="similarRecipes.length > 0">
          <div class="scroll-menu inline-margin">
            <RecipeCard
              class="recipe-card"
              v-for="recipe in similarRecipes"
              :key="recipe.id"
              :title="recipe.title"
              :userId="userId"
              @open-recipe="setApiRecipe(recipe)"
              :image="`https://img.spoonacular.com/recipes/${recipe.id}-312x231.jpg`"
            />
          </div>
        </div>
        <h4 class="mt-2 inline-margin" v-else><i>No recommended recipes... Because you never save any!</i></h4>
        <div class="h2 custom-margins">Trending Community Recipes</div>
        <div class="scroll-container" v-if="trendingRecipes">
          <div class="scroll-menu inline-margin">
            <RecipeCard
              class="recipe-card"
              :key="recipe"
              :title="recipe.name"
              :image="recipe.imageUrl"
              @open-recipe="setCommunityRecipe(recipe)"
              v-for="recipe in trendingRecipes"
            />
          </div>
        </div>
      </div>
      <Sidebar
        class="sidebar-container"
        v-if="sidebarOpen"
        :recipe-details="selectedRecipe"
        :saved-recipes="savedRecipes"
        :user-id="userId"
        @close-side="closeSide"
      />
    </div>
    <RecipePost
      v-if="openRecipe"
      :recipe-details="selectedRecipe"
      @close-modal="closeRecipe"
      :userId="userId"
      :user-name="userName"
      :user-email="userEmail"
    />
  </div>
</template>

<style scoped>
.homepage {
  background-color: rgb(255, 254, 245);
  height: 100vh;
  /* padding-inline: 10px; */
  /* border: 1px solid black; */
  overflow: auto;
}
/* .searchbar {
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 20px;
}
.top {
  background-color: lightgrey;
  width: 100%;
  align-items: center;
} */
.scroll-menu {
  overflow: auto;
  white-space: nowrap;
}
.scroll-menu a {
  display: inline-block;
  color: black;
  text-align: center;
  padding: 14px;
  text-decoration: none;
  height: 100px;
  width: 30%;
}

.banner {
  /* background-color: #acbaa1; */
  background-image: linear-gradient(180deg, #7aa395, #acbaa1);
  height: 18vh;
  width: 100%;
  padding-inline: 1%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-title {
  font-size: 2.7rem;
  font-family:Georgia, 'Times New Roman', Times, serif;
  font-weight: bold;
  color: rgb(255, 254, 245);
}

.banner-text {
  font-size: 1.2rem;
  color: white;
  font-family:Georgia, 'Times New Roman', Times, serif;
}

.custom-margins {
  margin-top: 30px;
  margin-inline: 20px;
  color: #517470;
  font-family:Georgia, 'Times New Roman', Times, serif;
  border-bottom: 3px solid #517470;
}

.inline-margin {
  margin-inline: 10px;
}

.scroll-container {
  width: 100%;
  position: relative;
  margin: 1rem 0;
}

.scroll-menu {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem;
  scrollbar-width: thin;
  scroll-behavior: smooth;
  align-items: stretch;
}

.scroll-menu::-webkit-scrollbar {
  height: 6px;
}

.scroll-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scroll-menu::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scroll-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.recipe-card {
  flex: 0 0 auto;
  min-width: 200px; /* Base minimum width */
}

/* Responsive breakpoints */
@media (min-width: 576px) {
  .recipe-card {
    width: calc(50% - 1rem); /* 2 cards per row */
    max-width: 300px;
  }

  .scroll-menu {
    gap: 1rem;
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .recipe-card {
    width: calc(33.333% - 1rem); /* 3 cards per row */
  }
}

@media (min-width: 992px) {
  .recipe-card {
    width: calc(25% - 1rem); /* 4 cards per row */
  }
}

@media (min-width: 1200px) {
  .recipe-card {
    width: calc(20% - 1rem); /* 5 cards per row */
  }
}

@media (min-width: 1400px) {
  .recipe-card {
    width: calc(16.666% - 1rem); /* 6 cards per row */
  }
}

/* Adjust gap and padding for smaller screens */
@media (max-width: 575px) {
  .scroll-menu {
    gap: 0.75rem;
    padding: 0.75rem;
  }
}

@media (max-width: 375px) {
  .recipe-card {
    width: 220px; /* Slightly smaller cards for very small screens */
    height: 160px;
  }
}

.homepage-container {
  position: relative;
  display: flex;
  height: 100%;
}

.main-content {
  flex: 1;
  transition: width 0.3s ease;
}

.sidebar-container {
  width: 400px;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  transition: transform 0.3s ease;
}

/* Mobile styles */
@media (max-width: 768px) {
  .homepage-container {
    display: block;
  }

  .sidebar-container {
    width: 100%;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
  }

  .main-content {
    width: 100% !important;
  }
}
</style>
