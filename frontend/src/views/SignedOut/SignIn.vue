<script setup>
import { SignIn } from 'vue-clerk'
import { useClerk } from 'vue-clerk'

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { loaded, session } = useClerk()
const router = useRouter()
onMounted(() => {
  // Handle clerk handshake and potential redirects
  const handleClerkLoaded = async () => {
    if (session.value) {
      // If user is already authenticated, redirect to home or dashboard
      await router.push('/')
    }
  }
  if (loaded.value) {
    handleClerkLoaded()
  }
})
</script>

<template>
  <div class="outerbox">
    <div class="content-wrapper">
      <div class="signIn">
        <template v-if="loaded">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </template>
        <div v-else>
          Loading...
          <!-- Or add a loading spinner component -->
        </div>
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

  .signIn {
    width: 100%;
    max-width: 350px;
  }
}

/* Tablets */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .signIn {
    width: 100%;
    max-width: 450px;
  }
}

/* Laptops and smaller desktops */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .signIn {
    width: 100%;
    max-width: 500px;
  }
}

/* Large desktops */
@media screen and (min-width: 1025px) {
  .signIn {
    width: 100%;
    max-width: 550px;
  }
}
</style>
