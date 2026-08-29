import { createRouter } from "vue-router";
import UserListView from "../views/UserListView.vue";
import UserProfileView from "../views/UserProfileView.vue";
import UserRolesView from "../views/UserRolesView.vue";

const routes = [
  {
    // [路由处理2:] 用户子应用配置了 /users base，内部路由只写 base 后面的部分。
    path: "/list",
    component: UserListView,
    meta: { title: "用户列表" },
  },
  {
    path: "/profile/1001",
    component: UserProfileView,
    meta: { title: "用户档案" },
  },
  {
    path: "/roles",
    component: UserRolesView,
    meta: { title: "角色权限" },
  },
  {
    path: "/",
    redirect: "/list",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/list",
  },
];

export function createUserRouter(history) {
  return createRouter({
    history,
    routes,
  });
}
