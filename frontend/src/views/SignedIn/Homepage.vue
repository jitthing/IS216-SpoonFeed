<script>
import axios from 'axios'
import RecipeCard from '../../components/Card.vue'

const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY

export default {
  data() {
    return {
      search: '',
      recipes: []
    }
  },
  created() {
    this.fetchData()
  },
  components: {
    RecipeCard
  },
  methods: {
    async fetchData() {
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
  }
}
</script>

<template>
  <div class="homepage">
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
</style>
