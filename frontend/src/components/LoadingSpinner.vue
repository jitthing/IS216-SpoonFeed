<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  },
  color: {
    type: String,
    default: '#acbaa1' // Your theme color
  }
})
</script>

<template>
  <div class="loading-container" :class="size">
    <div class="loading-spinner" :style="{ borderTopColor: color }"></div>
    <slot>
      <p class="loading-text">Loading...</p>
    </slot>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(172, 186, 161, 0.3);
  border-radius: 50%;
  border-top-color: #acbaa1;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

.loading-text {
  color: #517470;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.1rem;
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Size variants */
.small .loading-spinner {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.large .loading-spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
