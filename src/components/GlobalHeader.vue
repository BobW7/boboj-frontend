<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        theme="light"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/bLogo.png" />
            <div class="title">BobOJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in routes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>{{ store.state.user?.loginUser?.userName ?? "null" }}</div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";

const router = useRouter();
//默认主页
const selectedKeys = ref(["/"]);
//路由跳转之后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
const store = useStore();
setTimeout(() => {
  //用dispatch来调用store中的module中的action方法，注意路径就是:模块名/方法名
  store.dispatch("user/getLoginUser");
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
