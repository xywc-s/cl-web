<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="miniVariant"
      color="primary"
      dark
      overlay-opacity="0.3"
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Crawler Web</v-list-item-title>
            <v-list-item-subtitle>Designed By ET-FUN</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mb-4"></v-divider>

        <template v-for="route in routes">
          <v-list-item v-if="!route.meta.hidden" :key="route.meta.title" link :to="route.path">
            <v-list-item-icon>
              <v-icon :color="$route.path === route.path? 'amber':''">{{ route.meta.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ route.meta.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <!-- -->
    </v-navigation-drawer>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-icon @click="miniVariant = !miniVariant">mdi-menu</v-icon>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <snackbar></snackbar>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar';
export default {
  name: 'App',

  components: {
    Snackbar
  },

  data: () => ({
    miniVariant: true,

  }),
  computed: {
    routes() {
      return this.$router.options.routes
    }
  },

  created() {
    if (this.$vuetify.breakpoint.mobile) this.miniVariant = false
  }
};
</script>
