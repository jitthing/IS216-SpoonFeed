<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="menu">
    <ul class="nav flex-column">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/dashboard">For you</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/online-recipes">Online Recipes</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/">Community Recipes</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/">Profile</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style>
.menu {
  justify-content: start;
  width: 20vh;
  height: 50vh;
  margin-left: 10px;
  padding-bottom: 20px;
  border: 1px solid grey;
  border-radius: 10px;
}
</style>
