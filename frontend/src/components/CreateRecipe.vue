<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

// Props
const props = defineProps({
  userId: String
})

// Emit close modal event
const emit = defineEmits(['closeModal'])

// Reactive variables (similar to data in Options API)
const recipeName = ref('')
const currIngredient = ref('')
const allIngredients = ref([])
const recipeImage = ref(null)
const currInstruction = ref('')
const allInstructions = ref([])

// Functions
const submitRecipe = async () => {
  const formData = new FormData()
  const recipeData = {
    recipeAuthor: props.userId,
    recipeName: recipeName.value,
    recipeIngredients: allIngredients.value,
    recipeInstructions: allInstructions.value
  }

  formData.append('recipeData', JSON.stringify(recipeData))
  if (recipeImage.value) {
    formData.append('recipeImage', recipeImage.value)
  }

  const toastId = toast.loading('Uploading recipe...')

  try {
    const response = await axios.post(`${BACKEND_URL}/upload-recipe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    emit('closeModal') // Emit event to close modal
    toast.update(toastId, {
      render: 'Recipe submitted successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000 // Auto-close after 3 seconds
    })
  } catch (error) {
    toast.update(toastId, {
      render: `Error: ${error.message}`,
      type: 'error',
      isLoading: false,
      autoClose: 3000 // Auto-close after 3 seconds
    })
  }
}

const addIngredient = () => {
  if (currIngredient.value.trim() !== '') {
    allIngredients.value.push(currIngredient.value.trim())
    currIngredient.value = ''
  } else {
    alert('Please enter a valid ingredient')
  }
}

const removeIngredient = (index) => {
  allIngredients.value.splice(index, 1)
}

const addInstruction = () => {
  if (currInstruction.value.trim() !== '') {
    allInstructions.value.push(currInstruction.value.trim())
    currInstruction.value = ''
  } else {
    alert('Please enter a valid instruction')
  }
}

const removeInstruction = (index) => {
  allInstructions.value.splice(index, 1)
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  recipeImage.value = file
  console.log(recipeImage.value)
}
</script>
<!-- 
<script>
import axios from 'axios'
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

export default {
  props: {
    userId: String
  },
  data() {
    return {
      recipeName: '',
      currIngredient: '',
      allIngredients: [],
      recipeImage: null,
      currInstruction: '',
      allInstructions: []
    }
  },
  emits: ['closeModal'],
  methods: {
    async submitRecipe() {
      const formData = new FormData()
      const recipeData = {
        recipeAuthor: this.userId,
        recipeName: this.recipeName,
        recipeIngredients: this.allIngredients,
        recipeInstructions: this.allInstructions
      }
      formData.append('recipeData', JSON.stringify(recipeData))
      if (this.recipeImage) {
        formData.append('recipeImage', this.recipeImage)
      }
      axios
        .post(BACKEND_URL + '/upload-recipe', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          this.$emit('closeModal')
          alert('works!')
        })
        .catch((error) => {
          console.error(error)
        })
    },
    addIngredient() {
      if (this.currIngredient.trim() !== '') {
        this.allIngredients.push(this.currIngredient.trim())
        this.currIngredient = ''
      } else {
        alert('Please enter a valid ingredient')
      }
    },
    removeIngredient(index) {
      this.allIngredients.splice(index, 1)
    },
    addInstruction() {
      if (this.currInstruction.trim() !== '') {
        this.allInstructions.push(this.currInstruction.trim())
        this.currInstruction = ''
      } else {
        alert('Please enter a valid instruction')
      }
    },
    removeInstruction(index) {
      this.allInstructions.splice(index, 1)
    },
    onFileChange(e) {
      console.log('filed changed')
      const file = e.target.files[0]
      this.recipeImage = file
      console.log(this.recipeImage)
    }
  }
}
</script> -->

<template>
  <div class="modal-container">
    <div class="modal-body container">
      <h1 @click="$emit('closeModal')">Create Recipe (Click on me to close the form)</h1>
      <div>
        <div class="mb-3">
          <label for="recipeName" class="form-label">Recipe Name</label>
          <input type="text" class="form-control" id="recipeName" v-model="recipeName" />
        </div>
        <div class="mb-3">
          <label for="recipeImage" class="form-label">Recipe Image</label>
          <input type="file" class="form-control" id="recipeImage" @change="onFileChange" />
        </div>
        <div class="mb-3">
          <label for="recipeIngredients" class="form-label">Recipe Ingredients</label>
          <ul>
            <li v-for="(ingredient, index) in allIngredients" :key="index">
              {{ ingredient }}
              <button @click="removeIngredient(index)">Remove</button>
            </li>
          </ul>
          <input
            type="text"
            class="form-control"
            id="recipeIngredients"
            placeholder="Type your ingredients here"
            v-model="currIngredient"
            @keydown.enter="addIngredient"
          />
        </div>
        <div class="mb-3">
          <label for="recipeInstructions" class="form-label">Recipe Instructions</label>
          <ol>
            <li v-for="(instruction, index) in allInstructions" :key="index">
              {{ instruction }}
              <button @click="removeInstruction(index)">Remove</button>
            </li>
          </ol>
          <input
            type="text"
            class="form-control"
            id="recipeInstructions"
            placeholder="Type your instructions here"
            v-model="currInstruction"
            @keydown.enter="addInstruction"
          />
        </div>
        <button class="btn" @click="submitRecipe">Submit</button>
      </div>
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
}
button {
  background-color: #523e2c;
  color: white;
}
</style>
