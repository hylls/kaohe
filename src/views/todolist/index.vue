<template>
  <div class="todo-page">
    <div class="todo-list">
      <h2>TODO-LIST</h2>
      <todo-filter :filter="filter" @update-filter="updateFilter" />
      <div class="input-container">
        <input
          class="new-item-input"
          type="text"
          v-model="newTodoText"
          id="new-todo"
          placeholder="请搜索"
        />
        <button @click="addVisible = true" class="btn-input">添加</button>
      </div>
      <todo-list
        :filteredTodos="filteredTodos"
        @currentClick="currentTodoClick"
        @remove="removeTodo"
        @done="doneTodo"
        @edit="(index, content) => editContent(index, content)"
      />
      <button
        @click="download"
        style="margin-top: 10px"
        v-if="todos.length"
        class="btn-input"
      >
        下载当前待办事项文件
      </button>

      <el-dialog
        @close="addDialogClose"
        v-model="addVisible"
        title="新增待办事项"
        width="500"
      >
        <el-form :model="addForm">
          <el-form-item label="标题" :label-width="'140px'">
            <el-input v-model="addForm.title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="内容" :label-width="'140px'">
            <el-input
              type="textarea"
              v-model="addForm.content"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="addVisible = false">取消</el-button>
            <el-button type="primary" @click="addNewTodo"> 确定 </el-button>
          </div>
        </template>
      </el-dialog>

      <div class="stats">
        <span>总计: {{ totalTodos }} 项</span>
        <span>已完成: {{ completedTodos }} 项</span>
      </div>
    </div>
    <right-page :currentTodo="currentTodo" :clearRightItem="clearRightItem" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import TodoFilter from "./todo-filter.vue";
import RightPage from "./right-page.vue";
import TodoList from "./todo-list.vue";
import { downloadJSON } from "../../utils/download.js";
import moment from "moment";

const newTodoText = ref("");

const currentTodoId = ref(0);

const todosData = JSON.parse(localStorage.getItem("todos") || "null") || [];

const todos = ref(todosData);

const currentTodo = computed(() => {
  const t = todos.value.find((t) => t.id === currentTodoId.value);

  if (t) {
    return t;
  } else {
    return {};
  }
});

const filter = ref("all");
const addVisible = ref(false);

const addForm = reactive({
  title: "",
  content: "",
});

const clearRightItem = () => {
  currentTodoId.value = 0;
};

// 保存待办事项列表到 localStorage 的方法
function saveData() {
  const storageData = JSON.stringify(todos.value);
  localStorage.setItem("todos", storageData);
}

const editContent = (index, content) => {
  todos.value[index].content = content;
  todos.value[index].date = moment().format("YYYY-MM-DD HH:mm:ss");
  saveData();
};

// 添加待办事项的方法
const addNewTodo = () => {
  if (addForm.title) {
    todos.value.push({
      id: Math.random(),
      title: addForm.title,
      isDone: false,
      content: addForm.content,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    addVisible.value = false;
    saveData();
  }
};

// 删除待办事项的方法
const removeTodo = (index) => {
  todos.value.splice(index, 1);
  saveData();
};

// 完成待办事项的方法
const doneTodo = (index) => {
  todos.value[index].isDone = !todos.value[index].isDone;
  saveData();
};

// 选择当前todo
const currentTodoClick = (id) => {
  currentTodoId.value = id;
};

// 下载json文件
const download = () => {
  if (todos.value) {
    downloadJSON(todos.value);
  }
};

// 更新筛选条件
const updateFilter = (newFilter) => {
  filter.value = newFilter;
};

// 计算属性
const filteredTodos = computed(() => {
  const newTodos = todos.value.filter((todo) =>
    todo.title.includes(newTodoText.value)
  );
  switch (filter.value) {
    case "active":
      return newTodos.filter((todo) => !todo.isDone);
    case "completed":
      return newTodos.filter((todo) => todo.isDone);
    default:
      return newTodos;
  }
});

const totalTodos = computed(() => todos.value.length);
const completedTodos = computed(
  () => todos.value.filter((t) => t.isDone).length
);

const addDialogClose = () => {
  addForm.title = "";
  addForm.content = "";
};
</script>

<style scoped lang="less">
.todo-page {
  display: flex;
  height: 100%;

  .todo-list {
    width: 70%;

    .stats {
      margin-top: 20px;
      font-size: 14px;
      color: #666;

      span {
        margin-right: 10px;
      }
    }

    .btn-input {
      cursor: pointer;
      color: white;
      font-weight: 600;
      padding: 0.7rem 2rem;
      border-radius: 0.4rem;
      background-color: #41b883;
    }

    .btn-input:hover {
      background-color: #358b64;
    }

    .input-container {
      display: flex;
      column-gap: 1rem;

      .new-item-input {
        font-weight: 600;
        color: #151515;
        border: none;
        border-radius: 0.4rem;
        border: solid 2px #343434;
        padding: 0.8rem;
        flex: 1;
      }

      .new-item-input:hover,
      .new-item-input:active,
      .new-item-input:focus {
        transition: all ease-in-out 0.3s;
        border-color: #41b883;
      }

      .new-item-input::placeholder {
        color: #151515;
        opacity: 0.6;
      }
    }

    .task {
      background: #99ccff;
      color: white;
      border-radius: 0.6rem;
      padding: 1rem;
      line-height: 2.5rem;
      font-size: 1.3rem;
    }
  }

  .right-item {
    padding-top: 20px;
    margin-left: 20px;
    flex: 1;
    background-color: #f0f2f5;
    padding: 1rem;
  }
}
</style>
