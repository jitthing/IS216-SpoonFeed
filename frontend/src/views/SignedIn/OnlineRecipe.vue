<script>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY

export default {
  data() {
    return {
      search: '',
      recipes: [],
      selectedRecipe: {},
      openRecipe: false,
      currentNumberItems: 15,
      isLoaded: false
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
    async fetchData() {
      this.isLoaded = false
      axios
        .get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            query: this.search,
            apiKey: spoonacularApiKey,
            number: 15
          }
        })
        .then((response) => {
          // console.log(response.data.results)
          this.recipes = response.data.results
          this.isLoaded = true
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
  <div class="content-wrapper">
    <!-- ideas for the main page: show what the user has saved and maybe somehow recommend some online recipes for them based on an algo or something idk -->
    <!-- but might be better to just focus on the frontend itself -->
    <div class="top">
      <input
        type="text"
        class="searchbar"
        v-model="search"
        placeholder="Search for recipes here"
        size="50"
        height="20"
        @keydown.enter="fetchData"
      />
    </div>
    <div class="container-fluid row bottom">
      <div :class="dynamicColumnClass" class="try">
        <div class="second justify-content-end" :class="dynamicLoading">
          <button type="button" class="btn mx-2">Filter</button>
          <button type="button" class="btn">Sort</button>
        </div>
        <div class="container-fluid row results" v-if="isLoaded">
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
.try {
  height: 100%;
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
