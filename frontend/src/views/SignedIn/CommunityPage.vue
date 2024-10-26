<script>
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'
import axios from 'axios'
import RecipePost from '../../components/RecipePost.vue'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

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
  components: {
    RecipeCard,
    Sidebar,
    RecipePost
  },
  created() {
    this.fetchDBData()
  },
  computed: {
    dynamicColumnClass() {
      return this.openRecipe ? 'col-9' : 'col-12'
    },
    canLoadMore() {
      return this.recipes.length > this.currentNumberItems
    }
  },
  methods: {
    async fetchDBData() {
      try {
        axios.get(BACKEND_URL + '/get-recipes').then((response) => {
          this.recipes = response.data.recipes
          this.isLoaded = true
        })
      } catch {
        ;(error) => console.log(error)
      }
    },
    async searchRecipe() {
      this.isLoaded = false
    },
    setRecipe(recipe) {
      this.selectedRecipe = recipe
      this.openRecipe = true
    },
    closeModal() {
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
        <div class="second justify-content-end">
          <button type="button" class="btn mx-2">Filter</button>
          <button type="button" class="btn">Sort</button>
        </div>
        <div class="container-fluid row results" v-if="isLoaded">
          <RecipeCard
            v-for="recipe in recipes"
            class="recipecard col-3"
            :key="recipe"
            :title="recipe.name"
            :image="recipe.imageUrl"
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
    </div>
    <RecipePost v-if="openRecipe" :recipe-details="selectedRecipe" @close-modal="closeModal" />
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
