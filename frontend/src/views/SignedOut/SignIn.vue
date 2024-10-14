<script setup>
import { SignIn } from 'vue-clerk'
</script>

<template>
  <div class="content-wrapper">
    <SignIn path="/sign-in" after-sign-in-url="/dashboard" sign-up-url="/sign-up" />
  </div>
</template>

<style scoped>
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: 90vh;
  width: 100vh;
}
</style>
