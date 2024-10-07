import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import { clerkPlugin } from 'vue-clerk'

import App from './App.vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(router)
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY
})

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
