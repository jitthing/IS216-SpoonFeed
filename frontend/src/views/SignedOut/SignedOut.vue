<script setup>
import Navbar from '../../components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background-color: rgb(255, 254, 245);
}
</style>
