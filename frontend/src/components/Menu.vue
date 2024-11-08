<script setup>
import { RouterLink } from 'vue-router'
import { UserButton } from 'vue-clerk'

defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['openCreateRecipe', 'toggleMenu'])

const handleNavClick = () => {
  emit('toggleMenu')
}
</script>

<template>
  <Transition name="slide-fade" appear>
    <nav class="sidebar" :class="{ 'sidebar-open': isMenuOpen }">
      <div class="menu-content">
        <!-- Logo and Create Recipe Button -->
        <div class="menu-header">
          <img class="logo-image" src="../assets/spoonfeed.jpeg" alt="Logo" />
          <button class="create-recipe-btn" @click="$emit('openCreateRecipe')">
            Create Recipe
          </button>
        </div>

        <!-- Navigation Links -->
        <section class="navigation-links">
          <ul>
            <li>
              <RouterLink
                class="nav-link nav-item"
                :class="{ active: $route.path === '/dashboard' }"
                to="/dashboard"
                @click="handleNavClick"
              >
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link nav-item"
                :class="{ active: $route.path === '/online-recipes' }"
                to="/online-recipes"
                @click="handleNavClick"
              >
                Official Recipes
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link nav-item"
                :class="{ active: $route.path === '/community-recipe' }"
                to="/community-recipe"
                @click="handleNavClick"
              >
                Community Recipes
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link nav-item"
                :class="{ active: $route.path === '/meal-planner' }"
                to="/meal-planner"
                @click="handleNavClick"
              >
                Meal Planner
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="nav-link nav-item"
                :class="{ active: $route.path === '/profile' }"
                to="/profile"
                @click="handleNavClick"
              >
                Profile
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
      <div class="profile">
        <UserButton />
        <router-link to="/profile" class="profile-link" @click="handleNavClick"
          >My Profile</router-link
        >
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.profile {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.profile-link {
  margin-left: 10px;
  margin-right: 10px;
  text-decoration: none;
  color: #523e2c;
}
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
  background-color: #acbaa1;
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
  color: #acbaa1;
}

.nav-item.active {
  color: #acbaa1;
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
  background-color: #acbaa1;
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
