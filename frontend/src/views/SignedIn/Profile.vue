<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useUser } from 'vue-clerk'
import RecipeCard from '@/components/Card.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'
import CreateBoard from '@/components/CreateBoard.vue'  // Ensure you import CreateBoard.vue

// Modal state
const modalOpen = ref(false)
const showCreateBoardModal = ref(false)  // For Create Board modal
const selectedBoard = ref(null)  // To track which board is selected
const createdRecipes = ref([])
const savedBoards = ref([])  // Store created boards
const unorganizedImages = ref([])  // Store unorganized saved images

const { user, isLoaded } = useUser()
const activeTab = ref('created')

// Load user information when mounted
onMounted(async () => {
  if (isLoaded.value) {
    // Fetch created recipes and saved boards (if needed)
    // Fetch unorganized images for the user if needed
  }
})

// Watch for changes in user state
watchEffect(() => {
  if (isLoaded.value) {
    console.log('User is signed in:', user.value.firstName)
    console.log('User ID:', user.value.id)
  } else {
    console.log('User is not signed in.')
  }
})

// Modal functions
function openModal() {
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

function openCreateBoardModal() {
  showCreateBoardModal.value = true
}

function closeCreateBoardModal() {
  showCreateBoardModal.value = false
}

// Handle tab switching
const setActiveTab = (tab) => {
  activeTab.value = tab
}

// Add a new board to savedBoards
const addBoard = (boardName) => {
  const newBoard = {
    id: Date.now(),  // Temporary ID, could be replaced with server-generated ID
    name: boardName,
    recipes: []  // Store pinned recipes in each board
  }

  savedBoards.value.push(newBoard)
  closeCreateBoardModal()  // Close the modal after creation
}

// Pin a recipe to a specific board
const pinRecipeToBoard = (board, recipe) => {
  const boardToPinTo = savedBoards.value.find(b => b.id === board.id)
  if (boardToPinTo && !boardToPinTo.recipes.includes(recipe)) {
    boardToPinTo.recipes.push(recipe)  // Add the recipe to the board
  }
}

// View the contents of a selected board
const viewBoard = (board) => {
  selectedBoard.value = board
}

</script>

<template>
  <div class="profile-container" v-if="isLoaded">

    <div class="profile-content">
      <div class="profile-header">
        <img :src="user.profileImageUrl" alt="Profile Picture" class="profile-picture">
        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        <p>@{{ user.username }}</p>
      </div>

      <div class="tab-container">
        <button 
          @click="setActiveTab('created')" 
          :class="{ active: activeTab === 'created' }"
        >
          Created
        </button>
        <button 
          @click="setActiveTab('saved')" 
          :class="{ active: activeTab === 'saved' }"
        >
          Saved
        </button>
      </div>

      <!-- Created Tab -->
      <div v-if="activeTab === 'created'">
        <div v-if="createdRecipes.length === 0" class="empty-state">
          <p>Nothing to show...yet! Recipes you create will live here.</p>
          <button @click="openModal" class="create-recipe-btn">Create Recipe</button>
        </div>
        <div v-else class="recipes-grid">
          <RecipeCard v-for="recipe in createdRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
        <button @click="openModal" class="create-recipe-btn" v-if="createdRecipes.length > 0">Create Recipe</button>
      </div>

      <!-- Saved Tab -->
      <div v-if="activeTab === 'saved'">
        <div v-if="savedBoards.length === 0" class="empty-state">
          <p>No boards yet. Create a board to start saving recipes!</p>
          <button @click="openCreateBoardModal" class="create-board-btn">Create Board</button>
        </div>
        <div v-else class="boards-grid">
          <!-- Loop through savedBoards to display each board -->
          <div v-for="board in savedBoards" :key="board.id" class="board-item" @click="viewBoard(board)">
            {{ board.name }}
          </div>
        </div>

        <!-- Selected Board's Recipes -->
        <div v-if="selectedBoard">
          <h2>{{ selectedBoard.name }}'s Recipes</h2>
          <div v-if="selectedBoard.recipes.length === 0">
            <p>This board doesn't have any recipes yet.</p>
          </div>
          <div v-else class="recipes-grid">
            <RecipeCard v-for="recipe in selectedBoard.recipes" :key="recipe.id" :recipe="recipe" />
          </div>
        </div>

        <!-- Unorganized Images Section -->
        <div v-if="unorganizedImages.length > 0">
          <h2>Unorganized Images</h2>
          <div class="recipes-grid">
            <RecipeCard v-for="image in unorganizedImages" :key="image.id" :recipe="image" />
          </div>
        </div>
        <div v-else class="empty-state">
          <hr class="divider" /> 
          <p>No unorganized images found.</p>
        </div>
        </div>
      </div>

      <!-- Create Board Modal -->
      <CreateBoard v-if="showCreateBoardModal" @closeModal="closeCreateBoardModal" @create-board="addBoard" />

      <!-- Create Recipe Modal -->
      <CreateRecipe 
        v-if="modalOpen"  
        @close-modal="closeModal" 
      />
    </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-content {
  flex: 1;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-container button {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
}

.tab-container button.active {
  background-color: #523e2c;
  color: white;
}

.recipes-grid, .boards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  margin-top: 50px;
}

.create-recipe-btn, .create-board-btn {
  background-color: #523e2c;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.create-recipe-btn:hover, .create-board-btn:hover {
  background-color: #3e2e21;
}
</style>
