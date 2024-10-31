<script setup>
import { useAuth } from 'vue-clerk'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { isSignedIn } = useAuth()
const router = useRouter()

onMounted(() => {
  // Wait for authentication state to be determined
  if (isSignedIn) {
    // Redirect to home page after successful authentication
    router.push('/')
  }
})
</script>

<template>
  <div class="sso-callback">
    <div class="loading-container">
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
}

.loading-container {
  text-align: center;
  padding: 2rem;
}
</style>
