<script setup>
import { SignIn } from 'vue-clerk'
</script>

<template>
  <div class="outerbox">
    <div class="content-wrapper">
      <div class="signIn">
        <SignIn path="/sign-in" after-sign-in-url="/" sign-up-url="/sign-up" />
      </div>
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
.outerbox{
  position: relative;
  background-image: url("/src/assets/background.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>
