<script setup>
import { useAuth } from 'vue-clerk'

const { isSignedIn } = useAuth()
</script>

<template>
  <div v-if="!isSignedIn" class="home container">
    <div class="container-fluid">
      <div class="header">
        <h1>SpoonFeed.</h1>
      </div>

      <div class="row flex-row flex-nowrap">
        <div class="col-3">
          <div class="card card-block">
            <h3>SEARCH FOR DIFFERENT RECIPES</h3>
            <p>search recipes based on certain ingredients or categories!</p>
          </div>
        </div>
        <div class="col-3">
          <div class="card card-block">
            <h3>CREATE YOUR OWN RECIPES</h3>
            <p>Create your own recipes and post them on the community page!</p>
          </div>
        </div>
        <div class="col-3">
          <div class="card card-block">
            <h3>SHARE WITH THE COMMUNITY</h3>
            <p>Share your recipes with others and see recipes from others as well!</p>
          </div>
        </div>
        <div class="col-3">
          <div class="card card-block">
            <h3>PLAN YOUR MEALS WEEKLY</h3>
            <p>Pick recipes that you want to cook for the week and add them to the meal planner!</p>
          </div>
        </div>
        <div class="col-3">
          <div class="card card-block">
            <h3>VIEW YOUR SHOPPING LIST</h3>
            <p>
              Based off your meal planner, view which ingredients you need to purchase on your
              weekly grocery run!
            </p>
          </div>
        </div>
        <div class="col-3">
          <div class="card card-block">
            <h3>TRACK YOUR MACRO-NUTRIENTS</h3>
            <p>
              Better understand what you are eating and the amount of macro-nutrients in each
              recipe!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  position: relative;
  background-image: url('/src/assets/background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  max-width: 100%;
  padding: 0;
  margin: 0;
  width: 100%;
}

.container-fluid {
  padding: 0;
  margin: 0;
  width: 100%;
}

.header {
  position: absolute;
  top: 200px;
  text-align: center;
  width: 100%;
}

h1 {
  color: rgb(255, 249, 241);
  font-size: 100px;
  text-shadow: 2px 5px 5px black;
}

.row {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 120px;
  width: 100vw;
  overflow-x: auto;
  padding: 20px;
}

h3 {
  text-align: center;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
  font-weight: bold;
  color: rgb(87, 71, 43);
}

p {
  text-align: center;
  font-size: 17px;
  color: rgb(87, 71, 43);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}

.card {
  padding: 20px;
  background-color: rgba(244, 237, 228, 0.75);
  border: solid 2px rgb(87, 71, 43);
  border-radius: 15px;
  min-height: 220px;
  box-shadow: 2px 5px 5px black;
}
</style>
