// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import NotFound from '../pages/error/404/index.vue';

routes.push({
  path: '/:pathMatch(.*)*',
  name: '404',
  component: NotFound,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    if (to.path === '/error/internal') {
      next();
      return;
    }

    const response = await fetch('http://localhost:3001/api/auth', {
      method: 'GET',
      credentials: 'include'
    });

    const isAuthenticated = response.ok;

    if (to.path === '/login' && isAuthenticated) {
      next( {path: '/' } );
      return;
    }
    else if (to.path === '/login' && !isAuthenticated) {
      next();
      return;
    }

    if (response.status === 200) {
      next();
      return;
    } else {
      next({ path: '/login' });
      return;
    }
  } catch (error) { 
    next( { path: '/error/internal' });
  }
});

export default router;