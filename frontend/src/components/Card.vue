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
  <!-- <div class="card">
    <img :src="image" class="recipe-image card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
    </div>
    <div class="card-body">
      <button @click="$emit('openRecipe')" class="recipe-button btn">Open Recipe</button>
    </div> 
  </div> -->
  <div class="card border-0 d-flex noMP" @click="$emit('openRecipe')">
    <img class="card-img" :src="image" alt="..." />
    <div class="card-img-overlay d-flex flex-column justify-content-end noMP">
      <div class="translucent_bg">
        <h5 class="card-title px-1">{{ title }}</h5>
      </div>
    </div>
  </div>
  <!-- BS card: End -->
</template>

<style scoped>
.noMP {
  margin: 0;
  padding: 0;
  :hover {
    cursor: pointer;
  }
}

.translucent_bg {
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 35%;
}

/* .recipe-image {
  position: absolute;
  object-fit: cover;
  object-position: center;
}
.recipe-button {
  background-color: #523e2c;
  color: white;
  justify-content: start;
  margin-left: 5px;
  font-size: calc(2vh);
} */
</style>
