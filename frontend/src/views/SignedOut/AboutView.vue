<template>
  <div class="about">
    <!-- Conditionally applying Bootstrap classes for column size -->
    <div :class="dynamicColumnClass" :style="dynamicStyles">
      <h2>Dynamic Card</h2>
      <p>This card's column size and background color change dynamically.</p>
    </div>

    <button @click="toggleSize">Toggle Column Size</button>
    <button @click="toggleColor">Toggle Background Color</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLarge: false, // To control column size (Bootstrap)
      isRed: false // To control background color
    }
  },
  computed: {
    // Dynamically assign column size class
    dynamicColumnClass() {
      return this.isLarge ? 'col-6' : 'col-12' // Bootstrap column classes
    },
    // Dynamically assign background color
    dynamicStyles() {
      return {
        backgroundColor: this.isRed ? 'red' : 'blue', // Conditionally changing color
        color: 'white', // Text color for better contrast
        padding: '20px', // Extra styling
        borderRadius: '5px'
      }
    }
  },
  methods: {
    toggleSize() {
      this.isLarge = !this.isLarge // Toggle between large and small column size
    },
    toggleColor() {
      this.isRed = !this.isRed // Toggle between red and blue background colors
    }
  }
}
</script>

<style scoped>
/* Add any additional styles here if needed */
.about {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
