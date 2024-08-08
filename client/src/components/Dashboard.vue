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
            <div v-if="selectedTab == 1">
              <create-user />
            </div>
            <div v-else-if="selectedTab == 2">
              <edit-user></edit-user>
            </div>
            <div v-else-if="selectedTab == 3">
              <create-department />
            </div>
            <div v-else>
              <data-table-user />
            </div>
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
      selectedTab: 1,
      maxHeight: 700,
    };
  },
  methods: {
    handleTabUpdate(newTab) {
      this.selectedTab = newTab;
    }
  },

};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
}

.fill-height {
  flex: 50%;
  display: flex;
  flex-direction: column;
}
</style>