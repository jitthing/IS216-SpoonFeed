<script>
export default {
  emits: ['closeModal']
}
</script>

<template>
  <div class="modal-container">
    <div class="modal-body">
      <h1 @click="$emit('closeModal')">Create Recipe (Click on me to close the form)</h1>
      <form>
        <div class="mb-3">
          <label for="recipeName" class="form-label">Recipe Name</label>
          <input type="text" class="form-control" id="recipeName" />
        </div>
        <div class="mb-3">
          <label for="recipeImage" class="form-label">Recipe Image</label>
          <input type="file" class="form-control" id="recipeImage" />
        </div>
        <div class="mb-3">
          <label for="recipeIngredients" class="form-label">Recipe Ingredients</label>
          <textarea class="form-control" id="recipeIngredients" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label for="recipeInstructions" class="form-label">Recipe Instructions</label>
          <textarea class="form-control" id="recipeInstructions" rows="3"></textarea>
        </div>
        <button type="submit" class="btn">Submit</button>
      </form>
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
