<template>
  <div>
      <NavBar @update-tab="handleTabUpdate" />
      
      <v-container class="">
        <v-tabs-window v-model="selectedTab">
              <v-tabs-window-item
                v-for="n in 4"
                :key="n"
                :value="n"
              >
                <v-container fluid>
                  Component: {{ selectedTab }}
                </v-container>
              </v-tabs-window-item>
          </v-tabs-window>
    </v-container>
    
    <FooterBar />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: null,
    };
  },
  methods: {
    handleTabUpdate(tab) {
      this.selectedTab = tab;
    },
  },
};
</script>
