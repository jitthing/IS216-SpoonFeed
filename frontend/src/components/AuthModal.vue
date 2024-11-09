<script setup>
import { SignIn, SignUp } from 'vue-clerk'
import { useClerk } from 'vue-clerk'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['signin', 'signup'].includes(value)
  }
})

const { loaded, session } = useClerk()
const router = useRouter()

const closeModal = () => {
  router.push('/')
}

onMounted(() => {
  const handleClerkLoaded = async () => {
    if (session.value) {
      await router.push('/dashboard')
    }
  }
  if (loaded.value) {
    handleClerkLoaded()
  }
})

watch(session, (newSession) => {
  if (newSession) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>
      <template v-if="loaded">
        <SignIn
          v-if="props.mode === 'signin'"
          routing="path"
          path="/sign-in"
          forceRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
        <SignUp
          v-else
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/"
          signInUrl="/sign-in"
          redirectUrl="/sso-callback"
          oauthCallback="/sso-callback"
        />
      </template>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 550px;
  padding: 20px;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  color: white;
}

/* Mobile devices */
@media screen and (max-width: 480px) {
  .modal-content {
    max-width: 350px;
    padding: 10px;
  }
}

/* Tablets */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .modal-content {
    max-width: 450px;
  }
}
</style>
