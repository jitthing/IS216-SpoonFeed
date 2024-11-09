<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <RouterLink to="/" class="logo-link">
        <img class="logo" src="/src/assets/spoonfeed.jpeg" alt="Spoonfeed Logo" />
        <span class="brand-name">Spoonfeed</span>
      </RouterLink>
    </div>
    <div class="auth-buttons">
      <RouterLink to="/sign-in" class="auth-button sign-in">Sign In</RouterLink>
      <RouterLink to="/sign-up" class="auth-button sign-up">Sign Up</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
}

.logo {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 8px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #517470;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-button {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sign-in {
  color: #517470;
  border: 1px solid #517470;
}

.sign-in:hover {
  background-color: #f0f4f3;
}

.sign-up {
  background-color: #517470;
  color: white;
}

.sign-up:hover {
  background-color: #3f5b58;
}

/* Responsive design */
@media (max-width: 640px) {
  .navbar {
    padding: 1rem;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
