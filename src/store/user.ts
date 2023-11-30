import { StoreOptions } from "vuex";

export default {
  namespaced: true,
  //  state 存储的状态变量，比如用户信息
  state: () => ({
    loginUser: {
      userName: "未登录",
      role: "Common",
    },
  }),
  // actions 执行异步操作，并且触发mutation的更改（调用mutation）
  actions: {
    getLoginUser({ commit, state }, payload) {
      //todo 真实登录的话就要请求后端了，从远程请求获取登录信息
      commit("updateUser", { userName: "Bob", role: "Admin" });
    },
  },
  // mutations 定义了更新变量增删改的方法
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
