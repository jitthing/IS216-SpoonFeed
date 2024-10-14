<script setup>
import Dashboard from '../SignedIn/Dashboard.vue'
import { useAuth } from 'vue-clerk'

const { isSignedIn } = useAuth()
</script>

<template>
  <div v-if="!isSignedIn" class="home">
    <h1>This is a home page</h1>
  </div>
  <Dashboard v-else />
</template>

<style>
@media (min-width: 1024px) {
  .home {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
