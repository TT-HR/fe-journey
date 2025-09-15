<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useTodoStore } from "@/stores/todo"
import TodoItem from "./components/TodoItem.vue";

const todoStore = useTodoStore()

const finishTodo = computed(() => todoStore.todos.filter((e) => e.done === true));
const todoing = computed(() => todoStore.todos.filter((e) => e.done === false));
const filter = ref<'all' | 'completed' | 'active'>('all')
const todos = computed(() => {
  let list = todoStore.todos

  if (filter.value === 'completed') {
    list = list.filter(e => e.done === true);
  } else if (filter.value === 'active') {
    list = list.filter(e => e.done === false);
  }
  if (searchText) {
    list = list.filter((e) => e.title.toLowerCase().includes(searchText.value.toLowerCase()))
  }
  return list
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
  todoStore.todos.forEach(todo => {
    todoStore.delTodo(todo.id)
  })
}

const searchText = ref("");
const isSearch = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null)
function searchEdit() {
  isSearch.value = !isSearch.value;
  if (isSearch.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

</script>

<template>

  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <h1 class="text-2xl font-bold">TO-DO LIST</h1>
      <div class="filters flex items-center">
        <button v-if="!isSearch"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600"
          @click="filter = 'all'">全部</button>
        <button v-if="!isSearch"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600"
          @click="filter = 'completed'">已完成</button>
        <button v-if="!isSearch"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600"
          @click="filter = 'active'">未完成</button>
        <button v-if="!isSearch"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600"
          @click="clean">清空</button>

        <div
          class="relative flex justify-end flex-row-reverse items-center transition-all duration-300 ease-in-out overflow-hidden border rounded"
          :class="isSearch ? 'w-64 border-gray-300 bg-white' : 'w-9 border-transparent bg-transparent'">
          <input v-show="isSearch" ref="searchInputRef" type="text" placeholder="搜索..."
            class="flex-1 px-3 py-2 outline-none bg-transparent text-gray-700 text-sm" v-model="searchText" />
        </div>
        <!-- 按钮 -->
        <button class="ml- px-2 py-2 text-black rounded hover:bg-gray-200 transition-colors" @click="searchEdit">
          <img src="./assets/img/search.png" alt="搜索" class="w-4 h-4" />
        </button>

      </div>
      <div class="flex gap-2">
        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" @keyup.enter="clearNewToDo"
          placeholder="请输入任务" />
        <button @click="clearNewToDo"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600">
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
  position: absolute;
  /* 避免塌陷抖动 */
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
