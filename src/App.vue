<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useTodoStore } from "@/stores/todo"
import TodoItem from "./components/TodoItem.vue";
import { tr } from "zod/locales";

const todoStore = useTodoStore()

//当前页数
const currentPage = ref(1)
//条数
const pageSize = 5

//筛选
const finishTodo = computed(() => todoStore.todos.filter((e) => e.done === true));
const todoing = computed(() => todoStore.todos.filter((e) => e.done === false));
const filter = ref<'all' | 'completed' | 'active'>('all')
const searchText = ref("");

//筛选后条数
const todosLen = ref(0)
//列表数据
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
  todosLen.value = list.length
  //第n页的开始条数
  const start = (currentPage.value - 1) * pageSize
  return list.slice(start, start + pageSize)
})

//总条数
const totalNum = todosLen
//总页数
const totalPage = computed(() => Math.ceil(totalNum.value / pageSize))
// 是否能点上一页
const canPrev = computed(()=>currentPage.value === 1)
// 是否能点下一页
const canNext = computed(()=>currentPage.value === totalPage.value)
//上一页
function latePage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
//下一页
function nextPage() {
  if (currentPage.value < totalPage.value) {
    currentPage.value++
  }
}

//加载数据
onMounted(async () => {
  todoStore.fetchTodos()
})

//添加并清空输入框
const newToDo = ref("");

function clearNewToDo() {
  if (newToDo.value.trim() === "") {
    return;
  }
  todoStore.addToDo(newToDo.value)
  newToDo.value = "";
}

//清空
function clean() {
  todoStore.todos.forEach(todo => {
    todoStore.delTodo(todo.id)
  })
}

//编辑
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
      <h1 class="text-2xl font-bold font-eng">TO-DO LIST</h1>
      <div class="filters flex items-center font-cn">
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

      <div class="flex gap-2 font-cn">
        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" @keyup.enter="clearNewToDo"
          placeholder="请输入任务" />
        <button @click="clearNewToDo"
          class="px-3 py-1 bg-blue-500 text-white rounded border border-transparent hover:border-blue-600 hover:bg-blue-600">
          添加
        </button>
      </div>

      <transition-group name="fade" tag="ul">
        <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="todoStore.delTodo(todo.id)"
          @toggle="todoStore.toggleTodo(todo.id)" @updateTodo="todoStore.upTodo(todo.id, todo.title)" />
      </transition-group>

      <div class="flex justify-center items-center">
        <button class="px-3 py-1 text-sm rounded border-transparent hover:bg-gray-100" @click="latePage" :disabled="canPrev">
          < 上一页</button>
            <span class="px-3 py-1 text-sm">第{{ currentPage }}/{{ totalPage }}页</span>
            <button class="px-3 py-1 text-sm rounded border-transparent hover:bg-gray-100" @click="nextPage" :disabled="canNext">下一页 ></button>
      </div>
      <div class="flex justify-center items-center gap-2">
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
