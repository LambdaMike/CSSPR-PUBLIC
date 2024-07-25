import 'bootstrap/dist/css/bootstrap.min.css';

import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)


registerPlugins(app)

app.mount('#app')
