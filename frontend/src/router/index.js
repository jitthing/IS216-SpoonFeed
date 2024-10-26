import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/SignedOut/HomeView.vue'
import AboutView from '../views/SignedOut/AboutView.vue'
import SignIn from '../views/SignedOut/SignIn.vue'
import SignUp from '../views/SignedOut/SignUp.vue'
import Dashboard from '../views/SignedIn/Homepage.vue'
import OnlineRecipe from '../views/SignedIn/OnlineRecipe.vue'
import CommunityPage from '../views/SignedIn/CommunityPage.vue'
import Profile from '../views/SignedIn/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/sign-up/verify-email-address',
      name: 'signup-verify',
      component: SignUp
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    { path: '/online-recipes', name: 'onlinerecipe', component: OnlineRecipe },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/community-recipe', name: 'communityreceipe', component: CommunityPage }

  ]
})

export default router
