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
  <div class="card my-card border-0 d-flex no-MP" @click="$emit('openRecipe')">
    <img class="card-img" :src="image" alt="..." />
    <div class="card-img-overlay d-flex flex-column justify-content-end no-MP">
      <div class="translucent-bg">
        <h5 class="card-title px-1">{{ title }}</h5>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-MP {
  margin: 0;
  padding: 0;
  :hover {
    cursor: pointer;
  }
}

.my-card {
  container-type: inline-size;
}

@container (min-width: 1px) {
  .my-card .card-title {
    font-size: 6.5cqi;
  }
}

.translucent-bg {
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 35%;
}

</style>
