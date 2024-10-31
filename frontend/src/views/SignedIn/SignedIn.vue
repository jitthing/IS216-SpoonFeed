<script setup>
import Menu from '@/components/Menu.vue'
import { UserButton, useUser } from 'vue-clerk'
import { RouterView } from 'vue-router'
import CreateRecipe from '@/components/CreateRecipe.vue'
import { watchEffect, ref } from 'vue'

const modalOpen = ref(false)
const isMenuOpen = ref(window.innerWidth >= 768)

const { user } = useUser()
const userId = ref('')
const userName = ref('')

watchEffect(() => {
  if (user.value) {
    console.log('User is signed in:', user.value.firstName)
    console.log('User ID:', user.value.id)
    userId.value = user.value.id
    userName.value = user.value.firstName
  } else {
    console.log('User is not signed in.')
  }
})

function openModal() {
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = true
  } else {
    isMenuOpen.value = false
  }
})
</script>

<template>
  <div class="container-fluid position-relative">
    <!-- Menu Toggle Button -->
    <button class="menu-toggle d-md-none" @click="toggleMenu" :class="{ 'menu-open': isMenuOpen }">
      <span class="hamburger"></span>
    </button>

    <div class="row">
      <div class="col-md-2 p-0" :class="{ 'd-none d-md-block': !isMenuOpen }">
        <Menu :isMenuOpen="isMenuOpen" @toggle-menu="toggleMenu" @open-create-recipe="openModal" />
      </div>

      <main :class="{ 'col-md-10': isMenuOpen, 'col-12': !isMenuOpen, 'p-0': true }">
        <RouterView />
        <CreateRecipe
          v-if="modalOpen"
          @close-modal="closeModal"
          :userId="userId"
          :userName="userName"
        />
      </main>
    </div>
  </div>

  <div class="profile">
    <router-link to="/profile" class="profile-link">My Profile</router-link>
    <UserButton />
  </div>
</template>

<style scoped>
.profile {
  position: absolute;
  top: 10px;
  right: 10px;
}
.image {
  margin: 10px;
}
.create-recipe {
  background-color: #523e2c;
  color: white;
  align-self: center;
  height: 50%;
  text-align: center;
  font-size: calc(1vw);
}
.profile-link {
  margin-right: 10px;
  text-decoration: none;
  color: #523e2c;
}

.menu-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(82, 62, 44, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-toggle:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.menu-toggle:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hamburger {
  position: relative;
  display: block;
  width: 20px;
  height: 2px;
  background: #523e2c;
  margin: auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: #523e2c;
  left: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.menu-toggle.menu-open .hamburger {
  transform: rotate(45deg);
}

.menu-toggle.menu-open .hamburger::before {
  transform: rotate(90deg);
  top: 0;
}

.menu-toggle.menu-open .hamburger::after {
  transform: rotate(90deg);
  bottom: 0;
}

@media (min-width: 768px) {
  main {
    margin-left: auto;
  }
}

main {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
