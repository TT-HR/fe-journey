<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import TodoItem from "./components/TodoItem.vue";

// todolist
interface ToDo {
  id: number;
  title: string;
  done: boolean;
}

const todos = ref<ToDo[]>([]);
const finishTodo = computed(() => todos.value.filter((e) => e.done === false));
const todoing = computed(() => todos.value.filter((e) => e.done === true));

const filter = ref<'all' | 'completed' | 'active'>('all')

const filterDataTodo = computed(() => {
  if (filter.value === 'completed') {
    return todos.value.filter((e) => e.done === true);
  } else if (filter.value === 'active') {
    return todos.value.filter((e) => e.done === false);
  } else {
    return todos.value;
  }
})

const newToDo = ref("");

function addToDo() {
  if (!newToDo.value.trim()) return;
  todos.value.push({
    id: Date.now(),
    title: newToDo.value.trim(),
    done: false,
  });
  newToDo.value = "";
}

//页面加载时从localStorage读取数据显示
onMounted(() => {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos.value = JSON.parse(saved);
  }
});
//localStorage，将数据存入localStorage
watch(
  todos,
  (newVal) => {
    localStorage.setItem("todos", JSON.stringify(newVal));
  },
  { deep: true }
);

function clean(){
  todos.value = [];
  localStorage.setItem("todos",JSON.stringify([]))
}

function toggleTodo(id: number) {
  const todo = todos.value.find((e) => e.id === id);
  if (todo) todo.done = !todo.done;
}

function deleteTodo(id: number) {
  todos.value = todos.value.filter((e) => e.id !== id);
}

function updateTodo({ id, title }: ToDo) {
  const fondTodo = todos.value.find((e) => e.id === id);
  if (fondTodo)
    fondTodo.title = title
}

</script>

<template>

  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <h1 class="text-2xl font-bold">TO-DO LIST</h1>
      <div class="space-x-2">
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" @click="filter = 'all'">全部</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="filter = 'completed'">已完成</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="filter = 'active'">未完成</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="clean">清空</button>
      </div>

      <div class="flex gap-2">

        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" @keyup.enter="addToDo" placeholder="请输入任务" />
        <button @click="addToDo" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          add
        </button>
      </div>

      <ul>
        <TodoItem v-for="todo in filterDataTodo" :key="todo.id" :todo="todo" @delete="deleteTodo" @toggle="toggleTodo"
        
          @updateTodo="updateTodo" />
      </ul>
      <div class="">
        <span class="text-sm text-gray-600">
          总任务数: <span class="font-bold">{{ todos.length }}</span>
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

<style></style>
