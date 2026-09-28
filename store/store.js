// src/store/store.js

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)
let store = new Vuex.Store({
    state:{
		userInfo:{},
		socketMsg:''
    },
    getters:{
         
    },
    mutations:{
        login(state, data){
			state.userInfo = data
        },
		newSocket(state, data){
			state.socketMsg = data
		}
    },
});

export default store;