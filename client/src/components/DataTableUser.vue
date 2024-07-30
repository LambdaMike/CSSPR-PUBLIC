<template>
    <v-data-table
      :headers="headers"
      :items="users"
      :sort-by="[{ key: 'email', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar
            prominent
        >
          <v-toolbar-title>Listar Usuário</v-toolbar-title>
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
                        label="roleId"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.departmendId"
                        label="departmendId"
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
                  Cancel
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
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Você tem certeza que deseja deletar esse usuário?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Confirmar</v-btn>
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
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </template>
  <script setup>
  import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
  import axios from 'axios';

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
    { title: 'Setor', key: 'departmendId' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  const users = ref([]);
  const editedIndex = ref(-1);
  const editedItem = reactive({
    name: '',
    email: 0,
    roleId: 0,
    departmendId: 0,
  });
  const defaultItem = {
    name: '',
    email: 0,
    roleId: 0,
    departmendId: 0,
  };
  
  const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Novo Usuário' : 'Editar Usuário';
  });
  
  watch(dialog, (val) => {
    if (!val) close();
  });
  
  watch(dialogDelete, (val) => {
    if (!val) closeDelete();
  });
  
  onMounted(async () => {
    try {
        const response = 
            await axios.get('http://localhost:3001/api/user', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        users.value = response.data;
        } catch (error) {
        console.error('Error fetching users:', error);
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
  </script>