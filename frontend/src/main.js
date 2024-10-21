import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import { clerkPlugin } from 'vue-clerk'

import App from './App.vue'
import router from './router'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css' // Import the toast styles

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(router)
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY
})
app.use(Vue3Toastify)

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
