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
        <RouterLink class="nav-link" to="/community-recipe">Community Recipes</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style>
.menu {
  width: 80%;
  height: 50%;
  margin-left: 10px;
  padding-bottom: 20px;
  border: 1px solid grey;
  border-radius: 10px;
}
</style>
