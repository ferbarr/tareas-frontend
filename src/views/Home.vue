<template>
  <div class="container">
    
    <h1 class="text-center">Tareas</h1>
    <!-- SNACKBAR -->
    <v-snackbar top :color="color" v-model="active" :timeout="quitar">
      {{ texto }}
    </v-snackbar>
    <!-- FORMULARIO -->
    <div class="mb-8">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                label="Nombre"
                required
                v-model="input.nombre"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                label="Descripcion"
                required
                v-model="input.descripcion"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn @click="agregarTarea()">Agregar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <!-- TABLA -->
    <v-simple-table dense>
      <template>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Nombre</th>
            <th class="text-left">Descripción</th>
            <th class="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tareas" :key="index">
            <td>{{ item._id }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.descripcion }}</td>
            <td>
              <v-btn
                color="error"
                @click="
                  (modal.active = true),
                    (modal.tarea = item.nombre),
                    (modal.id = item._id)
                "
              >
                <v-icon> mdi-trash-can-outline </v-icon>
              </v-btn>

              <v-btn
                class="ml-2"
                color="success"
                @click="datosAEditar(item._id)"
              >
                <v-icon> mdi-pencil-box-outline </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
 
  <router-link :to="{query:{
        page:page
      }}" class="text-center">
    <v-pagination
    circle
      v-model="page"
      
      :length="6"
    ></v-pagination>
  </router-link>


    <!-- MODAL ELIMINAR -->

    <v-dialog v-model="modal.active" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Eliminar tarea
        </v-card-title>

        <v-card-text> ¿Desea eliminar la tarea {{ modal.tarea }}? </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="eliminarTarea(modal.id)">Si </v-btn>
          <v-btn color="primary">No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL ACTUALIZAR -->
    <v-dialog v-model="modalE" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Actualizar tarea {{tareaEdit.nombre}} </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Nombre"  v-model="tareaEdit.nombre"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Descripcion" v-model="tareaEdit.descripcion"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="modalE=false" text> Cerrar </v-btn>
          <v-btn color="blue darken-1" @click="editarTarea(tareaEdit)" text> Actualizar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "Home",
  computed:{...mapState(['token'])},
  data() {
    return {
      tareas: [],
      active: false,
      texto: "",
      quitar: 2000,
      color: "",
      input: { nombre: "", descripcion: "" },
      modal: { active: false, tarea: "", id: "" },
      modalE: false,
      tareaEdit: [],
      page:1
    };
  },
  methods: {
  

    async obtenerTareas() {
      try {
           let config = {
        headers: {
          token: this.token
        }
      }

        const res = await this.axios.get("/get-tarea",config);

        this.tareas = res.data;
      } catch (error) {
        console.log(error.response);
        this.color = "error";
        this.active = true;
        this.texto = "Ocurrio un error";
      }
    },
    async agregarTarea() {
      try {
              let config = {
        headers: {
          token: this.token
        }
      }
        const res = await this.axios.post("/add-tarea", this.input,config);
        this.tareas.unshift(res.data);
        this.color = "success";
        this.active = true;
        this.texto = "Tarea agregada";
      } catch (error) {
        if (error.response.data.error.errors.nombre.message) {
          this.texto = error.response.data.error.errors.nombre.message;
        } else {
          this.texto = "Ocurrio un error";
        }
        this.color = "error";
        this.active = true;
      }
      this.input = { nombre: "", descripcion: "" };
    },
    async eliminarTarea(id) {
      try {
        this.modal.active = false;
        const res = await this.axios.delete(`delete-tarea/${id}`);
        let index = this.tareas.findIndex((item) => item._id === res.data._id);
        this.tareas.splice(index, 1);
        this.color = "success";
        this.active = true;
        this.texto = "Tarea eliminada";
      } catch (error) {
        console.log(error);
      }
    },
    async datosAEditar(id) {
      this.modalE = true;
      try {
        const res =await this.axios.get(`/get-tarea/${id}`);
        this.tareaEdit=res.data;
      
      } catch (error) {
        cosole.log(error)
      }
    },
    async editarTarea(datos){
      this.modalE=false;
      try {
        const res=await this.axios.put(`/update-tarea/${datos._id}`,datos);
        let index=this.tareas.findIndex(n=>n._id===res.data._id);
        this.tareas[index].nombre=res.data.nombre;
        this.tareas[index].descripcion=res.data.descripcion;
        this.color = "success";
        this.active = true;
        this.texto = "Tarea actualizada";

      } catch (error) {
        console.log(error)
      }
    }
  },
  created() {
    this.obtenerTareas();
  },
};
</script>
