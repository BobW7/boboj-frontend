<template>
  <div id="app">
    <basic-layout />
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted } from "vue";

const router = useRouter();
const store = useStore();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("welcome!");
};

onMounted(() => {
  doInit();
});

//路由监听，读取路由中的meta中的access属性（也是自己定义的）
router.beforeEach((to, from, next) => {
  //仅管理员可见
  if (to.meta?.access === "canAdmin") {
    //判断当前用户是否有权限
    if (store.state.user.loginUser?.role !== "Admin") {
      next("/noAuth");
      return;
    }
  }
  next();
});
</script>
