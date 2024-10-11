<script setup>
import { SignUp } from 'vue-clerk'
</script>

<template>
  <div class="content-wrapper">
    <SignUp path="/sign-up" after-sign-up-url="/" sign-in-url="/sign-in" />
  </div>
</template>

<style scoped>
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: 100vh;
  width: 100vh;
}
</style>
