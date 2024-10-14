<script setup>
import Menu from '@/components/Menu.vue'
import { UserButton, useAuth } from 'vue-clerk'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container-fluid row">
    <div class="col-2">
      <img class="image" src="/src/assets/spoonfeed.jpeg" alt="" height="100" width="100" />
      <Menu />
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
</style>
