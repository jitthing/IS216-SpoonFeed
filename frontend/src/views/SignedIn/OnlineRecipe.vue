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
      openRecipe: false
    }
  },
  created() {
    this.fetchData()
  },
  components: {
    RecipeCard,
    Sidebar
  },
  methods: {
    async fetchData() {
      axios
        .get('https://api.spoonacular.com/recipes/complexSearch', {
          params: {
            query: this.search,
            apiKey: spoonacularApiKey
          }
        })
        .then((response) => {
          // console.log(response.data.results)
          this.recipes = response.data.results
          console.log(this.recipes)
        })
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
    <div class="container-fluid row">
      <div class="col-10">
        <div class="second justify-content-end">
          <button type="button" class="btn btn-primary mx-2">Filter</button>
          <button type="button" class="btn btn-primary">Sort</button>
        </div>
        <div class="container-fluid row">
          <RecipeCard
            class="recipecard col-3"
            v-for="recipe in recipes"
            :key="recipe.id"
            :title="recipe.title"
            :image="recipe.image"
            @open-recipe="setRecipe(recipe)"
          />
        </div>
      </div>
      <Sidebar
        class="col-2"
        v-if="openRecipe"
        :recipe-details="selectedRecipe"
        @close-side="closeSide"
      />
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  background-color: white;
  height: 100vh;
  padding-inline: 10px;
  border: 1px solid black;
  overflow: scroll;
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
.second {
  display: flex;
  margin-top: 10px;
  justify-content: end;
}
.recipecard {
  margin: 10px 10px;
}
</style>
