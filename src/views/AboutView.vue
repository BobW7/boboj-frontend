<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a-button type="primary" @click="doLogout" style="min-width: 200px"
      >退出登录
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { UserControllerService } from "../../generated";
import { useRouter } from "vue-router";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const doLogout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    message.success("退出成功");
    router.push("/user/login");
  } else {
    message.error("推出失败！" + res.message);
  }
};
</script>
