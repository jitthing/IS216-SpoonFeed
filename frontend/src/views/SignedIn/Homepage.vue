<script setup>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'
import { ref, onMounted, watchEffect } from 'vue'
import { useUser } from 'vue-clerk'

const { user } = useUser()

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const search = ref('')
const recipes = ref([])
const similarRecipes = ref([]) // At random
const trendingRecipes = ref({})
const savedRecipes = ref([])

onMounted(() => {
  fetchHottestRecipes()
})

const fetchHottestRecipes = async () => {
  axios.get(BACKEND_URL + '/get-hottest-recipes').then((response) => {
    trendingRecipes.value = response.data.recipes
    console.log(trendingRecipes.value)
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

const fetchData = async () => {
  axios
    .get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: 'pasta',
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      // console.log(response.data.results)
      this.recipes = response.data.results
      console.log(this.recipes)
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
    <div class="container-fluid row bottom">
      <div :class="dynamicColumnClass" class="try">
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
          <span class="h1">Welcome back &lt;User&gt;</span> <br />
          <span class="h4"> What will you cook today? </span>
        </div>
        <div class="h2 custom-margins">Saved</div>
        <div class="scroll-menu">
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
          <a href="#foodcard">foodcard</a>
        </div>
        <div class="h2 custom-margins">Recommended</div>
        <div class="scroll-container" v-if="similarRecipes.length > 0">
          <div class="scroll-menu">
            <RecipeCard
              class="recipe-card"
              v-for="recipe in similarRecipes"
              :key="recipe.id"
              :title="recipe.title"
              :image="`https://img.spoonacular.com/recipes/${recipe.id}-312x231.jpg`"
            />
          </div>
        </div>
        <div class="h2 custom-margins">Trending Recipes</div>
        <div class="scroll-container" v-if="trendingRecipes">
          <div class="scroll-menu">
            <RecipeCard
              class="recipe-card"
              :key="recipe"
              :title="recipe.name"
              :image="recipe.imageUrl"
              v-for="recipe in trendingRecipes"
            />
          </div>
        </div>
      </div>
      <Sidebar
        class="col-3"
        v-if="openRecipe"
        :recipe-details="selectedRecipe"
        @close-side="closeSide"
      />
    </div>
  </div>
</template>

<style scoped>
.homepage {
  background-color: white;
  height: 100vh;
  padding-inline: 10px;
  border: 1px solid black;
  overflow: auto;
}
.searchbar {
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 20px;
}
.top {
  background-color: lightgrey;
  width: 100%;
  align-items: center;
}
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
  background-color: #acbaa1;
  height: 15vh;
  width: 100%;
  padding-inline: 1%;
}

.custom-margins {
  margin-top: 50px;
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
</style>
