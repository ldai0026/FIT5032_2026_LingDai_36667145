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
  history: createWebHistory(),
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
