<template>
    <v-card
    class="mx-auto"
    max-width="450"
    min-width="320"
    title="Cadastrar Usuário"
    prepend-icon="mdi-account"
    >
        <v-container>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="user.name"
              label="Nome"
              :rules="[rules.required, rules.min, rules.max]"
              clearable
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="Email"
              type="email"
              clearable
              :rules="[rules.required, rules.email, rules.max]"
            ></v-text-field>
            <v-select
              v-model="user.role"
              :items="roles.map(role => role.name)"
              item-text="name"
              item-value="id"
              label="Selecione o cargo"
              :rules="[rules.required]"
            ></v-select>
            <v-select
              v-model="user.department"
              :items="departments.map(department => department.name)"
              item-text="name"
              item-value="id"
              label="Selecione o departamento"
              :rules="[rules.required]"
            ></v-select>
            <v-btn :loading="loading" type="submit" size="large" block color="primary" variant="tonal" class="mt-2">Cadastrar</v-btn>
          </v-form>
        </v-container>
    </v-card>
  </template>
  
  <script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import toastr from 'toastr';
import { z } from 'zod';
import 'toastr/build/toastr.min.css';

export default {
  data: () => ({
    rules: {
      required: value => !!value || 'Campo obrigatório.',
      min: value => value.length >= 3 || 'Mínimo de 3 caracteres',
      max: value => value.length <= 250 || 'Máximo de 250 caracteres',
      email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'Email inválido.';
      }
    },
  }),
  setup() {
    const user = ref({
      name: '',
      email: '',
      role: '',
      department: ''
    });
    const roles = ref([]);
    const departments = ref([]);
    const loading = ref(false);

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/role', { withCredentials: true });
        roles.value = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/department', { withCredentials: true });
        departments.value = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const userSchema = z.object({
      name: z.string().nonempty({ message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email address' }),
      role: z.string().nonempty({ message: 'Role is required' }),
      department: z.string().nonempty({ message: 'Department is required' })
    });

    const validateForm = () => {
      const result = userSchema.safeParse(user.value);
      if (!result.success) {
        toastr.error("Preencha todos os campos");
        return false;
      }
      return true;
    };

    const submit = async () => {
      loading.value = true;

      setTimeout(async () => {
        if (!validateForm()) {
          loading.value = false;
          return;
        }

        try {
          const userData = JSON.stringify({
            name: user.value.name,
            email: user.value.email,
            roleId: roles.value.find(role => role.name === user.value.role).id,
            departmentId: departments.value.find(department => department.name === user.value.department).id
          });

          console.log('User data:', userData);

          await axios.post('http://localhost:3001/api/user', userData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          toastr.success('Usuário criado com sucesso');
        } catch (error) {
          toastr.error('Erro ao criar usuário, talvez o email já esteja em uso');
        } finally {
          loading.value = false;
        }
      }, 1000);
    };

    onMounted(() => {
      fetchRoles();
      fetchDepartments();
    });

    return {
      user,
      roles,
      departments,
      loading,
      submit
    };
  }
};
</script>