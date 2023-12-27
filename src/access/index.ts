import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
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
