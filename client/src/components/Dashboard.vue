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
          <v-container fluid class="fill-height mb-15">
            <div v-if="selectedTab == 1">
              <create-user />
            </div>
            <div v-else-if="selectedTab == 2">
              <create-role />
            </div>
            <div v-else-if="selectedTab == 3">
              <create-department />
            </div>
            <div v-else>
              <v-card>
                <v-card-title>Tab {{ selectedTab }}</v-card-title>
                <v-card-text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  nonne merninisti licere mihi ista probare, quae sunt a te
                  dicta? Refert tamen, quo modo.
                </v-card-text>
              </v-card>
            </div>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
    <FooterBar />
  </div>
</template>

<script>
import CreateRole from './CreateRole.vue';
export default {
  components: { CreateRole },
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