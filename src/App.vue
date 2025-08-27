<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getTodo, addTodo, upTodo, delTodo, type ToDo } from "./api/todo.ts"
import TodoItem from "./components/TodoItem.vue";


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

async function addToDo() {
  const title = newToDo.value.trim()
  if (!title) return;
  const todo: ToDo = { id: Date.now(), title, done: false }
  // 请求保存接口
  addTodo(todo)
  // 刷新列表
  todos.value = await getTodo()

  newToDo.value = "";
}

//页面加载时从接口读取数据显示
onMounted(async () => {
  todos.value = await getTodo()
});


function clean() {
  todos.value = [];
  localStorage.setItem("todos", JSON.stringify([]))
}

function toggleTodo(id: number) {
  const todo = todos.value.find((e) => e.id === id);
  if (todo) todo.done = !todo.done;
}

async function deleteTodo(id: number) {
  await delTodo(id)
}

async function updateTodo({id,title}:ToDo) {
  await upTodo(id, {"title":title})
  todos.value = await getTodo()
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
        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" @keyup.enter="addToDo" placeholder="请输入任务" />
        <button @click="addToDo" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          add
        </button>
      </div>

      <transition-group name="fade" tag="ul" mode="out-in">
        <TodoItem v-for="todo in filterDataTodo" :key="todo.id" :todo="todo" @delete="deleteTodo" @toggle="toggleTodo"
          @updateTodo="updateTodo" />
      </transition-group>
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

<style scoped>
/* 进入 & 离开 */
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}

/* 初始状态 */
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
