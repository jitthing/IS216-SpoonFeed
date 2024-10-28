<script>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY

export default {
  data() {
    return {
      search: '',
      ingredientSearch: [],
      searchResults: [],
      recipes: [],
      selectedRecipe: {},
      openRecipe: false,
      currentNumberItems: 15,
      isLoaded: false,
      haveResults: false,
      searchResultsLoaded: false,
      searchByFilter: false
    }
  },
  created() {
    this.randomData()
  },
  components: {
    RecipeCard,
    Sidebar
  },
  computed: {
    dynamicColumnClass() {
      return this.openRecipe ? 'col-9' : 'col-12'
    },
    displayedItems() {
      return this.recipes.slice(0, this.currentNumberItems)
    },
    canLoadMore() {
      return this.recipes.length > this.currentNumberItems
    },
    dynamicLoading() {
      return !this.isLoaded ? 'd-flex justify-content-center align-items-center' : 'none'
    }
  },
  methods: {
    toggleMode() {
      this.searchByFilter = !this.searchByFilter
      this.ingredientSearch = []
    },
    addIngredient() {
      this.ingredientSearch.push(this.search)
      this.search = ''
      this.fetchDataByIngredient()
    },
    async fetchSearch() {
      this.searchResultsLoaded = false
      axios
        .get('https://api.spoonacular.com/recipes/autocomplete', {
          params: {
            query: this.search,
            number: 15,
            apiKey: spoonacularApiKey
          }
        })
        .then((response) => {
          this.searchResults = response.data
          console.log(this.searchResults)
          this.searchResultsLoaded = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setSearch(title) {
      this.search = title
      this.searchResultsLoaded = false
      this.fetchData()
    },
    async fetchDataByIngredient() {
      this.isLoaded = false
      this.haveResults = false
      axios
        .get('https://api.spoonacular.com/recipes/findByIngredients', {
          params: {
            ingredients: this.ingredientSearch.join(','),
            apiKey: spoonacularApiKey,
            number: 30,
            ranking: 2
          }
        })
        .then((response) => {
          this.recipes = response.data
          this.isLoaded = true
          this.haveResults = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async fetchData() {
      this.isLoaded = false
      this.searchResultsLoaded = false
      this.haveResults = false
      axios
        .get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            query: this.search,
            apiKey: spoonacularApiKey,
            number: 30
          }
        })
        .then((response) => {
          // console.log(response.data.results)
          this.recipes = response.data.results
          this.isLoaded = true
          this.haveResults = true

          // console.log(this.recipes)
        })
    },
    async randomData() {
      try {
        axios
          .get('https://api.spoonacular.com/recipes/random', {
            params: {
              apiKey: spoonacularApiKey,
              number: 50
            }
          })
          .then((response) => {
            this.recipes = response.data.recipes
            this.isLoaded = true
            this.haveResults = true
            // console.log(this.recipes)
          })
      } catch (error) {
        console.log(error)
      }
    },
    setRecipe(recipe) {
      try {
        this.selectedRecipe = recipe
        this.openRecipe = true
        // console.log(this.selectedRecipe)
      } catch {
        console.log('there is an error in onlinerecipe')
      }
    },
    closeSide() {
      this.openRecipe = false
    },
    fetchMore() {
      this.currentNumberItems += 6
    }
  }
}
</script>

<template>
  <div class="content-wrapper" @click="this.searchResultsLoaded = false">
    <div class="top">
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
      <p class="d-inline mx-2" @click="toggleMode">Change</p>
      <ul v-if="this.ingredientSearch.length > 0" class="ingredient-list">
        <li v-for="ingredient in ingredientSearch" :key="ingredient">
          {{ ingredient }}
        </li>
      </ul>
      <div v-if="searchResultsLoaded">
        <ul class="search-results">
          <li v-for="result in searchResults" :key="result.id" @click="setSearch(result.title)">
            {{ result.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="container-fluid row bottom">
      <div :class="dynamicColumnClass" class="try">
        <div class="second justify-content-end" :class="dynamicLoading">
          <button type="button" class="btn mx-2">Filter</button>
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
        <h2 v-else-if="isLoaded">No results found.</h2>
        <h2 v-else>Loading...</h2>
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
.search-results {
  list-style-type: none;
  padding: 0;
  z-index: 40;
  position: relative;
  height: 15vh;
  width: fit-content;
  overflow-y: auto;
}
.search-results li {
  background-color: white;
  padding: 5px;
  :hover {
    background-color: lightgrey;
    cursor: pointer;
  }
}
.content-wrapper {
  background-color: white;
  height: 100vh;
  /* padding-inline: 10px; */
  border: 1px solid black;
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
  height: 5vh;
  padding-left: 10px;
}
.bottom {
  height: 90vh;
}
.second {
  display: flex;
  margin-top: 10px;
  height: 5vh;
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
}
.load {
  width: 10%;
  display: block;
  margin: 0 auto;
}
button {
  background-color: #523e2c;
  color: white;
}
</style>
