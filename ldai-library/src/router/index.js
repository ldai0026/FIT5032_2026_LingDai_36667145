import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { hasRole, isAuthenticated } from '../auth'

// Keep the landing page in the initial bundle and load feature pages only when
// a visitor opens them. This reduces the JavaScript needed for the first view,
// especially the Firebase, PrimeVue table, Mapbox, and staff dashboard code.
const ResourcesView = () => import('../views/ResourcesView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const StaffView = () => import('../views/StaffView.vue')
const AccessDeniedView = () => import('../views/AccessDeniedView.vue')
const FirebaseSigninView = () => import('@/views/FirebaseSigninView.vue')
const FirebaseRegisterView = () => import('@/views/FirebaseRegisterView.vue')
const AddBookView = () => import('@/views/AddBookView.vue')
const WeatherView = () => import('@/views/WeatherView.vue')
const CountBookAPI = () => import('@/views/CountBookAPI.vue')
const GetAllBookAPI = () => import('@/views/GetAllBookAPI.vue')
const GetBookCountView = () => import('@/views/GetBookCountView.vue')
const BookShowcaseView = () => import('@/views/BookShowcaseView.vue')
const FindServicesView = () => import('@/views/FindServicesView.vue')

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
    path: '/find-services',
    name: 'FindServices',
    component: FindServicesView,
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

// GitHub Pages cannot rewrite deep links to index.html. Its production build
// uses a repository subpath, so hash history keeps bookmarks and page refreshes
// working without changing the clean history URLs used locally and on Cloudflare.
const isGitHubPagesBuild = import.meta.env.BASE_URL !== '/'

const router = createRouter({
  history: isGitHubPagesBuild
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
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
