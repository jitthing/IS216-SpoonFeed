<script setup>
import { RouterLink } from 'vue-router'
import { useAuth, UserButton } from 'vue-clerk'

const { userId, isSignedIn } = useAuth()
console.log(userId)
</script>

<template>
  <div class="navbar">
    <img class="image" src="../../public/spoonfeed.jpeg" alt="" height="80" width="80" />
    <!-- BS basic nav: start -->
    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink class="nav-link active" to="/">Home</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/about">About</RouterLink>
      </li>
    </ul>
    <ul class="nav justify-content-end" v-if="!isSignedIn">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/sign-in">Sign In</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/sign-up">Sign Up</RouterLink>
      </li>
    </ul>
    <ul class="profile" v-else>
      <RouterLink to="/"><UserButton /></RouterLink>
    </ul>

    <!-- BS basic nav: end -->
  </div>
</template>

<style scoped>
.profile {
  padding-top: 10px;
  padding-right: 20px;
}
.image {
  margin-left: 10px;
}
</style>
