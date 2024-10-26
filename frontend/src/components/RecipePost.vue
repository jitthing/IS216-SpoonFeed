<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const isSaved = ref(false)
const comments = ref([])
const newComment = ref('')

const props = defineProps({
  userId: String,
  recipeDetails: null
})

const toggleSave = () => {
  isSaved.value = !isSaved.value
}

const addComment = () => {
  comments.value.push({
    id: comments.value.length + 1,
    text: newComment.value
  })
  newComment.value = ''
}

const emit = defineEmits(['closeModal'])
</script>

<template>
  <div class="modal-container">
    <div class="modal-body">
      <div class="post-header">
        <img :src="recipeDetails.imageUrl" alt="Recipe Image" class="post-image" />
        <h1>{{ recipeDetails.name }}</h1>
        <span>
          <h2>By {{ recipeDetails.author }}</h2>
          <button @click="toggleSave" :class="{ saved: isSaved }" class="save-button">
            <span v-if="isSaved">★</span>
            <span v-else>☆</span>
          </button>
        </span>

        <h3>Ingredients</h3>
        <ul>
          <li v-for="ingredient in recipeDetails.ingredients">{{ ingredient }}</li>
        </ul>
        <h3>Instructions</h3>
        <ol>
          <li v-for="instruction in recipeDetails.instructions">{{ instruction }}</li>
        </ol>
      </div>
      <div class="comments-section">
        <h3>Comments</h3>
        <ul>
          <li v-for="comment in comments" :key="comment.id">{{ comment.text }}</li>
        </ul>
        <input v-model="newComment" placeholder="Add a comment..." />
        <button @click="addComment">Post</button>
      </div>
      <button @click="emit('closeModal')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  z-index: 10;
  position: fixed;
  top: 0;
  left: calc((100vw / 6));
  width: 82%;
  height: 100%;
  background-color: #00000080;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-body {
  z-index: 20;
  background-color: #fff;
  border-radius: 25px;
  padding: 10px;
  margin: 0 10vw;
  height: 70vh;
  overflow-y: auto;
}
button {
  background-color: #523e2c;
  color: white;
}
img {
}
</style>
