<script setup>
const props = defineProps(['title', 'image'])
</script>

<template>
  <!-- BS card: Start -->
  <div class="card" style="width: 18rem">
    <img :src="image" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
    </div>
    <div class="card-body">
      <a href="#" class="card-link">Card link</a>
    </div>
  </div>
  <!-- BS card: End -->
</template>
