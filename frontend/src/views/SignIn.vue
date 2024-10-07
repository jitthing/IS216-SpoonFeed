<script setup>
import { SignIn } from 'vue-clerk'
</script>

<template>
  <SignIn path="/sign-in" after-sign-in-url="/" sign-up-url="/sign-up" />
</template>
