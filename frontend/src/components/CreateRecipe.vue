<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

// Props
const props = defineProps({
  userId: String,
  userName: String
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
const macros = ref('')
const editingIngredientIndex = ref(null) // Track which ingredient is being edited
const editingInstructionIndex = ref(null) // Track which instruction is being edited

// Functions
const submitRecipe = async () => {
  const formData = new FormData()
  const timestamp = Date.now()

  const recipeData = {
    recipeAuthorId: props.userId,
    recipeAuthor: props.userName,
    recipeName: recipeName.value,
    recipeIngredients: allIngredients.value,
    recipeInstructions: allInstructions.value,
    numSaves: 0,
    timestamp: timestamp,
    type: 'community'
  }

  if (recipeImage.value) {
    const fileExtension = recipeImage.value.name.split('.').pop()
    const fileName = `${recipeName.value}-${timestamp}.${fileExtension}`
    formData.append('recipeImage', recipeImage.value, fileName)
  }
  formData.append('recipeData', JSON.stringify(recipeData))
  console.log(recipeData)
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
      render: `Error: ${error.response?.data?.message || 'Failed to upload recipe'}`,
      type: 'error',
      isLoading: false,
      autoClose: 3000 // Auto-close after 3 seconds
    })
  }
}

const calculateMacros = () => {
  // Calculate macros
  if (allIngredients.value.length === 0) {
    const toast = toast.error('Please add ingredients to calculate macros')
  } else {
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

const editIngredient = (index) => {
  editingIngredientIndex.value = index
  currIngredient.value = allIngredients.value[index]
}

const confirmEditIngredient = (index) => {
  if (currIngredient.value.trim() !== '') {
    allIngredients.value.splice(index, 1, currIngredient.value.trim())
    currIngredient.value = ''
    editingIngredientIndex.value = null
  } else {
    alert('Please enter a valid ingredient')
  }
}

const editInstruction = (index) => {
  editingInstructionIndex.value = index
  currInstruction.value = allInstructions.value[index]
}

const confirmEditInstruction = (index) => {
  if (currInstruction.value.trim() !== '') {
    allInstructions.value.splice(index, 1, currInstruction.value.trim())
    currInstruction.value = ''
    editingInstructionIndex.value = null
  } else {
    alert('Please enter a valid instruction')
  }
}

const cancelEditIngredient = () => {
  editingIngredientIndex.value = null
  currIngredient.value = ''
}

const cancelEditInstruction = () => {
  editingInstructionIndex.value = null
  currInstruction.value = ''
}
</script>

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
              <span v-if="editingIngredientIndex !== index">
                {{ ingredient }}
                <button @click="editIngredient(index)">Edit</button>
                <button @click="removeIngredient(index)">Remove</button>
              </span>
              <span v-else>
                <input
                  type="text"
                  v-model="currIngredient"
                  @keydown.enter.prevent="confirmEditIngredient(index)"
                />
                <button @click="confirmEditIngredient(index)">Confirm</button>
                <button @click="cancelEditIngredient">Cancel</button>
              </span>
            </li>
          </ul>
          <input
            type="text"
            class="form-control"
            id="recipeIngredients"
            placeholder="Press Enter to add your ingredient"
            v-model="currIngredient"
            @keydown.enter="addIngredient"
          />
        </div>
        <div class="mb-3">
          <label for="recipeInstructions" class="form-label">Recipe Instructions</label>
          <ol>
            <li v-for="(instruction, index) in allInstructions" :key="index">
              <span v-if="editingInstructionIndex !== index">
                {{ instruction }}
                <button @click="editInstruction(index)">Edit</button>
                <button @click="removeInstruction(index)">Remove</button>
              </span>
              <span v-else>
                <input
                  type="text"
                  v-model="currInstruction"
                  @keydown.enter.prevent="confirmEditInstruction(index)"
                />
                <button @click="confirmEditInstruction(index)">Confirm</button>
                <button @click="cancelEditInstruction">Cancel</button>
              </span>
            </li>
          </ol>
          <input
            type="text"
            class="form-control"
            id="recipeInstructions"
            placeholder="Press Enter to add your instruction"
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
  border-radius: 10px;
}
</style>
