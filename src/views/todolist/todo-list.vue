<template>
  <div v-if="props.filteredTodos" style="margin: 20px 0">
    <el-table :data="props.filteredTodos" v-if="props.filteredTodos.length">
      <el-table-column prop="title" label="标题">
        <template #default="scope">
          <el-link type="primary" @click="currentClick(scope.row.id)">{{scope.row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="时间" />
      <el-table-column prop="isDone" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.isDone ? 'success' : 'warning'">{{
            scope.row.isDone ? "完成" : "未完成"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="260" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="() => done(scope.$index)"
          >
            标记
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="() => editClick(scope.$index)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="() => remove(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted  } from "vue";

const props = defineProps({
  filteredTodos: Array,
});

const emit = defineEmits();

const centerDialogVisible = ref(false);
const currentIndex = ref(0);

const form = reactive({
  title: '',
  content: '',
});

onMounted(() => {
  if (props.filteredTodos.length) {
    form.title = props.filteredTodos[currentIndex.value].title;
    form.content = props.filteredTodos[currentIndex.value].content;
  }
})


const editClick = (index) => {
  currentIndex.value = index;
  centerDialogVisible.value = true;
}

const saveTodoItem = () => {
  emit("edit", currentIndex.value, form.content);
  centerDialogVisible.value = false;
};

const done = (index) => {
  emit("done", index);
};

const remove = (index) => {
  emit("remove", index);
};

const currentClick = (id) => {
  emit("currentClick", id);
};


</script>
