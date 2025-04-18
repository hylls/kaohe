<template>
  <div class="todo-filter">
    <button
      v-for="option in filterOptions"
      :key="option.value"
      :class="{ active: filter === option.value }"
      @click="$emit('update-filter', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: String,
      required: true,
    },
  },

  emits: ["update-filter"],

  setup() {
    const filterOptions = [
      { value: "all", label: "全部" },
      { value: "active", label: "未完成" },
      { value: "completed", label: "已完成" },
    ];

    return {
      filterOptions,
    };
  },
};
</script>

<style>
.todo-filter {
  margin-bottom: 20px;
}

.todo-filter button {
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
}

.todo-filter button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.todo-filter button:hover {
  background-color: #e0e0e0;
}

.todo-filter button.active:hover {
  background-color: #3aa876;
}
</style>
