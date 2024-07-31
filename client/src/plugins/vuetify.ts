import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
  }, 
  locale: {
    locale: 'pt',
    messages: { pt },
  },
})
