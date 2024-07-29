<template>
    <form @submit.prevent="submit">
      <p>Setor</p>
      <v-text-field
        v-model="name.value.value"
        :counter="60"
        :error-messages="name.errorMessage.value"
        label="Nome"
      ></v-text-field>
      <v-btn
        class="me-4"
        type="submit"
        :loading="loading"
      >
        Salvar
      </v-btn>
  
      <v-btn @click="handleReset">
        Limpar
      </v-btn>
    </form>
  </template>
  <script setup>
    import { ref } from 'vue'
    import { useField, useForm } from 'vee-validate'
  
    import toastr from 'toastr';
    import 'toastr/build/toastr.min.css';
  
    const loading = ref(false);
  
    const { handleSubmit, handleReset } = useForm({
      validationSchema: {
        name (value) {
          if (value?.length >= 2 && value?.length < 61) return true
  
          if (!value) return 'Campo obrigatório.'
          if (value?.length >= 41) return 'É permitido ter no máximo 60 caracteres.'
          if (value?.length < 2) return 'É necessario ter pelo menos 2 caracteres.'
  
          return 'Campo invalido'
        }
      },
    })
    const name = useField('name')
  
    const submit = handleSubmit(values => {
        loading.value = true;
        setTimeout(() => {
          fetch('http://localhost:3001/api/department', {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: values.name })
          })
          .then(response => {
            loading.value = false;
            if (!response.ok) {
              toastr.error('Erro ao criar setor, talvez já exista outro setor com mesmo nome');
            } else {
              toastr.success('Setor criado com sucesso');
              handleReset();
            }
          })
          .catch(error => {
            loading.value = false;
            toastr.error('Erro ao criar setor, talvez já exista outro setor com mesmo nome');
          });
        }, 1000);
      });
  </script>