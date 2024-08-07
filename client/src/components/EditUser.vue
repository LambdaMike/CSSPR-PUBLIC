<template>
    <v-card
    class="mx-auto"
    min-width="450px"
    max-width="450px"
    >
      <v-card-title class="custom-title">
        <v-icon class="mr-1">mdi-account</v-icon>
        Editar Usuário
      </v-card-title>
          <v-container>
            <v-form>
                <v-btn size="l" variant="tonal" color="red" block>Fechar</v-btn>
                <v-btn size="l" variant="tonal" color="primary" block>Salvar</v-btn>
            </v-form>
          </v-container>
    </v-card>
  </template>
  
<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'

    const userData = ref([])

    const props = defineProps({
        userId: String,
    })

    onMounted(async () => {
        try {
            await axios.get(`http://localhost:3001/api/user/${props.userId}`, { withCredentials: true })
            .then(response => {
                userData.value = response.data
                console.log(userData.value)
            })
        } catch (error) {
            console.log(error)
        }
    })
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}
</style>