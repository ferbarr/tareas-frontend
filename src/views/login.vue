<template>
  <div>
    <v-row class="justify-center mt-2">
      <v-col class="col-11 col-md-5">
        <v-card>
          <v-card-text
            class="
              text-center
              display-1
              black--text
              text-uppercase
              elevation-8
              rounded
            "
          >
            <span>Ingreso</span>
          </v-card-text>

          <v-card-text>
            <v-form>
              <v-alert type="error" v-if="msj!=''">{{this.msj}}</v-alert>
              <v-text-field
                label="Usuario"
                prepend-icon="mdi-account-circle mdi-36px"
                v-model="datos.user"
              >
              </v-text-field>
              <v-text-field
                label="Contraseña"
                type="password"
                prepend-icon="mdi-key mdi-36px"
                v-model="datos.pass"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block @click="login()">Acceder</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      datos: {
        user: "",
        pass: "",
      },
      msj:''
    };
  },
  methods: {
    ...mapActions(['guardarUsuario']),
    async login() {
      try {
        const res = await this.axios.post("/login", this.datos);
        const token=res.data.token;
        this.guardarUsuario(token);
        this.msj='';
      } catch (error) {
        console.log(error.response);
        this.msj=error.response.data.mensaje;
      }
    },
  },
};
</script>

<style>
</style>