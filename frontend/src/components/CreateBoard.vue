<template>
    <div class="modal-backdrop">
      <div class="modal-content">
        <button class="close-btn" @click="$emit('closeModal')">X</button> <!-- Close button -->
        <h2>Create board</h2>
  
        <div class="input-group">
          <label for="boardName">Name</label>
          <input 
            id="boardName"
            type="text"
            v-model="boardName"
            placeholder='Like "Pastries" or "Recipes to Make"'
          />
          <span v-if="error" class="error-message">Don't forget to name your board!</span>
        </div>
  
        <button @click="createBoard" class="create-btn">Create</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const boardName = ref('')
  const error = ref(false)
  
  // Emit the board name back to the parent on creation
  const createBoard = () => {
    if (boardName.value.trim() === '') {
      error.value = true
      return
    }
    error.value = false
    $emit('create-board', boardName.value)
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
  }
  
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .create-btn {
    background-color: #523e2c;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .create-btn:hover {
    background-color: #3e2e21;
  }
  </style>
  