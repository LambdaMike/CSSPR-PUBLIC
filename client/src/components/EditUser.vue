<template>
    <v-card
    class="mx-auto"
    min-width="450px"
    max-width="550px"
    >
      <v-card-title class="custom-title">
        <v-icon class="mr-1">mdi-account</v-icon>
        Editar Usuário
      </v-card-title>
      <v-container class="my-3" v-if="!loading">
        <v-form>
          <div v-if="editName" style="display: flex; align-items: center;">
            <v-text-field
              v-model="userData.name"
              label="Nome"
              clearable
              variant="underlined"
              class="mb-3"
            ></v-text-field>
            <v-icon small @click="toggleNameEdit" class="ml-1">mdi-content-save</v-icon>
          </div>
          <div v-else style="display: flex; align-items: center;" class="mb-3">
            <h5>{{ userData.name }}</h5>
            <v-icon small @click="toggleNameEdit" class="ml-1">mdi-pencil</v-icon>
          </div>

          <div v-if="editEmail" style="display: flex; align-items: center;">
            <v-text-field
              v-model="userData.email"
              label="Email"
              clearable
              variant="underlined"
            ></v-text-field>
            <v-icon small @click="toggleEmailEdit" class="ml-1">mdi-content-save</v-icon>
          </div>
          <div v-else style="display: flex; align-items: center;" class="mb-3">
            <h5>{{ userData.email }}</h5>
            <v-icon small @click="toggleEmailEdit" class="ml-1">mdi-pencil</v-icon>
          </div>

          <v-select
            v-model="userData.role"
            :items="roles.map(role => role.name).sort((a, b) => a.localeCompare(b))"
            label="Selecione o Grupo"
          ></v-select>
          <v-select
            v-model="userData.department"
            :items="departments.map(department => department.name).sort((a, b) => a.localeCompare(b))"
            label="Selecione o Setor"
          ></v-select>
          
        </v-form>
        </v-container>
        <div class="text-center" v-else>
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black-darken-1" variant="text">Cancelar</v-btn>
          <v-btn color="blue-darken-3" variant="text">Salvar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
  </template>
  
<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'

    const userData = ref([]);
    const roles = ref([]);
    const departments = ref([]);
    const systems = ref([]);
    const editName = ref(false);
    const editEmail = ref(false);
    const loading = ref(true);
    
    const props = defineProps({
        userId: Number,
    })

    onMounted(async () => {
        try {
            await axios.get(`http://localhost:3001/api/role/`, { withCredentials: true })
            .then(response => {
                roles.value = response.data
            })
            
            await axios.get(`http://localhost:3001/api/department/`, { withCredentials: true })
            .then(response => {
              departments.value = response.data
            })

            await axios.get('http://localhost:3001/api/system', {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(response => { 
              systems.value = response.data;
            });

            await axios.get(`http://localhost:3001/api/user/${props.userId}`, { withCredentials: true })
            .then(response => {
                userData.value = {
                    name: response.data.name,
                    email: response.data.email,
                    department: departments.value.find(department => department.id === response.data.departmentId).name,
                    role: roles.value.find(role => role.id === response.data.roleId).name
                }
            })

            setTimeout(() => {
              loading.value = !loading.value
            }, 300);
        } catch (error) {
            console.log("Error to fetch api data")
        }
    })

    function toggleNameEdit() {
        editName.value = !editName.value
    }

    function toggleEmailEdit() {
        editEmail.value = !editEmail.value
    }
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}
</style>