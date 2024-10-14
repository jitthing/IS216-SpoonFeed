<script setup>
import Homepage from '../SignedIn/Homepage.vue'
import { useAuth } from 'vue-clerk'

const { isSignedIn } = useAuth()
</script>

<template>
  <div v-if="!isSignedIn" class="home">
    <h1>This is a home page</h1>
  </div>
  <Homepage v-else />
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
