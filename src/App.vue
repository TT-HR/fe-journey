<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo"
import TodoItem from "./components/TodoItem.vue";

const todoStore = useTodoStore()

const finishTodo = computed(() => todoStore.todos.filter((e) => e.done === true));
const todoing = computed(() => todoStore.todos.filter((e) => e.done === false));
const filter = ref<'all' | 'completed' | 'active'>('all')
const todos = computed(() => {
  if (filter.value === 'completed') {
    return todoStore.todos.filter((e) => e.done === true);
  } else if (filter.value === 'active') {
    return todoStore.todos.filter((e) => e.done === false);
  } else {
    return todoStore.todos;
  }
})

//加载数据
onMounted(async () => {
  todoStore.fetchTodos()
})

const newToDo = ref("");

function clearNewToDo() {
  if (newToDo.value.trim() === "") {
    return;
  }
  todoStore.addToDo(newToDo.value)
  newToDo.value = "";
}

function clean() {

}


</script>

<template>

  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <h1 class="text-2xl font-bold">TO-DO LIST</h1>
      <div class="filters space-x-2">
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" @click="filter = 'all'">全部</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="filter = 'completed'">已完成</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="filter = 'active'">未完成</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" @click="clean">清空</button>
      </div>

      <div class="flex gap-2">
        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" @keyup.enter="clearNewToDo"
          placeholder="请输入任务" />
        <button @click="clearNewToDo" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add
        </button>
      </div>

      <transition-group name="fade" tag="ul">
        <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="todoStore.delTodo(todo.id)"
          @toggle="todoStore.toggleTodo(todo.id)" @updateTodo="todoStore.upTodo(todo.id, todo.title)" />
      </transition-group>
      <div class="">
        <span class="text-sm text-gray-600">
          总任务数: <span class="font-bold">{{ todoStore.todos.length }}</span>
        </span>
        <span class="text-sm text-gray-600">
          已完成数: <span class="font-bold">{{ finishTodo.length }}</span>
        </span>
        <span class="text-sm text-gray-600">
          未完成数: <span class="font-bold">{{ todoing.length }}</span>
        </span>
      </div>
    </div>


  </div>

</template>

<style scoped>
/* 进入 & 离开 */
:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: all 0.5s ease;
}
:deep(.fade-enter-from) {
  opacity: 0;
  transform: translateY(10px);
}
:deep(.fade-leave-to) {
  opacity: 0;
  transform: translateY(-10px);
}
:deep(.fade-leave-active) {
  position: absolute; /* 避免塌陷抖动 */
}
.done {
  text-decoration: line-through;
  color: gray;
}

.filters {
  margin-bottom: 10px;
}

.filters button {
  margin-right: 8px;
}
</style>
