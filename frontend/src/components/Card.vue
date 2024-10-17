<script>
export default {
  props: {
    title: String,
    image: String
  },
  emits: ['openRecipe']
}
</script>

<template>
  <!-- BS card: Start -->
  <div class="card">
    <img :src="image" class="recipe-image card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
    </div>
    <div class="card-body">
      <button @click="$emit('openRecipe')" class="recipe-button btn">Open Recipe</button>
    </div>
  </div>
  <!-- BS card: End -->
</template>

<style scoped>
.recipe-image {
  border-radius: 10px;
  margin-top: 5px;
}
.recipe-button {
  background-color: #523e2c;
  color: white;
  justify-content: start;
  /* margin-left: 5px; */
  font-size: calc(2vh);
}
</style>
