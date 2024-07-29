<template>
    <v-card
    class="mx-auto"
    max-width="700px"
    min-width="400px"
    min-height="550px"
    max-height="600px"
    >
    <v-card-title class="custom-title">
      <v-icon class="mr-1">mdi-account</v-icon>
      Cadastrar Usuário
    </v-card-title>
        <v-container>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="name.value.value"
              label="Nome"
              :error-messages="name.errorMessage.value"
              clearable
            ></v-text-field>
            <v-text-field
              v-model="email.value.value"
              label="Email"
              type="email"
              :error-messages="email.errorMessage.value"
              clearable
            ></v-text-field>
            <v-select
              v-model="roleId.value.value"
              :items="roles.map(role => role.name)"
              item-text="name"
              item-value="id"
              :error-messages="roleId.errorMessage.value"
              label="Selecione o Grupo"
            ></v-select>
            <v-select
              v-model="departmentId.value.value"
              :items="departments.map(department => department.name)"
              item-text="name"
              item-value="id"
              label="Selecione o Setor"
              :error-messages="departmentId.errorMessage.value"
            ></v-select>

            <v-btn :loading="loading" type="submit" size="large" block color="primary" variant="tonal" class="mt-2">Cadastrar</v-btn>
          </v-form>
        </v-container>
    </v-card>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useField, useForm } from 'vee-validate'
  import validator from 'validator';

  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  const loading = ref(false);

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name (value) {
        if (!value) return 'Campo obrigatório.'
        if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
        if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
        return true
      },
      
      email (value) {
        if (!value) return 'Campo obrigatório.'
        if (!validator.isEmail(value)) return 'Email inválido.'
        if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
        if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
        return true
      },

      roleId (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },
  
      departmentId (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },
    },

  })

  const name = useField('name')
  const email = useField('email')
  const roleId = useField('roleId')
  const departmentId = useField('departmentId')

  const submit = handleSubmit(values => {
      loading.value = true;

      setTimeout(async () => {
          const userData = JSON.stringify({
            name: values.name,
            email: values.email,
            roleId: roles.value.find(role => role.name === values.roleId).id,
            departmentId: departments.value.find(department => department.name === values.departmentId).id
          });

          console.log(userData)

          await axios.post('http://localhost:3001/api/user', userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          loading.value = false;
          console.log(response)
          if (response.status === 200) {
            toastr.success('Usuário criado com sucesso');
          } else {
            toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo nome');
            handleReset();
          }
        })
        .catch(error => {
          loading.value = false;
          toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo nome');
        });
      }, 1000);
    });

    const departments = ref([]);
    const roles = ref([]);

    axios.get('http://localhost:3001/api/department', { withCredentials: true })
      .then(response => {
        departments.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

    axios.get('http://localhost:3001/api/role', { withCredentials: true })
      .then(response => {
        roles.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}
</style>