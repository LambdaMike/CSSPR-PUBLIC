<template>
    <v-card
    class="mx-auto"
    min-width="450px"
    max-width="450px"
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
                v-model="role.value.value"
                :items="roles.map(role => role.name)"
                item-text="name"
                item-value="id"
                :error-messages="role.errorMessage.value"
                label="Selecione o Grupo"
              ></v-select>
              <v-select
                v-model="department.value.value"
                :items="departments.map(department => department.name)"
                item-text="name"
                item-value="id"
                label="Selecione o Setor"
                :error-messages="department.errorMessage.value"
              ></v-select>
              <v-select
                v-model="selectedSystems.value.value"
                :items="systems.map(item => item.name)"
                label="Gerenciar Sistemas"
                :error-messages="selectedSystems.errorMessage.value"
                multiple
              >
                <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 3">
                    <span>{{ item.title }}</span>
                </v-chip>
                <span
                    v-if="index === 3"
                    class="text-grey text-caption align-self-center"
                >
                    (+{{ selectedSystems.value.value.length - 3 }} outros)
                </span>
                </template>
              </v-select>
              <v-btn :loading="loading" type="submit" size="large" block color="primary" variant="tonal" class="mt-2">Cadastrar</v-btn>
            </v-form>
          </v-container>
    </v-card>
  </template>
  
<script setup>
  import { ref, onMounted } from 'vue';
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

      role (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },
  
      department (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },

      SelectedSystems (value) {
        return true
      }
    },

  })

  const name = useField('name')
  const email = useField('email')
  const role = useField('role')
  const department = useField('department')
  const systems = ref([]);
  const selectedSystems = useField('SelectedSystems');

  const submit = handleSubmit(values => {
      loading.value = true;

      setTimeout(async () => {
          try {
            const userData = JSON.stringify({
            name: values.name,
            email: values.email,
            roleId: roles.value.find(role => role.name === values.role).id,
            departmentId: departments.value.find(department => department.name === values.department).id
          });
          
            console.log(userData)

            await axios.post('http://localhost:3001/api/user', userData, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(async response => {
              console.log(response)

              if (response.status === 200) {
                
                for (let i = 0; i < selectedSystems.value.value.length; i++) {
                  let newPermission = {
                    userId: response.data.id,
                    systemId: Number(systems.value.find(system => system.name === selectedSystems.value.value[i]).id),
                    allow: true
                  }

                  await axios.post('http://localhost:3001/api/permission', newPermission, { withCredentials: true })
                  .catch(error => {
                    console.log('Usuário foi criado, porém não foi possivel designar as permissões.');
                  });
                }
                
                loading.value = false;
                toastr.success('Usuário criado com sucesso');
              } else {
                loading.value = false;
                toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo email');
                handleReset();
              }
            })
            .catch(error => {
              loading.value = false;
              toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo email');
            });
          } catch (e) {
            loading.value = false;
            toastr.error('Erro ao criar usuário');
          }
        }, 1000);
    });

    const departments = ref([]);
    const roles = ref([]);

    
    
onMounted(async () => {
    try {
      await axios.get('http://localhost:3001/api/system', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => { 
        systems.value = response.data;
      });
      
      axios.get('http://localhost:3001/api/role', { withCredentials: true })
      .then(response => {
        roles.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
      
      axios.get('http://localhost:3001/api/department', { withCredentials: true })
        .then(response => {
          departments.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching departments:', error);
        });
    } catch (error) {
        console.log('Errors to fetch data', error);
    }
});
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}
</style>