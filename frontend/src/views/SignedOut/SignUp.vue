<script setup>
import { SignUp } from 'vue-clerk'
</script>

<template>
  <div class="outerbox">
    <div class="content-wrapper">
      <SignUp path="/sign-up" sign-in-url="/sign-in" />
    </div>
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
.outerbox {
  position: relative;
  background-image: url('/src/assets/background.png');
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>
