<script>
import axios from 'axios'
const spoonacularApiKey = import.meta.env.VITE_APP_SPOONACULAR_KEY

export default {
  data() {
    return {
      recipeInfo: {}
    }
  },
  props: {
    recipeDetails: {
      type: Object,
      required: true
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
          this.recipeInfo.instructions = response.data.analyzedInstructions
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
  <div class="sidebar">
    <!-- <p>{{ recipeDetails.title }}</p>
    <img :src="recipeDetails.image" alt="..." /> -->

    <button class="btn btn-primary" @click="$emit('closeSide')">Close</button>
    <p v-if="Object.keys(recipeDetails).length === 0">Recipe details is empty</p>
    <div v-else>
      <p>{{ recipeDetails.title }}</p>
      <img :src="recipeDetails.image" alt="..." />
      <p>{{ recipeDetails.id }}</p>
    </div>
    <h3>Ingredients</h3>
    <ul>
      <li v-for="ingredient in recipeInfo.ingredients">{{ ingredient.original }}</li>
    </ul>
  </div>
</template>

<style>
.sidebar {
  overflow: scroll;
  border: 1px solid black;
}
</style>
