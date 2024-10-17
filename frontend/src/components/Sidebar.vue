<script>
import axios from 'axios'
const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY

export default {
  data() {
    return {
      recipe: this.recipeDetails,
      recipeInfo: {},
      isLoaded: false
    }
  },
  props: {
    recipeDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    dynamicLoadingStyle() {
      return !this.isLoaded ? 'd-flex justify-content-center align-items-center' : 'none'
    }
  },
  mounted() {
    try {
      this.fetchData()
    } catch {
      console.log('error in fetching recipeDetails id')
    }
  },
  methods: {
    async fetchData() {
      const recipeInfoAPI =
        'https://api.spoonacular.com/recipes/' + this.recipeDetails.id + '/information'
      axios
        .get(recipeInfoAPI, {
          params: {
            apiKey: spoonacularApiKey
          }
        })
        .then((response) => {
          console.log(response.data)
          this.recipeInfo.ingredients = response.data.extendedIngredients
          this.recipeInfo.instructions = response.data.analyzedInstructions[0].steps
          this.isLoaded = true
          // console.log(this.recipeInfo.instructions)
        })
        .catch((error) => {
          console.log('there is no recipe details yet')
        })
    }
  },
  emits: ['closeSide']
}
</script>

<template>
  <div class="sidebar" :class="dynamicLoadingStyle">
    <!-- <p>{{ recipeDetails.title }}</p>
    <img :src="recipeDetails.image" alt="..." /> -->
    <div v-if="isLoaded">
      <button class="btn mt-1" @click="$emit('closeSide')">Close</button>
      <p v-if="Object.keys(recipeDetails).length === 0">Recipe details is empty</p>
      <div v-else>
        <h2>{{ recipeDetails.title }}</h2>
        <img :src="recipeDetails.image" alt="..." class="image" />
      </div>
      <h3>Ingredients</h3>
      <ul>
        <li v-for="ingredient in recipeInfo.ingredients">{{ ingredient.original }}</li>
      </ul>
      <h3>Instructions</h3>
      <ol>
        <li v-for="instruction in recipeInfo.instructions">{{ instruction.step }}</li>
      </ol>
      <button class="btn mb-1">Save</button>
    </div>
    <h2 v-else>Loading...</h2>
  </div>
</template>

<style scoped>
.sidebar {
  overflow: auto;
  border: 1px solid black;
  height: 100%;
}
.image {
  width: 100%;
}
button {
  background-color: #523e2c;
  color: white;
}
</style>
