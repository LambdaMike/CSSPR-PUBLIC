<template>
    <v-layout>
        <v-app-bar
          color="teal-darken-4"
          image="../assets/bandeira.svg"
        >
            <template v-slot:image>
                <v-img
                gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
                ></v-img>
            </template>
  
            <a href="/">
                <div class="navbar">
                    <v-img
                    src="../assets/logo.png"
                    alt="Logo"
                    contain
                    width="150px"
                    class="mr-3 ml-7"
                    ></v-img>
                </div>
            </a>
            <p>Tab value: {{ tab }}</p>
            <v-spacer></v-spacer>
  
            <v-tabs
                v-model="tab"
                align-tabs="center"
                color="light-blue-lighten-5"
                class="mr-14"
                >
                <v-tab :value="1">Cadastrar Usuários</v-tab>
                <v-tab :value="2">Filtrar Usuários</v-tab>
                <v-tab :value="3">Lista de Usuários</v-tab>
                <v-tab :value="4">Logs de Usuário</v-tab>
            </v-tabs>
          
            <v-menu >
              <template v-slot:activator="{ props }">
                <v-icon size="36" class="mr-4" v-bind="props">mdi-account-circle</v-icon>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </v-app-bar>
  
        <v-main>
            <v-tabs-window v-model="tab">
            <v-tabs-window-item
              v-for="n in 4"
              :key="n"
              :value="n"
            >
              <v-container fluid>
                <v-row>
                  <v-col
                    v-for="i in 6"
                    :key="i"
                    cols="12"
                    md="4"
                  >
                    <v-img
                      :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`"
                      :src="`https://picsum.photos/500/300?image=${i * n * 5 + 10}`"
                      height="205"
                      cover
                    ></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-main>
      </v-layout>
  </template>

<script lang="ts">
export default {
  data: () => ({
    tab: null,
    items: [
        { title: 'Admin' },
        { title: 'Test' },
        { title: 'Opçoes' },
        { title: 'Sair' },
      ],
  }),
  methods: {
    emitTab() {
      this.$emit('update-tab', this.tab);
    },
  },
};
</script>