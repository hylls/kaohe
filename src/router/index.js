import { createRouter, createWebHistory } from "vue-router";

import Mqtt from "../views/mqtt/index.vue";
import TodoList from "../views/todolist/index.vue";
import LifeCycle from "../views/lifeCycle/index.vue";

const routes = [
  {
    path: "/",
    redirect: { path: "/todolist" },
  },
  {
    path: "/mqtt",
    name: "Mqtt",
    component: Mqtt,
  },
  {
    path: "/todolist",
    name: "TodoList",
    component: TodoList,
  },
  {
    path: "/lifeCycle",
    name: 'lifeCycle',
    component: LifeCycle
  }
];

const router = new createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
