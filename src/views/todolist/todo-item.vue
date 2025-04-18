<!--公用组件：todo-item

      /**

      * 组件名称

      * @module components

      * @desc todolist的item组件

      * @author 周宏毅

      * @date 2025年4月16日

      * @param {string} [title]    - 显示内容

      * @param {Boolean} [isDone] - 是否完成

      * @example 调用示例

      *  <todo-item v-for="(todo, index) in todos" :key="todo.id" :title="todo.title" :isDone="todo.isDone"
        @remove="() => removeTodo(index)" @done="() => doneTodo(index)"></todo-item>

          */

       -->
<template>
  <li class="todo-item">
    <input type="checkbox" name="cBox" v-model="props.todo.isDone" @click="done" />
    <span
      @click="() => currentClick(props.todo.id)"
      :class="{ deleteSpan: props.todo.isDone }"
      >{{ props.todo.title }}</span
    >
    <span style="margin-left: auto; color: black">{{ props.todo.date }}</span>
    <div class="btns">
      <button
        @click="centerDialogVisible = true"
        style="margin-right: 10px"
        class="button-default"
      >
        编辑
      </button>
      <button class="button-default" @click="remove">删除</button>
    </div>
    <el-dialog
      @close="centerDialogVisible = false"
      v-model="centerDialogVisible"
      title="代办编辑"
      width="500"
      center
    >
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" disabled>{{ form.title }}</el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content">{{
            form.content
          }}</el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveTodoItem"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </li>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

const props = defineProps({
  todo: {
    title: String,
    content: String,
    isDone: Boolean,
    id: Number,
    date: String,
  },
});

const form = reactive({
  title: props.todo.title,
  content: props.todo.content,
});

const centerDialogVisible = ref(false);

const emit = defineEmits();

const saveTodoItem = () => {
  emit("edit", form.content);
  centerDialogVisible.value = false;
};

const done = () => {
  emit("done");
};

const remove = () => {
  emit("remove");
};

const currentClick = (id) => {
  emit("currentClick", id);
};
</script>

<style scoped lang="less">
.todo-item {
  display: flex;
  align-items: center;

  .btns {
    display: flex;
    align-items: center;
    margin-left: 40px;
  }

  .button-default {
    font-size: 0.6rem;
  }

  .deleteSpan {
    text-decoration: line-through;
    transition: all ease-in-out 0.8s;
  }
}
</style>
