import Vue from 'vue';
import Vuex from 'vuex';

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    //存放的键值对就是所要管理的状态
    show: 1,
  },
  mutations: {
    //es6语法，等同edit:funcion(){...}
    hide(state) {
      state.show = 0;
    },
    show(state) {
      state.show = 1;
    },
  },
});

export default store;
