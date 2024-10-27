<script setup>
import { RouterLink } from 'vue-router'
</script>

<!-- <template>
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
</style> -->

<template>
  <nav class="navigation-container">
    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/051d50d98b800bd765f41efcc267bd378047656ce8c99147959177eb6e11538d?placeholderIfAbsent=true&apiKey=3d645b295fdd4c58b9ee9c63fae10398" class="background-image" alt="" />
    <section class="navigation-links">
      <ul>
        <li><RouterLink class="nav-link nav-item" to="/dashboard">Home</RouterLink></li>
        <li><RouterLink class="nav-link nav-item" to="/online-recipes">Online Recipes</RouterLink></li>
        <li><RouterLink class="nav-link nav-item" to="/community-recipe">Community Recipes</RouterLink></li>
        <li><RouterLink class="nav-link nav-item" to="/profile">Profile</RouterLink></li>
      </ul>
    </section>
  </nav>
</template>

<style scoped>
.navigation-container {
  display: flex;
  flex-direction: column;
  position: relative;
  aspect-ratio: 0.282;
  margin: 5px 0 0;
  color: #000;
  letter-spacing: -1.6px;
  padding: 71px 8px 496px;
  font: 400 32px DM Serif Text, sans-serif;
}

.navigation-links {
  font-size: 28px;
  padding-right: 0px;
}

.background-image {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: inherit;
  margin-bottom: 30px;
}
</style>
