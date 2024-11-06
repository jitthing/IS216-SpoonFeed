<script setup>
const props = defineProps({
  meal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['closeModal'])
</script>

<template>
  <Transition name="modal" appear>
    <div class="modal-backdrop" @click.self="emit('closeModal')">
      <Transition name="modal-content">
        <div class="modal-body">
          <div class="modal-header">
            <h2 class="meal-title">{{ meal.name }}</h2>
            <button class="close-button" @click="emit('closeModal')">×</button>
          </div>

          <div class="meal-details">
            <div class="meal-stats">
              <span class="stat">
                <strong>Calories:</strong> {{ Number(meal.calories).toFixed(2) }} cal
              </span>
              <span class="stat"> <strong>Prep Time:</strong> {{ meal.prepTime }} </span>
            </div>

            <div class="section">
              <h3>Ingredients</h3>
              <ul class="ingredients-list">
                <li v-for="(ingredient, index) in meal.ingredients" :key="index">
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div class="section">
              <h3>Instructions</h3>
              <ol class="instructions-list">
                <li v-for="(instruction, index) in meal.instructions" :key="index">
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal-body {
  z-index: 1001;
  background-color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.meal-title {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #262626;
}

.meal-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat {
  background-color: #f5f5f5;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  font-size: 18px;
  color: #517470;
  margin-bottom: 12px;
}

.ingredients-list,
.instructions-list {
  padding-left: 24px;
  line-height: 1.6;
}

.ingredients-list li,
.instructions-list li {
  margin-bottom: 8px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
