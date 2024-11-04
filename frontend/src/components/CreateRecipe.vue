<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios, { all } from 'axios'
import { toast } from 'vue3-toastify'

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL
const NINJA_API_KEY = import.meta.env.VITE_APP_API_NINJA_KEY

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
const prepTime = ref('')
const editingIngredientIndex = ref(null) // Track which ingredient is being edited
const editingInstructionIndex = ref(null) // Track which instruction is being edited

const modalRef = ref(null)

onMounted(() => {
  // console.log("open")
  listMacros()
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 0)
})

onUnmounted(() => {
  // console.log("close")
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit('closeModal')
  }
}

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
    prepTime: prepTime.value,
    timestamp: timestamp,
    macros: macros.value,
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
      render: `Error: ${error.response?.data?.message}` || 'Failed to upload recipe',
      type: 'error',
      isLoading: false,
      autoClose: 3000 // Auto-close after 3 seconds
    })
  }
}

const listMacros = () => {
  // Calculate macros
  const ingredientList = allIngredients.value.join(', ')
  // console.log(ingredientList)
  axios
    .get('https://api.calorieninjas.com/v1/nutrition?query=' + ingredientList, {
      headers: {
        'X-Api-Key': NINJA_API_KEY
      }
    })
    .then((response) => {
      const data = response.data.items
      var macroCount = {} //calories, total fats, total saturated fats, total protein, total sodium, total carbs, total carbs
      macroCount.Calories = 0
      macroCount.Fats = 0
      macroCount.Protein = 0
      macroCount.Sodium = 0
      macroCount.Carbohydrates = 0

      for (const item of data) {
        //supposed to iterate through all ingredients and not response data
        ;(macroCount.Calories += item.calories),
          (macroCount.Fats += item.fat_total_g),
          (macroCount.Protein += item.protein_g),
          (macroCount.Sodium += item.sodium_mg),
          (macroCount.Carbohydrates += item.carbohydrates_total_g)
      }
      // console.log(macroCount)
      macros.value = macroCount
    })
    .catch((error) => {
      console.error(error)
    })
}

const addIngredient = () => {
  if (currIngredient.value.trim() !== '') {
    allIngredients.value.push(currIngredient.value.trim())
    currIngredient.value = ''
    listMacros(allIngredients.value)
  } else {
    alert('Please enter a valid ingredient')
  }
}

const removeIngredient = (index) => {
  allIngredients.value.splice(index, 1)
  listMacros(allIngredients.value)
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
    listMacros()
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
    <div class="modal-body container" ref="modalRef">
      <h1>Create Recipe</h1>
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
                <button class="btn" @click.stop="editIngredient(index)">Edit</button>
                <button class="btn" @click.stop="removeIngredient(index)">Remove</button>
              </span>
              <span v-else>
                <input
                  type="text"
                  v-model="currIngredient"
                  @keydown.enter.prevent="confirmEditIngredient(index)"
                />
                <button class="btn" @click.stop="confirmEditIngredient(index)">Confirm</button>
                <button class="btn" @click.stop="cancelEditIngredient">Cancel</button>
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
                <button class="btn" @click.stop="editInstruction(index)">Edit</button>
                <button class="btn" @click.stop="removeInstruction(index)">Remove</button>
              </span>
              <span v-else>
                <input
                  type="text"
                  v-model="currInstruction"
                  @keydown.enter.prevent="confirmEditInstruction(index)"
                />
                <button class="btn" @click.stop="confirmEditInstruction(index)">Confirm</button>
                <button class="btn" @click.stop="cancelEditInstruction">Cancel</button>
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
        <div class="mb-3">
          <label for="recipePrepTime" class="form-label">Recipe Prep Time (mins)</label>
          <input type="number" class="form-control" id="recipePrepTime" v-model="prepTime" />
        </div>
        <div class="mb-3">Macronutrient information</div>
        <div class="macros">
          <span v-for="(key, macro) in macros"
            >{{ macro }}: {{ key }}
            <span v-if="macro == 'Calories'">kcal</span>
            <span v-else-if="macro == 'Sodium'">mg</span>
            <span v-else>g</span> <br />
          </span>
        </div>
        <button class="btn" @click.stop="submitRecipe">Submit</button>
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
  margin: 0 2vh;
  border-radius: 25px;
  padding: 10px;
  max-height: 80vh;
  overflow-y: auto;
}
button {
  background-color: #acbaa1;
  color: white;
  border-radius: 10px;
  padding: 3px;
  margin: 2px;
}
.macros {
  border: solid 1px #dee2e6;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
}
</style>
