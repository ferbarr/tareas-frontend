import Vue from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';
import router from '../router/index'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    usuario:''
  },
  mutations: {
    obtenerUsuario(state,token){
      state.token=token;
      if(token===''){
        state.usuario='';
      }else{
        state.usuario=decode(token);
        router.replace('/')
      }
    }
  },
  actions: {
    guardarUsuario({commit},token){
      localStorage.setItem('token',token);
      commit('obtenerUsuario',token)
    },
    logout({commit}){
      commit('obtenerUsuario','');
      localStorage.removeItem('token');
      router.replace('/login');
    },
    leerToken({commit}){
      const token=localStorage.getItem('token');
      if(token){
        commit('obtenerUsuario',token);
      }else{
        commit('obtenerUsuario','')
      }
    }
  },
  getters: {
    active(state) {
      if (state.token === '') {
        return false
      } else {
        return true
      }
    },
  }
})
