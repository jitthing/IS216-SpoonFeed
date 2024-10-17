<script setup>
import { useAuth } from 'vue-clerk'
import SignedOut from './views/SignedOut/SignedOut.vue'
import SignedIn from './views/SignedIn/SignedIn.vue'

const { isSignedIn } = useAuth()
</script>

<template>
  <header>
    <!-- Create component of signed in view and signed out view, instead of rendering individual components like this -->
    <SignedOut v-if="!isSignedIn" />
    <SignedIn v-else />
  </header>
</template>

<style>
button {
  background-color: #523e2c;
}
</style>
