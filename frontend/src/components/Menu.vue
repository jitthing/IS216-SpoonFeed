<script setup>
import { RouterLink } from 'vue-router'
import CreateRecipe from './CreateRecipe.vue'
import { ref } from 'vue'

defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['openCreateRecipe'])

const isCreateRecipeOpen = ref(false)
</script>

<template>
  <nav class="sidebar" :class="{ 'sidebar-open': isMenuOpen }">
    <div class="menu-content">
      <!-- Logo and Create Recipe Button -->
      <div class="menu-header">
        <img class="logo-image" src="../assets/spoonfeed.jpeg" alt="Logo" />
        <button class="create-recipe-btn" @click="$emit('openCreateRecipe')">Create Recipe</button>
      </div>

      <!-- Navigation Links -->
      <section class="navigation-links">
        <ul>
          <li>
            <RouterLink
              class="nav-link nav-item"
              :class="{ active: $route.path === '/dashboard' }"
              to="/dashboard"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="nav-link nav-item"
              :class="{ active: $route.path === '/online-recipes' }"
              to="/online-recipes"
            >
              Online Recipes
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="nav-link nav-item"
              :class="{ active: $route.path === '/community-recipe' }"
              to="/community-recipe"
            >
              Community Recipes
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="nav-link nav-item"
              :class="{ active: $route.path === '/profile' }"
              to="/profile"
            >
              Profile
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  height: 100vh;
  padding: 1rem;
  transform: translateX(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.menu-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.create-recipe-btn {
  background-color: #523e2c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
}

.navigation-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 0.5rem;
  margin-bottom: 1rem;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.nav-item:hover {
  transform: translateX(10px);
  color: #523e2c;
}

.nav-item.active {
  color: #523e2c;
  font-weight: bold;
  transform: translateX(10px);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background-color: #523e2c;
  border-radius: 2px;
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    width: 250px;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .sidebar-open {
    transform: translateX(0);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }
}
</style>
