<template>
  <div class="dashboard-container">
    <NavBar @update-tab="handleTabUpdate" />
    <v-container class="fill-height">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item
          v-for="n in 4"
          :key="n"
          :value="n"
        >
          <v-container fluid class="fill-height">
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
      selectedTab: 1
    };
  },
  methods: {
    handleTabUpdate(newTab) {
      this.selectedTab = newTab;
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.fill-height {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>