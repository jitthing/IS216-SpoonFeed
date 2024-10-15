<script setup>
import Menu from '@/components/Menu.vue'
import { UserButton } from 'vue-clerk'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container-fluid row">
    <div class="p-0 col-2">
      <div class="container-fluid p-0">
        <img class="image col-5" src="/src/assets/spoonfeed.jpeg" alt="" height="80" width="80" />
        <button type="button" class="create-recipe col-5 btn">Create Recipe</button>
      </div>
      <Menu class="col-12" />
    </div>
    <RouterView class="col-10" />
  </div>
  <div class="profile"><UserButton /></div>
</template>

<style scoped>
.profile {
  position: absolute;
  top: 10px;
  right: 10px;
}
.image {
  margin: 10px;
}
.create-recipe {
  background-color: #523e2c;
  color: white;
  align-self: center;
  height: 50%;
  text-align: center;
  font-size: calc(1vw);
}
</style>
