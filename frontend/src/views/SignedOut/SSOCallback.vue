<script setup>
import { useAuth } from 'vue-clerk'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const { isSignedIn, isLoaded } = useAuth()
const router = useRouter()

watch([isSignedIn, isLoaded], ([newIsSignedIn, newIsLoaded]) => {
  if (newIsLoaded && newIsSignedIn) {
    router.push('/')
  }
})
</script>

<template>
  <div class="sso-callback">
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  </div>
</template>

<style scoped>
.sso-callback {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #523e2c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
