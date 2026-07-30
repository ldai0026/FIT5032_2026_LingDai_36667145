import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import StaffView from '../views/StaffView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'
import GetAllBookAPI from '@/views/GetAllBookAPI.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'
import BookShowcaseView from '@/views/BookShowcaseView.vue'
import { hasRole, isAuthenticated } from '../auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/resources',
    name: 'Resources',
    component: ResourcesView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: FirebaseSigninView,
  },
  {
    path: '/firebase-register',
    name: 'FireRegister',
    component: FirebaseRegisterView,
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView,
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView,
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI,
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI,
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCountView,
  },
  {
    path: '/BookShowcase',
    name: 'BookShowcase',
    component: BookShowcaseView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/staff',
    name: 'Staff',
    component: StaffView,
    meta: { requiresAuth: true, roles: ['staff'] },
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath, denied: 'true' },
    }
  }

  if (to.meta.roles && !hasRole(to.meta.roles)) {
    return {
      name: 'AccessDenied',
      query: { from: to.fullPath },
    }
  }
})

export default router
