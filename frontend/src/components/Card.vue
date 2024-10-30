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
  <div class="card recipe-card border-0" @click="$emit('openRecipe')">
    <div class="image-container">
      <img class="card-img" :src="image" alt="..." />
    </div>
    <div class="card-img-overlay d-flex flex-column justify-content-end">
      <div class="translucent-bg">
        <h5 class="card-title px-1">{{ title }}</h5>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  position: relative;
  width: 250px; /* Fixed width */
  height: 180px; /* Fixed height */
  overflow: hidden;
  border-radius: 8px;
}

.image-container {
  width: 100%;
  height: 100%;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This maintains aspect ratio while covering container */
}

.card-img-overlay {
  padding: 0;
}

.translucent-bg {
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  padding: 8px;
}

.card-title {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hover effect */
.recipe-card:hover {
  cursor: pointer;
  transform: translateY(-2px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
