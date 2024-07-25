import 'bootstrap/dist/css/bootstrap.min.css';

import { registerPlugins } from '@/plugins'
import store from '@/plugins/store';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.use(store)

registerPlugins(app)

app.mount('#app')
