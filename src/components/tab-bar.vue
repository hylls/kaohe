<template>
  <div class="layout">
    <div class="tabbar-container">
      <el-menu router :default-active="activeIndex" class="el-menu-demo" background-color="#545c64" text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/todolist">
          待办事项
        </el-menu-item>
        <el-menu-item index="/mqtt">
          mqtt应用
        </el-menu-item>
        <el-menu-item index="/lifeCycle">
          Vue生命周期
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-layout">
      <router-view />
    </div>
  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
const activeIndex = ref('/todolist');
import { useRouter } from 'vue-router';

const router = useRouter()
onMounted(async () => {
  await router.isReady();
  activeIndex.value = router.currentRoute.value.path
})
</script>

<style scoped lang="less">
.el-menu-demo {
  height: 100%;
}

.layout {
  display: flex;
  height: 100%;

  .right-layout {
    flex: 1;
    padding-left: 1rem;
    overflow-y: auto;
    height: 100vh;
  }
}

.tabbar-container {
  width: 200px;


  .tabbar {
    margin: 0 10px;
  }

  a {
    font-weight: bold;
    color: #2c3e50;
  }

  a.router-link-exact-active {
    color: #42b983;
  }
}
</style>