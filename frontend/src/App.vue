<script setup>
import axios from 'axios'
import { useUser } from 'vue-clerk'
import SignedOut from './views/SignedOut/SignedOut.vue'
import SignedIn from './views/SignedIn/SignedIn.vue'
import { watchEffect } from 'vue'

const { user, isSignedIn } = useUser()
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

async function checkUser(user) {
  try {
    axios
      .post(BACKEND_URL + '/check-user', {
        userId: user.value.id,
        firstName: user.value.firstName
      })
      .then((response) => {
        console.log(response.data)
      })
  } catch (error) {
    console.error(error)
  }
}

watchEffect(() => {
  if (isSignedIn) {
    checkUser(user)
  }
})
</script>

<template>
  <header>
    <!-- Create component of signed in view and signed out view, instead of rendering individual components like this -->
    <SignedOut v-if="!isSignedIn" />
    <SignedIn v-else />
  </header>
</template>

<style>
*::-webkit-scrollbar {
  display: none;
}
</style>
