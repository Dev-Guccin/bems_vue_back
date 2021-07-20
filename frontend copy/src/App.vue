<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
    <AppSidebar></AppSidebar>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>4Msys Monitoring System</v-toolbar-title>
      <v-layout align-end justify-end>
        <LoginBtn></LoginBtn>
      </v-layout>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from './components/AppSidebar.vue'
import LoginBtn from './components/LoginBtn.vue'

  export default {
    data: () => ({ drawer: null }),
    components: {
      AppSidebar,
      LoginBtn
    }
  }
</script>