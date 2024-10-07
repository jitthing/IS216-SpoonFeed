<script setup>
import { SignUp } from 'vue-clerk'
</script>

<template>
  <SignUp path="/sign-up" after-sign-up-url="/" sign-in-url="/sign-in" />
</template>
