<script>
import RecipeCard from '../../components/Card.vue'
import Sidebar from '../../components/Sidebar.vue'
import axios from 'axios'

export default {
  data() {
    return {
      search: '',
      recipes: [],
      localRecipes: [
        {
          id: 1,
          title: 'Spaghetti Bolognese',
          image: './spaghetti.jpeg',
          ingredients: '...',
          instructions: '...'
        },
        {
          id: 2,
          title: 'Chicken Curry',
          image: './chicken_curry.jpeg',
          ingredients: '...',
          instructions: '...'
        }
      ],
      selectedRecipe: {},
      openRecipe: false,
      currentNumberItems: 15,
      isLoaded: true
    }
  },
  components: {
    RecipeCard,
    Sidebar
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
    fetchData() {
      if (this.search) {
        this.recipes = this.localRecipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(this.search.toLowerCase())
        )
      } else {
        this.recipes = this.localRecipes
      }
    },
    async fetchDBData() {
      try {
        axios.get('http://localhost:8000/api/get-recipes').then((response) => {
          this.recipes = response.data.recipes
          console.log(this.recipes)
        })
      } catch {
        ;(error) => console.log(error)
      }
    },
    async searchRecipe() {},
    setRecipe(recipe) {
      this.selectedRecipe = recipe
      this.openRecipe = true
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
        <div class="container-fluid row results">
          <RecipeCard
            v-for="recipe in recipes"
            class="recipecard col-3"
            :key="recipe"
            :title="recipe.name"
            :image="recipe.imageUrl"
          />
          <div>
            <button type="button" class="btn load" @click="fetchMore" v-if="canLoadMore">
              Load More
            </button>
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
