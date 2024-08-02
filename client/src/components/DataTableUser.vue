<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="usersData"
      :sort-by="[{ key: 'email', order: 'asc' }]"
      v-if="!loading"
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: auto; width: max-content;"
    >
      <template v-slot:top>
        <v-toolbar
            prominent
            color="blue-lighten-5"
        >
          <v-toolbar-title style="font-weight: 2px;">Listar Usuários</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                Novo Usuário
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nome"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="email"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.roleId"
                        label="Grupo"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.departmentId"
                        label="Setor"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="30%">
            <v-card>
                <v-card-title class="text-h5">Deletar usuário?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="red-darken-3" variant="text" @click="deleteItemConfirm">Confirmar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-progress-circular
      v-else
      :size="60"
      color="primary"
      indeterminate
    ></v-progress-circular>

  </template>

<script setup>
  import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios';

  const isMounted = ref(false) 
  const loading = ref(true);
  const dialog = ref(false);
  const dialogDelete = ref(false);
  const headers = [
    {
      title: 'Nome',
      align: 'start',
      sortable: false,
      key: 'name',
    },
    { title: 'Email', key: 'email' },
    { title: 'Grupo', key: 'roleId' },
    { title: 'Setor', key: 'departmentId' },
    { title: 'Ações', key: 'actions', sortable: false },
  ];
  const users = ref([]);
  const editedIndex = ref(-1);
  const editedItem = reactive({
    name: '',
    email: 0,
    role: 0,
    department: 0,
  });
  const defaultItem = {
    name: '',
    email: 0,
    role: 0,
    department: 0,
  };
  
  const usersData = ref([]);
  const roles = ref([]);
  const departments = ref([]);

  const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Novo Usuário' : 'Editar Usuário';
  });
  
  watch(dialog, (val) => {
    if (!val) close();
  });
  
  watch(dialogDelete, (val) => {
    if (!val) closeDelete();
  });
  
  onMounted(() => {
    if (!isMounted.value) {
      setTimeout(async () => {
        await fetchData();
        isMounted.value = true;
        loading.value = false;
      }, 600);
    }
  });
  
  function editItem(item) {
    editedIndex.value = users.value.indexOf(item);
    Object.assign(editedItem, item);
    dialog.value = true;
  }
  
  function deleteItem(item) {
    editedIndex.value = users.value.indexOf(item);
    Object.assign(editedItem, item);
    dialogDelete.value = true;
  }
  
  function deleteItemConfirm() {
    users.value.splice(editedIndex.value, 1);
    closeDelete();
  }
  
  function close() {
    dialog.value = false;
    nextTick(() => {
      Object.assign(editedItem, defaultItem);
      editedIndex.value = -1;
    });
  }
  
  function closeDelete() {
    dialogDelete.value = false;
    nextTick(() => {
      Object.assign(editedItem, defaultItem);
      editedIndex.value = -1;
    });
  }
  
  function save() {
    if (editedIndex.value > -1) {
      Object.assign(users.value[editedIndex.value], editedItem);
    } else {
      users.value.push({ ...editedItem });
    }
    close();
  }

  async function fetchData() {
    try {
      const users = await axios.get('http://localhost:3001/api/user', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await axios.get('http://localhost:3001/api/role', { withCredentials: true })
      .then(response => {
        roles.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching roles:');
      });
      
      await axios.get('http://localhost:3001/api/department', { withCredentials: true })
        .then(response => {
          departments.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching departments:');
        });

      const userInfo = users.data.map(user => {
        return {
          name: user.name,
          email: user.email,
          roleId: roles.value.find(role => role.id === user.roleId).name,
          departmentId: departments.value.find(department => department.id === user.departmentId).name,
        }
      });

      usersData.value = userInfo;
    } catch (error) {
      console.error("Erro ao carregar o componente");
    }
  }
  </script>

<style scoped>
  .data-table {
    flex-grow: 1;
    height: 650px;
    max-height: fit-content;
  }
</style>