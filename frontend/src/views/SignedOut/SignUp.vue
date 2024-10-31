<script setup>
import { SignUp } from 'vue-clerk'
</script>

<template>
  <div class="outerbox">
    <div class="content-wrapper">
      <div class="signUp">
        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/"
          signInUrl="/sign-in"
          redirectUrl="/sso-callback"
          oauthCallback="/sso-callback"
        />
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
  min-height: 90vh;
  width: 100%;
  padding: 1rem;
}

.outerbox {
  position: relative;
  background-image: url('/src/assets/background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

/* Mobile devices */
@media screen and (max-width: 480px) {
  .content-wrapper {
    padding: 0.5rem;
  }

  .signUp {
    width: 100%;
    max-width: 350px;
  }
}

/* Tablets */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .signUp {
    width: 100%;
    max-width: 450px;
  }
}

/* Laptops and smaller desktops */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .signUp {
    width: 100%;
    max-width: 500px;
  }
}

/* Large desktops */
@media screen and (min-width: 1025px) {
  .signUp {
    width: 100%;
    max-width: 550px;
  }
}
</style>
