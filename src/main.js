import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import mqttService from "./utils/service";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);

const app = createApp(App);

// 全局提供 MQTT 服务
app.provide("mqttService", mqttService);

// 路由
app.use(router);

// elementUi
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");

// 启动时连接 MQTT
mqttService.connect().catch((err) => {
  console.error("Initial MQTT connection failed:", err);
});
