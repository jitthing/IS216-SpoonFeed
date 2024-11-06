import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/SignedOut/HomeView.vue'
import SignIn from '../views/SignedOut/SignIn.vue'
import SignUp from '../views/SignedOut/SignUp.vue'
import Dashboard from '../views/SignedIn/Homepage.vue'
import OnlineRecipe from '../views/SignedIn/OnlineRecipe.vue'
import CommunityPage from '../views/SignedIn/CommunityPage.vue'
import Profile from '@/views/SignedIn/Profile.vue'
import MealPlanner from '../views/SignedIn/MealPlanner.vue'
import SSOCallback from '../views/SignedOut/SSOCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    { path: '/online-recipes', name: 'onlinerecipe', component: OnlineRecipe },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/community-recipe', name: 'communityreceipe', component: CommunityPage },
    { path: '/meal-planner', name: 'mealplanner', component: MealPlanner },
    {
      path: '/sso-callback',
      name: 'sso-callback',
      component: SSOCallback
    },
    {
      path: '/sign-up/verify-email-address',
      name: 'sign-up/verify-email-address',
      component: SignUp
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  console.log('Navigation triggered to:', to.path)

  if (window.Clerk) {
    try {
      await window.Clerk.load()
      const isSignedIn = await window.Clerk.isSignedIn
      console.log('Auth state:', isSignedIn)

      const protectedRoutes = [
        'dashboard',
        'profile',
        'meal-planner',
        'online-recipes',
        'community-recipe'
      ]

      console.log('Route name:', to.name)
      console.log('Is protected:', protectedRoutes.includes(to.name))

      if (to.name === 'sso-callback') {
        next()
        return
      }

      // if (protectedRoutes.includes(to.name) && !isSignedIn) {
      //   console.log('Redirecting to signin')
      //   next({ name: 'signin' })
      //   return
      // }

      if (['signin', 'signup'].includes(to.name) && isSignedIn) {
        console.log('Redirecting to dashboard')
        next({ name: 'dashboard' })
        return
      }

      console.log('Proceeding with navigation')
      next()
    } catch (error) {
      console.error('Clerk initialization error:', error)
      next()
    }
  } else {
    console.log('Clerk not initialized, proceeding')
    next()
  }
})

export default router
