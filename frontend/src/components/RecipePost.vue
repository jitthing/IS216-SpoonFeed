<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { toast } from 'vue3-toastify'
import { useUser } from 'vue-clerk'
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
    name: props.userName ? props.userName : 'annoyomous',
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
        console.log(response.data)
        if (isSaved.value) {
          toast.success('Recipe saved!', {
            autoClose: 1000
          })
        } else {
          toast.info('Recipe unsaved!', {
            autoClose: 1000
          })
        }
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
</style>
