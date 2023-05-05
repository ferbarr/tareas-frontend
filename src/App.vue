<template>
  <v-app >
    <v-app-bar
    
      app
      color="primary"
      dark
      rounded
    >
      <v-btn v-if="active" @click="logout()">Cerrar sesion</v-btn>

      <v-spacer></v-spacer>

     
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
export default {
  name: 'App',
  methods:{
      ...mapActions(['logout','leerToken']),
  },
  computed:{
    ...mapGetters(['active'])
  },
  created(){
    this.leerToken();
  }


};
</script>
