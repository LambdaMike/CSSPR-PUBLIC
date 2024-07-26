// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import NotFound from '../pages/NotFound.vue';
import axios from 'axios';

routes.push({
  path: '/:pathMatch(.*)*',
  name: '404',
  component: NotFound,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const public_routes = ['/login', '/signup'];

router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('http://localhost:3001/api/auth/', {
      withCredentials: true 
    });

    let isAuthenticated = false
    
    if(response.status === 200) {
      isAuthenticated = true;
    }
    // loop to fix
    if (to.path !== 'login' && !isAuthenticated) {
      next({ path: '/login' });
    } else {
      next();
    }
  } catch (error) {
    next({ path: '/login' });
  }
});

export default router;