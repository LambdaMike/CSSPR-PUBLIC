// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import NotFound from '../pages/NotFound.vue';
import axios from 'axios';

// Add the 404 route at the end of the routes array
routes.push({
  path: '/:pathMatch(.*)*',
  name: '404',
  component: NotFound,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('/api/auth/check');
    const isAuthenticated = response.data.isAuthenticated;

    if (!isAuthenticated && to.path !== '/login') {
      next({ path: '/login' });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    next({ path: '/login' });
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      localStorage.removeItem('vuetify:dynamic-reload');
    }
  }
});

export default router;