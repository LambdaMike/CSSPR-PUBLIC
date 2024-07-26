<template>
  <div>
    <v-img class="mx-auto my-7" max-width="228"
      src="../assets/logo-escuro.jpg"></v-img>

    <h4 class="mb-3 text-center">PROCURADORIA-GERAL DO ESTADO DO PARANÁ</h4>
    <h5 class="mb-3 text-center">CONTROLE DE SISTEMAS</h5>
    

    <v-card class="mx-auto pa-10 pb-8" elevation="8"  max-width="510" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Usuário</div>

      <v-text-field v-model="username" density="compact" placeholder="Usuário" prepend-inner-icon="mdi-account-outline"
        variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha

      </div>

      <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Coloque sua senha" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
        Esqueceu a senha?</a>

      <v-btn @click="sendData" block class="mb-8 mt-3" color="blue" size="large" variant="tonal">
        Entrar
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data: () => ({
    visible: false,
    username: 'admin',
    password: 'admin'
  }),
  methods: {
    async sendData() {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          username: this.username,
          password: this.password
        }, {
          withCredentials: true // This ensures cookies are sent and received
        });

        if (response.status === 200) {
          // Handle successful login
          console.log('Login successful:', response.data);
          // Redirect or perform other actions as needed
        } else {
          // Handle login failure
          console.error('Login failed:', response.data);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  }
}
</script>

<script>
</script>
<st