<script setup>
import Menu from '@/components/Menu.vue'
import { UserButton } from 'vue-clerk'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container row">
    <div class="col-3">
      <img class="image" src="/public/spoonfeed.jpeg" alt="" height="100" width="100" />
      <Menu />
    </div>
    <RouterView class="main col-8" />
    <div class="profile col-1"><UserButton /></div>
  </div>
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
.main {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
</style>
