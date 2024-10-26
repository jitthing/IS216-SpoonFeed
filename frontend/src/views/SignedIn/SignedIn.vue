<script setup>
import Menu from '@/components/Menu.vue'
import { UserButton, useUser } from 'vue-clerk'
import { RouterView } from 'vue-router'
import CreateRecipe from '@/components/CreateRecipe.vue'
import { watchEffect, ref } from 'vue'

const modalOpen = ref(false)

const { user, isLoaded } = useUser()
const userId = user.value.id
const userName = user.value.firstName

watchEffect(() => {
  if (isLoaded) {
    console.log('User is signed in:', user.value.firstName)
    console.log('User ID:', user.value.id)
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
</script>

<template>
  <div class="container-fluid row">
    <div class="p-0 col-2">
      <div class="container-fluid p-0">
        <img
          class="image col-xl-5 col-lg-12"
          src="/src/assets/spoonfeed.jpeg"
          alt=""
          height="80"
          width="80"
        />
        <button type="button" class="create-recipe col-xl-5 col-lg-12 btn" @click="openModal">
          Create Recipe
        </button>
      </div>
      <Menu class="col-12" />
    </div>
    <RouterView class="col-10 p-0" />
    <CreateRecipe
      class="col-10"
      v-if="modalOpen"
      @close-modal="closeModal"
      :userId="userId"
      :userName="userName"
    />
  </div>

  <div class="profile"><UserButton /></div>
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
</style>
