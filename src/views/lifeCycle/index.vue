<template>
  <div class="container">
    <div class="life-cycle" />
    <div>
      <pre>
        <div class="title">
1. created
解释：在实例初始化之后，数据观测 (data 和 props 的响应式代理) 和 event/watcher 事件配置之前被调用。此时，组件的数据已经初始化，但 DOM 还未挂载。
应用场景：可以在这个阶段进行数据的初始化，比如从 API 获取数据、设置定时器等。
示例：
        </div>
        <code class="javascript">
import { ref, onCreated } from 'vue';
const message = ref('');
onCreated(() => {
  // 模拟从 API 获取数据
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      message.value = data.message;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
});

        </code>

        <div class="title">
2. mounted
解释：在组件挂载到 DOM 之后调用。此时，组件已经渲染完成，DOM 元素已经可用。
应用场景：可以在这个阶段进行一些需要操作 DOM 的任务，比如初始化第三方库、绑定事件监听器等。
示例：
        </div>
        <code class="js">   
onMounted(() => {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // 在画布上绘制一个矩形
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 100, 100);
});
        </code>
        <div class="title">
3. updated
解释：在数据更新导致 DOM 重新渲染之后调用。当响应式数据发生变化时，Vue 会重新渲染组件，渲染完成后会触发 updated 钩子。
应用场景：可以在这个阶段进行一些需要根据最新 DOM 状态进行的操作，比如更新第三方库的状态。
示例：
        </div>
        <code>
import { ref, onUpdated } from 'vue';
const count = ref(0);

onUpdated(() => {
  // 每次数据更新后，在控制台输出当前的 count 值
  console.log('Count updated:', count.value);
});
        </code>
        <div class="title">
4. beforeUnmount
解释：在组件实例被销毁之前调用。此时，组件仍然完全正常。
应用场景：可以在这个阶段进行一些清理工作，比如清除定时器、取消事件监听器、取消网络请求等，以避免内存泄漏。
示例：
        </div>
        <code>
import { ref, onBeforeUnmount, onMounted } from 'vue';
const message = ref('Hello');
let timer;

onMounted(() => {
  // 设置一个定时器
  timer = setInterval(() => {
    message.value = 'Updated message';
  }, 1000);
});

onBeforeUnmount(() => {
  // 在组件销毁前清除定时器
  clearInterval(timer);
});
        </code>
      </pre>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.container {
  height: 100%;
  .life-cycle {
    height: 1000px;
    width: 620px;
    background: url("../../assets/lifecycle.png");
    background-size: cover;
    background-position: center;
  }

  .title {
    font-size: 1.25rem;
  }
}
</style>
