<script setup>
import { useAuth } from 'vue-clerk'
import SignedOut from './views/SignedOut/SignedOut.vue'
import SignedIn from './views/SignedIn/SignedIn.vue'

const { isSignedIn } = useAuth()
</script>

<template>
  <header>
    <div class="wrapper" v-if="!isSignedIn">
      <!-- Create component of signed in view and signed out view, instead of rendering individual components like this -->
      <SignedOut />
    </div>
    <div v-else>
      <SignedIn />
    </div>
  </header>
</template>

<style scoped></style>
