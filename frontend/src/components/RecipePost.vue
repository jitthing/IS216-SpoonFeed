<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'

const props = defineProps({
  userId: String,
  userName: String,
  recipeDetails: Object
})

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const isSaved = ref(false)
const comments = ref([])
const newComment = ref('')
const numSaves = ref(props.recipeDetails.numSaves || 0)

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
  numSaves.value = isSaved.value ? numSaves.value + 1 : numSaves.value - 1
  updateSaved()
}

const addComment = () => {
  comments.value.push({
    name: props.userName,
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

const deleteRecipe = async () => {
  try {
    axios.post(BACKEND_URL + '/delete-recipe', { recipeId: props.recipeDetails.id })
    toast.success('Recipe deleted!', {
      autoClose: 1000
    })
    emit('closeModal')
  } catch (error) {
    console.error(error)
  }
}

const emit = defineEmits(['closeModal'])
</script>

<template>
  <!-- Add transition wrapper -->
  <Transition name="modal" appear>
    <div class="modal-backdrop" @click.self="emit('closeModal')">
      <Transition name="modal-content">
        <div class="modal-body">
          <!-- Post Header -->
          <div class="post-header">
            <div class="author-info">
              <div class="author-avatar">{{ recipeDetails.author?.charAt(0).toUpperCase() }}</div>
              <span class="author-name">{{ recipeDetails.author }}</span>
            </div>
            <div>
              <button
                class="delete-btn"
                @click="deleteRecipe"
                v-if="recipeDetails.authorId === userId"
              >
                Delete
              </button>
              <button class="close-button" @click="emit('closeModal')">×</button>
            </div>
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
            <span class="saves-count">{{ numSaves }} saves</span>
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
              <input
                v-model="newComment"
                placeholder="Add a comment..."
                @keyup.enter="addComment"
              />
              <button @click="addComment" class="post-comment-btn">Post</button>
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
  background-color: rgba(0, 0, 0, 0.75); /* Translucent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px); /* Optional: adds slight blur to background */
}

.modal-body {
  z-index: 1001;
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

.delete-btn {
  background-color: #523e2c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 12px;
}

.delete-btn:hover {
  background-color: #3e2e21;
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

/* Add transition animations */
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
