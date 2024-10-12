<script setup>
import { RouterView } from 'vue-router'
import { useAuth, UserButton } from 'vue-clerk'
import Navbar from './components/Navbar.vue'
import Menu from './components/Menu.vue'

const { isSignedIn } = useAuth()
</script>

<template>
  <header>
    <div class="wrapper" v-if="!isSignedIn">
      <!-- Create component of signed in view and signed out view, instead of rendering individual components like this -->
      <Navbar />
      <RouterView />
    </div>
    <div v-else>
      <h1>You are signed in!</h1>
      <img class="image" src="../public/spoonfeed.jpeg" alt="" height="100" width="100" />
      <Menu />
      <div class="profile"><UserButton /></div>
    </div>
  </header>
</template>

<style scoped>
.profile {
  position: absolute;
  top: 10px;
  right: 10px;
}
.image {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
