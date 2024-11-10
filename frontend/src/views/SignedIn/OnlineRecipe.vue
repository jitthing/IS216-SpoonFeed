<script setup>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useUser } from 'vue-clerk'
import { OhVueIcon } from 'oh-vue-icons'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const { user } = useUser()

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const search = ref('')
const ingredientSearch = ref([])
const searchResults = ref([])
const recipes = ref([])
const selectedRecipe = ref({})
const openRecipe = ref(false)
const currentNumberItems = ref(15)
const isLoaded = ref(false)
const haveResults = ref(false)
const searchResultsLoaded = ref(false)
const searchByFilter = ref(false)
const userId = ref('')
const savedRecipes = ref([])

onMounted(() => {
  randomData()
})

const fetchUser = async () => {
  axios.post(`${BACKEND_URL}/check-user`, { userId: userId.value }).then((response) => {
    savedRecipes.value = response.data.userData.ApiSaved
  })
}
watchEffect(() => {
  if (user) {
    userId.value = user.value.id
    fetchUser()
  }
})

const dynamicColumnClass = computed(() => {
  return openRecipe.value ? 'col-9' : 'col-12'
})

const displayedItems = computed(() => {
  return recipes.value.slice(0, currentNumberItems.value)
})

const canLoadMore = computed(() => {
  return recipes.value.length > currentNumberItems.value
})

const dynamicLoading = computed(() => {
  return !isLoaded.value ? 'd-flex justify-content-center align-items-center' : 'none'
})

const toggleMode = () => {
  searchByFilter.value = !searchByFilter.value
  ingredientSearch.value = []
}

const addIngredient = () => {
  ingredientSearch.value.push(search.value)
  search.value = ''
  fetchDataByIngredient()
}

const fetchSearch = async () => {
  searchResultsLoaded.value = false
  axios
    .get('https://api.spoonacular.com/recipes/autocomplete', {
      params: {
        query: search.value,
        number: 15,
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      searchResults.value = response.data
      searchResultsLoaded.value = true
    })
    .catch((error) => {
      console.error(error)
    })
}

const setSearch = (title) => {
  search.value = title
  searchResultsLoaded.value = false
  fetchSearch()
}

const fetchDataByIngredient = async () => {
  isLoaded.value = false
  haveResults.value = false
  axios
    .get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: ingredientSearch.value.join(','),
        number: 15,
        apiKey: spoonacularApiKey,
        ranking: 1
      }
    })
    .then((response) => {
      recipes.value = response.data
      isLoaded.value = true
      haveResults.value = response.data.length > 0
    })
    .catch((error) => {
      console.error(error)
      isLoaded.value = true
      haveResults.value = false
    })
}

const fetchData = async () => {
  isLoaded.value = false
  haveResults.value = false
  searchResultsLoaded.value = false
  axios
    .get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: search.value,
        number: 30,
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      recipes.value = response.data.results
      isLoaded.value = true
      haveResults.value = response.data.results.length > 0
    })
    .catch((error) => {
      console.error(error)
      isLoaded.value = true
      haveResults.value = false
    })
}

const randomData = async () => {
  isLoaded.value = false
  haveResults.value = false
  axios
    .get('https://api.spoonacular.com/recipes/random', {
      params: {
        number: 30,
        apiKey: spoonacularApiKey
      }
    })
    .then((response) => {
      recipes.value = response.data.recipes
      isLoaded.value = true
      haveResults.value = response.data.recipes.length > 0
    })
    .catch((error) => {
      console.error(error)
      isLoaded.value = true
      haveResults.value = false
    })
}

const setRecipe = (recipe) => {
  selectedRecipe.value = recipe
  openRecipe.value = true
  console.log(savedRecipes.value.includes(recipe.id))
}

const closeSide = () => {
  openRecipe.value = false
}

const fetchMore = () => {
  currentNumberItems.value += 6
}
</script>

<template>
  <div class="content-wrapper" @click="searchResultsLoaded = false">
    <div class="top">
      <div class="search-container">
        <input
          type="text"
          class="searchbar"
          v-model="search"
          placeholder="Search for recipes here"
          size="50"
          height="20"
          @keydown.enter="fetchData"
          @keydown="fetchSearch"
          v-if="!searchByFilter"
        />
        <input
          type="text"
          class="searchbar"
          v-model="search"
          placeholder="Search by ingredients here"
          size="50"
          height="20"
          @keydown.enter="addIngredient"
          v-else
        />
        <div class="icon-wrapper" @click="toggleMode">
          <oh-vue-icon
            name="bi-arrow-repeat"
            class="toggle-icon"
            :title="searchByFilter ? 'Switch to recipe search' : 'Switch to ingredient search'"
          />
        </div>
        <ul v-if="ingredientSearch.length > 0" class="ingredient-list">
          <li v-for="ingredient in ingredientSearch" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>
        <div v-if="searchResultsLoaded" class="search-results-container">
          <ul class="search-results">
            <li v-for="result in searchResults" :key="result.id" @click="setSearch(result.title)">
              {{ result.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid row bottom">
      <div :class="[dynamicColumnClass, { 'sidebar-open': openRecipe }]" class="try">
        <div class="second justify-content-end" :class="dynamicLoading">
          <button type="button" class="btn">Sort</button>
        </div>
        <div class="container-fluid row results" v-if="isLoaded && haveResults">
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
        <div v-else-if="isLoaded && !haveResults" class="no-results">
          <div class="no-results-content">
            <oh-vue-icon name="bi-search" class="search-icon" />
            <h2>No recipes found</h2>
            <p>Try adjusting your search terms or filters</p>
            <button class="btn" @click="randomData">Show Random Recipes</button>
          </div>
        </div>
        <LoadingSpinner v-else size="large" />
      </div>
      <Sidebar
        :class="['sidebar-container', { 'sidebar-open': openRecipe }]"
        v-if="openRecipe"
        :recipe-details="selectedRecipe"
        :user-id="userId"
        :saved-recipes="savedRecipes"
        @close-side="closeSide"
      />
    </div>
  </div>
</template>

<style scoped>
.ingredient-list {
  list-style-type: none;
  padding: 0;
}
.ingredient-list li {
  display: inline;
  padding: 5px;
  background-color: lightgrey;
  margin-right: 5px;
  border-radius: 10px;
  border: 1px solid black;
}
.try {
  height: 100%;
}
.search-results-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  z-index: 1000;
}
.search-results {
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}
.search-results li {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.search-results li:hover {
  background-color: #f5f5f5;
}
.content-wrapper {
  background-color: rgb(255, 254, 245);
  height: 100vh;
  /* padding-inline: 10px; */
  /* border: 1px solid black; */
}
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
}
.searchbar {
  width: 100%;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.searchbar:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.top {
  background-color: #acbaa1;
  width: 100%;
  align-items: center;
  height: 8vh;
  padding-left: 10px;
}
.bottom {
  height: 90vh;
}
.second {
  display: flex;
  margin-top: 10px;
  height: 4vh;
  justify-content: end;
}
.recipecard {
  margin: 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.recipecard:hover {
  transform: translateY(-5px);
}
.results {
  overflow: auto;
  height: 90%;
  margin-top: 10px;
}
.load {
  /* width: 10%; */
  display: block;
  margin: 0 auto;
}
button {
  background-color: #acbaa1;
  color: white;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.icon-wrapper:hover {
  transform: rotate(180deg);
}

.toggle-icon {
  color: white;
  width: 26px;
  height: 26px;
}

.sidebar-container {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100vh;
  background-color: white;
  transition: right 0.3s ease;
  z-index: 1000;
}

.sidebar-container.sidebar-open {
  right: 0;
}

/* Tablet and larger screens */
@media screen and (min-width: 768px) {
  .sidebar-container {
    position: relative;
    right: 0;
    width: 25%;
    height: 90vh;
  }

  .try.sidebar-open {
    width: 75%;
  }
}

/* Adjust column sizes for different screen sizes */
@media screen and (max-width: 767px) {
  .recipecard {
    width: calc(100% - 20px);
    margin: 10px;
  }

  .try {
    width: 100%;
  }
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
  .recipecard {
    width: calc(50% - 20px);
    margin: 10px;
  }
}

@media screen and (min-width: 1025px) {
  .recipecard {
    width: calc(33.333% - 20px);
    margin: 10px;
  }
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
}

.no-results-content {
  text-align: center;
  color: #517470;
}

.no-results-content h2 {
  margin: 20px 0 10px;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.no-results-content p {
  color: #666;
  margin-bottom: 20px;
}

.search-icon {
  width: 48px;
  height: 48px;
  color: #acbaa1;
}

.no-results-content .btn {
  background-color: #acbaa1;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.no-results-content .btn:hover {
  background-color: #517470;
}
</style>
