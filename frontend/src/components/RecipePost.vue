<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'

const props = defineProps({
  userId: String,
  userName: String,
  userEmail: String,
  recipeDetails: Object
})

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const isSaved = ref(false)
const comments = ref([])
const newComment = ref('')

onMounted(() => {
  checkSaved()
})

watchEffect(() => {
  if (props.recipeDetails) {
    comments.value = props.recipeDetails.comments ? props.recipeDetails.comments : []
  }
})

const toggleSave = () => {
  isSaved.value = !isSaved.value
  updateSaved()
}

const addComment = () => {
  comments.value.push({
    name: props.userName ? props.userName : props.userEmail.split('@')[0],
    text: newComment.value
  })
  newComment.value = ''
  updateRecipe()
}

const checkSaved = async () => {
  //   console.log(props.userId)
  try {
    axios
      .post(BACKEND_URL + '/check-user', {
        userId: props.userId
      })
      .then((response) => {
        // console.log(response.data)
        const savedRecipes = response.data.userData.CommunitySaved
        if (savedRecipes.includes(props.recipeDetails.id)) {
          isSaved.value = true
        }
      })
  } catch (error) {
    console.error(error)
  }
}

const updateRecipe = async () => {
  try {
    axios
      .post(BACKEND_URL + '/update-recipe', {
        recipeId: props.recipeDetails.id,
        comments: comments.value
      })
      .then((response) => {
        console.log(response.data)
      })
  } catch (error) {
    console.error(error)
  }
}

const updateSaved = async () => {
  //   console.log(props.user.value.id)
  try {
    axios
      .post(BACKEND_URL + '/update-saved-community', {
        userId: props.userId,
        recipeId: props.recipeDetails.id,
        saved: isSaved.value
      })
      .then((response) => {
        // console.log(response.data)
        if (isSaved.value) {
          toast.success('Recipe saved!', {
            autoClose: 1000
          })
        } else {
          toast.warning('Recipe unsaved!', {
            autoClose: 1000
          })
        }
        axios
          .post(BACKEND_URL + '/update-recipe', {
            recipeId: props.recipeDetails.id,
            saved: isSaved.value
          })
          .then((response) => {
            console.log(response.data)
          })
      })
  } catch (error) {
    console.error(error)
  }
}

const emit = defineEmits(['closeModal'])
</script>

<template>
  <div class="modal-container">
    <div class="modal-body">
      <!-- Post Header -->
      <div class="post-header">
        <div class="author-info">
          <div class="author-avatar">{{ recipeDetails.author?.charAt(0).toUpperCase() }}</div>
          <span class="author-name">{{ recipeDetails.author }}</span>
        </div>
        <button class="close-button" @click="emit('closeModal')">×</button>
      </div>

      <!-- Post Image -->
      <div class="image-container">
        <img :src="recipeDetails.imageUrl" alt="Recipe Image" class="post-image" />
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="toggleSave" :class="{ saved: isSaved }" class="save-button">
          <span v-if="isSaved">★</span>
          <span v-else>☆</span>
        </button>
        <span class="saves-count">{{ recipeDetails.numSaves || 0 }} saves</span>
      </div>

      <!-- Recipe Title -->
      <h1 class="recipe-title">{{ recipeDetails.name }}</h1>

      <!-- Recipe Details -->
      <div class="recipe-details">
        <div class="section">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            <li v-for="ingredient in recipeDetails.ingredients">{{ ingredient }}</li>
          </ul>
        </div>

        <div class="section">
          <h3>Instructions</h3>
          <ol class="instructions-list">
            <li v-for="instruction in recipeDetails.instructions">{{ instruction }}</li>
          </ol>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>Comments</h3>
        <ul class="comments-list">
          <li v-for="comment in comments" :key="comment.id" class="comment">
            <span class="comment-author">{{ comment.name }}</span>
            <span class="comment-text">{{ comment.text }}</span>
          </li>
        </ul>
        <div class="comment-input">
          <input v-model="newComment" placeholder="Add a comment..." @keyup.enter="addComment" />
          <button @click="addComment" class="post-comment-btn">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-body {
  z-index: 20;
  background-color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 935px;
  height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #dbdbdb;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  background-color: #523e2c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.author-name {
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #262626;
}

.image-container {
  width: 100%;
  max-height: 450px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-buttons {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #262626;
  padding: 8px;
}

.save-button.saved {
  color: #523e2c;
}

.saves-count {
  font-size: 14px;
  color: #262626;
  font-weight: 600;
}

.recipe-title {
  padding: 0 16px;
  margin: 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.recipe-details {
  padding: 16px;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.ingredients-list,
.instructions-list {
  padding-left: 24px;
  line-height: 1.5;
}

.comments-section {
  padding: 16px;
  border-top: 1px solid #dbdbdb;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}

.comment {
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  margin-right: 8px;
}

.comment-input {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #dbdbdb;
}

.comment-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 14px;
}

.post-comment-btn {
  background-color: #523e2c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.post-comment-btn:hover {
  background-color: #3e2e21;
}
</style>

<!-- <template>
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
        <ul class="comments">
          <li v-for="comment in comments" :key="comment.id">
            {{ comment.text }} by {{ comment.name }}
          </li>
        </ul>
        <input v-model="newComment" placeholder="Add a comment..." />
        <button @click="addComment">Post</button>
      </div>
      <button @click="emit('closeModal')">Close</button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  border-radius: 25px;
}
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
.comments {
  list-style-type: none;
  padding: 0;
}
</style> -->
